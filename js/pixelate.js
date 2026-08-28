import { GRID, PIXEL_RES } from "./paintings.js";

const cache = new Map();

function loadImage(url, cors) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (cors) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
    img.src = url;
  });
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);
}

function coverCrop(img) {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const side = Math.min(nw, nh);
  const sx = Math.max(0, Math.floor((nw - side) / 2));
  const sy = nh > nw ? 0 : Math.max(0, Math.floor((nh - side) / 2));
  return { sx, sy, sw: side, sh: side };
}

export function pixelateImage(img, pixelRes = PIXEL_RES) {
  const { sx, sy, sw, sh } = coverCrop(img);
  const small = document.createElement("canvas");
  small.width = pixelRes;
  small.height = pixelRes;
  const sctx = small.getContext("2d");
  sctx.imageSmoothingEnabled = false;
  sctx.drawImage(img, sx, sy, sw, sh, 0, 0, pixelRes, pixelRes);

  const scale = 4;
  const large = document.createElement("canvas");
  large.width = pixelRes * scale;
  large.height = pixelRes * scale;
  const lctx = large.getContext("2d");
  lctx.imageSmoothingEnabled = false;
  lctx.drawImage(small, 0, 0, large.width, large.height);

  return { small, large, dataUrl: large.toDataURL("image/png") };
}

export function slicePieces(large, grid = GRID) {
  const size = Math.floor(large.width / grid);
  const urls = [];
  for (let i = 0; i < grid * grid; i++) {
    const col = i % grid;
    const row = Math.floor(i / grid);
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      large,
      col * size,
      row * size,
      size,
      size,
      0,
      0,
      size,
      size
    );
    urls.push(c.toDataURL("image/png"));
  }
  return urls;
}

function remoteUrls(painting) {
  const urls = [`assets/original/${painting.id}.jpg`];
  if (painting.uuid) {
    urls.push(
      `https://api.nga.gov/iiif/${painting.uuid}/full/!800,800/0/default.jpg`
    );
  }
  if (painting.remote) urls.push(painting.remote);
  return urls;
}

export async function loadAndPixelate(painting) {
  if (cache.has(painting.id)) return cache.get(painting.id);

  let img = null;
  const urls = remoteUrls(painting);
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const local = url.startsWith("assets/");
    try {
      img = await withTimeout(loadImage(url, !local), local ? 8000 : 8000);
      break;
    } catch {
      img = null;
    }
  }
  if (!img) throw new Error(`Could not load ${painting.id}`);

  const result = pixelateImage(img);
  result.slices = slicePieces(result.large);
  cache.set(painting.id, result);
  return result;
}
