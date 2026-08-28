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

function isPale(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= 178 && max - min <= 58;
}

/** Drop scan/paper mats when all four edges are pale. Never letterbox. */
function trimPaleMat(img) {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const maxEdge = 180;
  const scale = Math.min(1, maxEdge / Math.max(nw, nh));
  const cw = Math.max(8, Math.floor(nw * scale));
  const ch = Math.max(8, Math.floor(nh * scale));
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, cw, ch);
  const { data } = ctx.getImageData(0, 0, cw, ch);
  const at = (x, y) => {
    const i = (y * cw + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const colPale = (x) => {
    let n = 0;
    const step = Math.max(1, Math.floor(ch / 48));
    let samples = 0;
    for (let y = 0; y < ch; y += step) {
      samples += 1;
      if (isPale(...at(x, y))) n += 1;
    }
    return n / samples >= 0.82;
  };
  const rowPale = (y) => {
    let n = 0;
    const step = Math.max(1, Math.floor(cw / 48));
    let samples = 0;
    for (let x = 0; x < cw; x += step) {
      samples += 1;
      if (isPale(...at(x, y))) n += 1;
    }
    return n / samples >= 0.82;
  };

  if (!(colPale(0) && colPale(cw - 1) && rowPale(0) && rowPale(ch - 1))) {
    return { sx: 0, sy: 0, sw: nw, sh: nh };
  }

  let l = 0;
  let r = cw - 1;
  let t = 0;
  let b = ch - 1;
  const cap = Math.floor(Math.min(cw, ch) * 0.16);
  while (l < cap && colPale(l)) l += 1;
  while (r > cw - 1 - cap && colPale(r)) r -= 1;
  while (t < cap && rowPale(t)) t += 1;
  while (b > ch - 1 - cap && rowPale(b)) b -= 1;

  const sx = Math.floor((l / cw) * nw);
  const sy = Math.floor((t / ch) * nh);
  const sw = Math.max(8, Math.ceil(((r - l + 1) / cw) * nw));
  const sh = Math.max(8, Math.ceil(((b - t + 1) / ch) * nh));
  return {
    sx,
    sy,
    sw: Math.min(sw, nw - sx),
    sh: Math.min(sh, nh - sy),
  };
}

function coverCrop(img) {
  const box = trimPaleMat(img);
  let { sx, sy, sw, sh } = box;
  const side = Math.min(sw, sh);
  sx += Math.floor((sw - side) / 2);
  if (sh > sw) {
    sy += Math.floor((sh - side) * 0.18);
  } else {
    sy += Math.floor((sh - side) / 2);
  }
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
  const urls = [`assets/original/${painting.id}.jpg?v=crop3`];
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
