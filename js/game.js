import {
  ARTISTS,
  PIECE_COUNT,
  paintingsByArtist,
  paintingById,
} from "./paintings.js";
import { loadAndPixelate } from "./pixelate.js?v=crop4";
import { Sfx, AMBIENCES } from "./audio.js?v=cozy6";

const sfx = new Sfx();

const HOOKS = [
  { left: "26.5%", top: "21.0%", size: "small" },
  { left: "50.0%", top: "21.0%", size: "small" },
  { left: "73.5%", top: "21.0%", size: "small" },
  { left: "50.0%", top: "39.2%", featured: true },
  { left: "26.5%", top: "39.2%", size: "medium" },
  { left: "73.5%", top: "39.2%", size: "medium" },
];

const state = {
  screen: "title",
  painting: null,
  mode: "solo",
  art: null,
  pieces: [],
  placed: 0,
  scores: [0, 0],
  turn: 0,
  completed: new Set(),
  dragging: null,
  bookView: "artists",
  bookArtist: null,
  wall: [null, null, null, null, null, null],
  hangSlot: null,
  pickingHook: null,
};

const $ = (id) => document.getElementById(id);

const els = {
  title: $("screen-title"),
  gallery: $("screen-gallery"),
  puzzle: $("screen-puzzle"),
  enter: $("btn-enter"),
  btnTitle: $("btn-title"),
  frameLayer: $("frame-layer"),
  galleryStage: $("gallery-stage"),
  galleryArt: $("gallery-art"),
  galleryBg: $("gallery-bg"),
  hungCount: $("hung-count"),
  modeModal: $("modal-mode"),
  modePreview: $("mode-preview"),
  modeTitle: $("mode-title"),
  modeArtist: $("mode-artist"),
  btnSolo: $("btn-solo"),
  btnVersus: $("btn-versus"),
  btnModeCancel: $("btn-mode-cancel"),
  completeModal: $("modal-complete"),
  winnerRow: $("winner-row"),
  winnerText: $("winner-text"),
  completeSummary: $("complete-summary"),
  btnAgain: $("btn-again"),
  btnGallery: $("btn-gallery"),
  loading: $("loading"),
  board: $("board"),
  tray: $("tray"),
  puzzleTitle: $("puzzle-title"),
  puzzleArtist: $("puzzle-artist"),
  puzzleHud: $("puzzle-hud"),
  turnBanner: $("turn-banner"),
  refThumb: $("ref-thumb"),
  btnHome: $("btn-home"),
  btnGalleryHome: $("btn-gallery-home"),
  confetti: $("confetti"),
  bookModal: $("modal-book"),
  bookHeading: $("book-heading"),
  bookSub: $("book-sub"),
  bookGrid: $("book-grid"),
  btnBookBack: $("btn-book-back"),
  btnBook: $("btn-book"),
  hangBanner: $("hang-banner"),
  btnHang: $("btn-hang"),
  btnSwap: $("btn-swap"),
  btnSettings: $("btn-settings"),
  btnSettingsPuzzle: $("btn-settings-puzzle"),
  settingsPop: $("settings-pop"),
  ambienceList: $("ambience-list"),
  ambienceVol: $("ambience-vol"),
};

function fitBoard() {
  const cell = Math.max(
    40,
    Math.min(
      86,
      Math.floor(Math.min(window.innerWidth * 0.135, window.innerHeight * 0.11))
    )
  );
  document.documentElement.style.setProperty("--cell", `${cell}px`);
}

function fitGallery() {
  const stage = els.galleryStage;
  const art = els.galleryArt;
  const img = els.galleryBg;
  if (!stage || !art || !img) return;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const sw = stage.clientWidth;
  const sh = stage.clientHeight;
  if (sw < 8 || sh < 8) return;
  const scale = Math.max(sw / iw, sh / ih);
  const dw = Math.ceil(iw * scale);
  const dh = Math.ceil(ih * scale);
  art.style.width = `${dw}px`;
  art.style.height = `${dh}px`;
  art.style.left = `${Math.round((sw - dw) / 2)}px`;
  art.style.top = `${Math.round((sh - dh) / 2)}px`;
}

function showScreen(name) {
  state.screen = name;
  els.title.classList.toggle("active", name === "title");
  els.gallery.classList.toggle("active", name === "gallery");
  els.puzzle.classList.toggle("active", name === "puzzle");
  if (name === "puzzle") fitBoard();
  if (name === "gallery") requestAnimationFrame(fitGallery);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hungCount() {
  return state.wall.filter(Boolean).length;
}

function ensureHung(painting) {
  if (!painting) return;
  if (state.wall.includes(painting.id)) return;
  const slotOk =
    Number.isInteger(state.modeSlot) &&
    state.modeSlot >= 0 &&
    state.wall[state.modeSlot] == null;
  const preferred = slotOk
    ? state.modeSlot
    : state.wall.findIndex((id) => id == null);
  if (preferred >= 0) state.wall[preferred] = painting.id;
}

function hangOnWall(slot, painting) {
  const id = painting.id;
  const already = state.wall.indexOf(id);
  if (already === slot) {
    state.hangSlot = null;
    state.pickingHook = null;
    updateHangBanner();
    renderGallery();
    return;
  }
  if (already >= 0) {
    const swapped = state.wall[slot];
    state.wall[already] = swapped;
    state.wall[slot] = id;
  } else {
    state.wall[slot] = id;
  }
  state.hangSlot = null;
  state.pickingHook = null;
  updateHangBanner();
  sfx.twinkle();
  renderGallery();
}

function updateHangBanner() {
  const banner = els.hangBanner;
  if (!banner) return;
  if (state.pickingHook) {
    banner.hidden = false;
    banner.textContent = `Tap a frame to hang “${state.pickingHook.title}” — this wall is only for this visit.`;
  } else {
    banner.hidden = true;
  }
}

function renderGallery() {
  els.frameLayer.innerHTML = "";
  HOOKS.forEach((hook, i) => {
    const painting = paintingById(state.wall[i]);
    const empty = !painting;
    const done = painting ? state.completed.has(painting.id) : false;
    const featured = !!hook.featured;
    const size = featured ? "centerpiece" : hook.size || "small";
    const wrapping = document.createElement("div");
    wrapping.className =
      "hook-wrap" +
      (size === "centerpiece" ? " centerpiece" : size === "medium" ? " medium" : " small") +
      (state.pickingHook ? " picking" : "") +
      (empty ? " empty" : done ? " done" : " preview");
    wrapping.style.left = hook.left;
    wrapping.style.top = hook.top;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "hung-frame" + (empty ? " empty" : done ? " done" : " preview");
    btn.dataset.slot = String(i);
    if (painting) btn.dataset.id = painting.id;
    btn.setAttribute(
      "aria-label",
      empty
        ? featured
          ? "Empty centrepiece frame. Hang a painting from the catalogue."
          : "Empty frame. Hang a painting from the catalogue."
        : `${painting.title} by ${painting.artist}`
    );
    const chrome =
      size === "centerpiece"
        ? "assets/ui/frame-ornate.png?v=crop3"
        : size === "medium"
          ? "assets/ui/frame-medium.png?v=crop3"
          : "assets/ui/frame-small.png?v=crop3";
    btn.innerHTML = `
      <img class="frame-chrome" src="${chrome}" alt="" />
      <span class="frame-inner">
        <span class="qmark">?</span>
        <img class="hung-art" alt="" />
      </span>
    `;

    if (painting) {
      wrapping.classList.add("has-art");
      btn.classList.add("has-art");
      const art = btn.querySelector(".hung-art");
      art.src = painting._thumb || `assets/original/${painting.id}.jpg?v=crop4`;
      loadAndPixelate(painting)
        .then((pix) => {
          painting._thumb = pix.dataUrl;
          if (art.isConnected) art.src = pix.dataUrl;
        })
        .catch(() => {});
    }

    btn.addEventListener("click", () => {
      if (state.pickingHook) {
        hangOnWall(i, state.pickingHook);
        return;
      }
      if (empty) {
        state.hangSlot = i;
        openBook("artists");
        return;
      }
      openModeSelect(painting, i);
    });

    const swap = document.createElement("button");
    swap.type = "button";
    swap.className = "swap-hook";
    swap.textContent = empty ? "Hang" : "Change";
    swap.setAttribute(
      "aria-label",
      empty
        ? "Hang a painting in this frame"
        : `Hang a different work instead of ${painting.title}`
    );
    swap.addEventListener("click", (e) => {
      e.stopPropagation();
      state.hangSlot = i;
      state.pickingHook = null;
      updateHangBanner();
      openBook("artists");
    });

    wrapping.append(btn);
    if (!state.pickingHook) wrapping.append(swap);
    els.frameLayer.appendChild(wrapping);
  });
  els.hungCount.textContent = String(hungCount());
  updateHangBanner();
  requestAnimationFrame(fitGallery);
}

function openBook(view = "artists", artistId = null) {
  sfx.tick();
  closeMode();
  state.bookView = view;
  state.bookArtist = artistId;
  els.bookModal.hidden = false;
  renderBook();
}

function closeBook() {
  els.bookModal.hidden = true;
}

function renderBook() {
  els.bookGrid.innerHTML = "";
  const hanging = state.hangSlot != null;
  if (state.bookView === "artists") {
    els.bookHeading.textContent = hanging ? "Dress this hook" : "Catalogue";
    els.bookSub.textContent = hanging
      ? "Pick an artist, then a painting for this frame. Your wall lasts this visit only."
      : "Choose an artist — each has a wall of paintings.";
    els.btnBookBack.textContent = "Back to gallery";
    ARTISTS.forEach((artist) => {
      const works = paintingsByArtist(artist.id);
      const onWall = works.filter((w) => state.wall.includes(w.id)).length;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "catalog-card artist-card";
      btn.innerHTML = `
        <strong>${artist.name}</strong>
        <small>${artist.years}</small>
        <span>${works.length} paintings · ${onWall} on your wall</span>
      `;
      btn.addEventListener("click", () => openBook("works", artist.id));
      els.bookGrid.appendChild(btn);
    });
    return;
  }

  const artist = ARTISTS.find((a) => a.id === state.bookArtist);
  const works = paintingsByArtist(state.bookArtist);
  els.bookHeading.textContent = artist ? artist.name : "Paintings";
  els.bookSub.textContent = hanging
    ? "Tap a canvas to hang it on that hook for this visit."
    : artist
      ? `${artist.note}. Tap a canvas to restore it — or hang it on your wall.`
      : "";
  els.btnBookBack.textContent = "All artists";
  works.forEach((painting) => {
    const onWall = state.wall.includes(painting.id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "catalog-card work-card" +
      (state.completed.has(painting.id) ? " hung" : "") +
      (onWall ? " on-wall" : "");
    const src = painting._thumb || `assets/original/${painting.id}.jpg?v=crop4`;
    btn.innerHTML = `
      <img src="${src}" alt="" />
      <strong>${painting.title}</strong>
      <small>${painting.year}${onWall ? " · on your wall" : ""}</small>
    `;
    btn.addEventListener("click", () => {
      closeBook();
      if (state.hangSlot != null) {
        hangOnWall(state.hangSlot, painting);
        return;
      }
      openModeSelect(painting);
    });
    els.bookGrid.appendChild(btn);
    loadAndPixelate(painting)
      .then((art) => {
        painting._thumb = art.dataUrl;
        const img = btn.querySelector("img");
        if (img) img.src = art.dataUrl;
      })
      .catch(() => {});
  });
}

async function openModeSelect(painting, slot = null) {
  sfx.tick();
  state.painting = painting;
  const onWall = state.wall.indexOf(painting.id);
  state.modeSlot =
    slot != null
      ? slot
      : onWall >= 0
        ? onWall
        : state.wall.findIndex((id) => id == null);
  els.modeTitle.textContent = painting.title;
  els.modeArtist.textContent = `${painting.artist}, ${painting.year}`;
  els.modePreview.alt = painting.title;
  els.modePreview.src = painting._thumb || `assets/original/${painting.id}.jpg?v=crop4`;
  els.modeModal.hidden = false;
  try {
    const art = await loadAndPixelate(painting);
    painting._thumb = art.dataUrl;
    els.modePreview.src = art.dataUrl;
  } catch (err) {
    console.warn(err);
  }
}

function closeMode() {
  els.modeModal.hidden = true;
}

async function startPuzzle(mode) {
  if (!state.painting) return;
  closeMode();
  closeBook();
  state.mode = mode;
  state.placed = 0;
  state.scores = [0, 0];
  state.turn = 0;
  els.loading.hidden = false;
  showScreen("puzzle");
  try {
    const art = await loadAndPixelate(state.painting);
    state.art = art;
    buildPuzzle(art);
  } catch (err) {
    console.error(err);
    alert("Could not load this painting. Please try another.");
    showScreen("gallery");
  } finally {
    els.loading.hidden = true;
  }
}

function makePieceEl(index, src) {
  const el = document.createElement("img");
  el.className = "piece";
  el.dataset.index = String(index);
  el.src = src;
  el.alt = "";
  el.draggable = false;
  el.addEventListener("dragstart", (e) => e.preventDefault());
  el.addEventListener("pointerdown", onPointerDown);
  return el;
}

function buildPuzzle(art) {
  const painting = state.painting;
  els.puzzleTitle.textContent = painting.title;
  els.puzzleArtist.textContent = `${painting.artist} · ${painting.year}`;
  els.refThumb.src = art.dataUrl;
  els.board.innerHTML = "";
  els.tray.innerHTML = "";
  els.board.classList.remove("seamless");

  for (let i = 0; i < PIECE_COUNT; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = String(i);
    els.board.appendChild(cell);
  }

  const order = shuffle([...Array(PIECE_COUNT).keys()]);
  state.pieces = order.map((index) => {
    const el = makePieceEl(index, art.slices[index]);
    els.tray.appendChild(el);
    return { index, el, placed: false };
  });

  updateHud();
}

function updateHud() {
  if (state.mode === "solo") {
    els.puzzleHud.innerHTML = `<span>${state.placed} / ${PIECE_COUNT}</span>`;
    els.turnBanner.hidden = true;
    return;
  }
  els.puzzleHud.innerHTML = `
    <div class="score-chip p1 ${state.turn === 0 ? "active" : ""}">Blue ${state.scores[0]}</div>
    <img class="vs-mini" src="assets/ui/icons/vs.png" alt="versus" />
    <div class="score-chip p2 ${state.turn === 1 ? "active" : ""}">Red ${state.scores[1]}</div>
  `;
  els.turnBanner.hidden = false;
  els.turnBanner.className = `turn-banner p${state.turn + 1}`;
  els.turnBanner.textContent =
    state.turn === 0 ? "Blue's turn" : "Red's turn";
}

function pieceFromEvent(e) {
  const index = Number(e.currentTarget.dataset.index);
  return state.pieces.find((p) => p.index === index);
}

function onPointerDown(e) {
  const piece = pieceFromEvent(e);
  if (!piece || piece.placed || state.dragging) return;
  e.preventDefault();
  sfx.resume();
  const rect = piece.el.getBoundingClientRect();
  try {
    piece.el.setPointerCapture(e.pointerId);
  } catch {
    /* some browsers reject capture on img */
  }
  const placeholder = document.createElement("div");
  placeholder.className = "piece-placeholder";
  piece.el.after(placeholder);
  state.dragging = {
    piece,
    dx: e.clientX - rect.left,
    dy: e.clientY - rect.top,
    placeholder,
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
  };
  piece.el.classList.add("dragging");
  piece.el.style.width = `${rect.width}px`;
  piece.el.style.height = `${rect.height}px`;
  moveDrag(e);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
}

function onPointerMove(e) {
  if (!state.dragging || e.pointerId !== state.dragging.pointerId) return;
  e.preventDefault();
  moveDrag(e);
}

function moveDrag(e) {
  const { piece, dx, dy } = state.dragging;
  piece.el.style.position = "fixed";
  piece.el.style.left = `${e.clientX - dx}px`;
  piece.el.style.top = `${e.clientY - dy}px`;
  piece.el.style.zIndex = "40";
  highlightFromPiece(piece.el, piece.index);
}

function highlightFromPiece(el, pieceIndex) {
  clearHighlights();
  if (state.mode !== "solo") return;
  const cell = cellUnderPiece(el);
  if (!cell || cell.querySelector(".piece.locked")) return;
  const match = Number(cell.dataset.index) === pieceIndex;
  cell.classList.add(match ? "hover-yes" : "hover-no");
}

function cellUnderPiece(el) {
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  el.style.visibility = "hidden";
  const node = document.elementFromPoint(x, y);
  el.style.visibility = "";
  const direct = node?.closest?.(".cell");
  if (direct && !direct.querySelector(".piece.locked")) return direct;

  let best = null;
  let bestD = Infinity;
  const max = r.width * 0.55;
  els.board.querySelectorAll(".cell").forEach((cell) => {
    if (cell.querySelector(".piece.locked")) return;
    const c = cell.getBoundingClientRect();
    const d = Math.hypot(
      x - (c.left + c.width / 2),
      y - (c.top + c.height / 2)
    );
    if (d < bestD && d < max) {
      bestD = d;
      best = cell;
    }
  });
  return best;
}

function clearHighlights() {
  els.board.querySelectorAll(".cell").forEach((c) => {
    c.classList.remove("hover-yes", "hover-no");
  });
}

function onPointerUp(e) {
  const drag = state.dragging;
  if (!drag || e.pointerId !== drag.pointerId) return;
  const { piece, placeholder } = drag;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointercancel", onPointerUp);
  clearHighlights();

  const moved =
    Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 8;
  const cell = cellUnderPiece(piece.el);
  const occupied = cell?.querySelector(".piece.locked");
  const correct =
    cell && !occupied && Number(cell.dataset.index) === piece.index;

  resetDragStyles(piece.el);
  piece.el.classList.remove("dragging");
  state.dragging = null;

  if (correct) {
    placeholder.remove();
    lockPiece(piece, cell);
    return;
  }

  placeholder.replaceWith(piece.el);
  if (!moved) return;

  piece.el.classList.remove("bounce");
  void piece.el.offsetWidth;
  piece.el.classList.add("bounce");
  sfx.wrong();
  if (cell && state.mode === "versus") {
    state.turn = state.turn === 0 ? 1 : 0;
    sfx.turn();
    updateHud();
  }
}

function resetDragStyles(el) {
  el.style.position = "";
  el.style.left = "";
  el.style.top = "";
  el.style.zIndex = "";
  el.style.width = "";
  el.style.height = "";
  el.style.visibility = "";
  el.style.transform = "";
}

function lockPiece(piece, cell) {
  piece.placed = true;
  piece.el.classList.add("locked");
  cell.appendChild(piece.el);
  state.placed += 1;

  const isFinal = state.placed === PIECE_COUNT;
  if (state.mode === "versus") {
    state.scores[state.turn] += 1;
    if (isFinal) state.scores[state.turn] += 2;
  }

  sfx.correct();
  sfx.twinkle();
  floatPlus(cell, isFinal && state.mode === "versus" ? "+3" : "+1");
  updateHud();

  if (isFinal) {
    els.board.classList.add("seamless");
    finishPuzzle();
  }
}

function floatPlus(cell, text) {
  const r = cell.getBoundingClientRect();
  const n = document.createElement("div");
  n.className = "floater";
  n.textContent = text;
  n.style.left = `${r.left + r.width / 2 - 12}px`;
  n.style.top = `${r.top - 8}px`;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 800);
}

function finishPuzzle() {
  state.completed.add(state.painting.id);
  state.painting._thumb = state.art.dataUrl;
  ensureHung(state.painting);
  sfx.complete();
  burstConfetti();
  setTimeout(() => {
    if (state.mode === "versus") {
      const [a, b] = state.scores;
      els.winnerRow.hidden = false;
      if (a === b) {
        els.winnerText.textContent = "It's a draw!";
      } else {
        els.winnerText.textContent = a > b ? "Blue wins!" : "Red wins!";
      }
      els.completeSummary.textContent = `Blue ${a}  ·  Red ${b}`;
    } else {
      els.winnerRow.hidden = false;
      els.winnerText.textContent = "Gallery complete!";
      els.completeSummary.textContent = `${state.painting.title} is hanging in the gallery.`;
    }
    els.completeModal.hidden = false;
  }, 700);
}

let confettiTimer = 0;

function burstConfetti() {
  const canvas = els.confetti;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.classList.add("on");
  const colors = ["#e64b3d", "#3db54a", "#3d7ae6", "#e6c35c", "#e67a3d", "#f2f2f2"];
  const bits = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 120,
    s: 4 + Math.floor(Math.random() * 6),
    v: 2 + Math.random() * 4,
    c: colors[Math.floor(Math.random() * colors.length)],
  }));
  const start = performance.now();
  cancelAnimationFrame(confettiTimer);
  const tick = (t) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bits.forEach((b) => {
      b.y += b.v;
      b.x += Math.sin((t + b.x) / 400);
      ctx.fillStyle = b.c;
      ctx.fillRect(b.x, b.y, b.s, b.s);
    });
    if (t - start < 2800) confettiTimer = requestAnimationFrame(tick);
    else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.classList.remove("on");
    }
  };
  confettiTimer = requestAnimationFrame(tick);
}

function stopConfetti() {
  cancelAnimationFrame(confettiTimer);
  const canvas = els.confetti;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.classList.remove("on");
}

let ignoreHash = false;

function stripHash() {
  if (!location.hash) return;
  ignoreHash = true;
  history.replaceState(null, "", location.pathname + location.search);
  setTimeout(() => {
    ignoreHash = false;
  }, 0);
}

function returnToGallery() {
  closeSettings();
  els.completeModal.hidden = true;
  closeMode();
  closeBook();
  stopConfetti();
  stripHash();
  showScreen("gallery");
  renderGallery();
}

function returnToTitle() {
  closeSettings();
  els.completeModal.hidden = true;
  closeMode();
  closeBook();
  stopConfetti();
  stripHash();
  showScreen("title");
}

function syncAmbienceButtons() {
  els.ambienceList.querySelectorAll(".ambience-opt").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.ambience === sfx.ambienceId));
  });
  if (els.btnSettings) {
    els.btnSettings.setAttribute("aria-expanded", String(!els.settingsPop.hidden));
  }
}

function fillAmbienceList() {
  els.ambienceList.innerHTML = "";
  AMBIENCES.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ambience-opt";
    btn.dataset.ambience = opt.id;
    btn.innerHTML = `<span>${opt.label}</span><small>${opt.hint}</small>`;
    btn.addEventListener("click", () => {
      sfx.resume();
      sfx.tick();
      sfx.setAmbience(opt.id);
      syncAmbienceButtons();
    });
    els.ambienceList.appendChild(btn);
  });
  syncAmbienceButtons();
}

function openSettings() {
  sfx.tick();
  els.settingsPop.hidden = false;
  syncAmbienceButtons();
}

function closeSettings() {
  if (els.settingsPop.hidden) return;
  els.settingsPop.hidden = true;
  syncAmbienceButtons();
}

function toggleSettings(e) {
  e.stopPropagation();
  if (els.settingsPop.hidden) openSettings();
  else closeSettings();
}

function bind() {
  fillAmbienceList();
  els.enter.addEventListener("click", () => {
    sfx.resume();
    sfx.tick();
    sfx.setAmbience(sfx.ambienceId);
    showScreen("gallery");
    renderGallery();
  });
  els.btnTitle.addEventListener("click", () => {
    sfx.tick();
    returnToTitle();
  });
  els.btnGalleryHome.addEventListener("click", () => {
    sfx.tick();
    returnToTitle();
  });

  els.btnSolo.addEventListener("click", () => {
    sfx.tick();
    startPuzzle("solo");
  });
  els.btnVersus.addEventListener("click", () => {
    sfx.tick();
    startPuzzle("versus");
  });
  els.btnModeCancel.addEventListener("click", () => {
    sfx.tick();
    closeMode();
  });
  els.btnHang.addEventListener("click", () => {
    if (!state.painting) return;
    sfx.tick();
    closeMode();
    state.pickingHook = state.painting;
    state.hangSlot = null;
    showScreen("gallery");
    renderGallery();
  });
  els.btnSwap.addEventListener("click", () => {
    sfx.tick();
    closeMode();
    const idx = state.wall.indexOf(state.painting?.id);
    state.hangSlot = idx >= 0 ? idx : 0;
    openBook("artists");
  });
  els.btnAgain.addEventListener("click", () => {
    sfx.tick();
    els.completeModal.hidden = true;
    startPuzzle(state.mode);
  });
  els.btnGallery.addEventListener("click", () => {
    sfx.tick();
    returnToGallery();
  });
  els.btnHome.addEventListener("click", () => {
    sfx.tick();
    returnToGallery();
  });

  const openCatalogue = () => {
    state.hangSlot = null;
    openBook("artists");
  };
  els.btnSettings.addEventListener("click", toggleSettings);
  els.btnSettingsPuzzle.addEventListener("click", toggleSettings);
  els.ambienceVol.addEventListener("input", () => {
    sfx.setVolume(Number(els.ambienceVol.value) / 100);
  });
  document.addEventListener("click", (e) => {
    if (els.settingsPop.hidden) return;
    if (els.settingsPop.contains(e.target)) return;
    if (e.target.closest("#btn-settings, #btn-settings-puzzle")) return;
    closeSettings();
  });
  els.btnBook.addEventListener("click", openCatalogue);
  els.btnBookBack.addEventListener("click", () => {
    sfx.tick();
    if (state.bookView === "works") openBook("artists");
    else {
      state.hangSlot = null;
      closeBook();
    }
  });
  els.bookModal.addEventListener("click", (e) => {
    if (e.target === els.bookModal) {
      state.hangSlot = null;
      closeBook();
    }
  });
  els.modeModal.addEventListener("click", (e) => {
    if (e.target === els.modeModal) closeMode();
  });
  els.galleryBg.addEventListener("load", fitGallery);
  if (els.galleryBg.complete) fitGallery();
  window.addEventListener("resize", () => {
    fitBoard();
    fitGallery();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!els.settingsPop.hidden) {
      closeSettings();
      return;
    }
    if (!els.completeModal.hidden) return;
    if (!els.modeModal.hidden) closeMode();
    else if (!els.bookModal.hidden) {
      if (state.bookView === "works") openBook("artists");
      else {
        state.hangSlot = null;
        closeBook();
      }
    } else if (state.pickingHook) {
      state.pickingHook = null;
      updateHangBanner();
      renderGallery();
    }
  });
}

fitBoard();
bind();
bootFromHash();
window.addEventListener("hashchange", () => bootFromHash());

window.__qa = {
  place(index) {
    const piece = state.pieces.find((p) => p.index === index && !p.placed);
    const cell = els.board.querySelector(`.cell[data-index="${index}"]`);
    if (piece && cell) lockPiece(piece, cell);
  },
  scores() {
    return {
      placed: state.placed,
      scores: state.scores.slice(),
      turn: state.turn,
      tray: document.querySelectorAll("#tray .piece").length,
      locked: document.querySelectorAll(".piece.locked").length,
    };
  },
};

async function bootFromHash() {
  if (ignoreHash) {
    ignoreHash = false;
    return;
  }
  const hash = location.hash.replace(/^#/, "");
  if (!hash) return;
  if (hash === "gallery") {
    showScreen("gallery");
    renderGallery();
    return;
  }
  if (hash === "book") {
    showScreen("gallery");
    renderGallery();
    openBook("artists");
    return;
  }
  const play = hash.match(/^play\/([a-z0-9-]+)\/(solo|versus)$/);
  if (play) {
    const painting = paintingById(play[1]);
    if (!painting) return;
    state.painting = painting;
    await startPuzzle(play[2]);
  }
}
