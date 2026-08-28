/** Original Web Audio SFX and ambiences — no audio files, no licenses to clear. */

export const AMBIENCES = [
  { id: "off", label: "Quiet", hint: "Just the gallery" },
  { id: "hearth", label: "Hearth", hint: "A low fire in the next room" },
  { id: "wind", label: "White noise", hint: "A breeze at the window" },
  { id: "evening", label: "Evening music", hint: "A quiet original lullaby" },
];

export class Sfx {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.ambienceGain = null;
    this._bus = null;
    this.ambienceId = "evening";
    this.volume = 0.55;
    this._nodes = [];
    this._timers = [];
    this._buffers = {};
  }

  resume() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!this.ctx) {
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 1;
      this.master.connect(this.ctx.destination);
      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.value = this.volume * 0.9;
      this.ambienceGain.connect(this.master);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  #now() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  #out() {
    return this._bus || this.ambienceGain;
  }

  #tone(freq, duration, type = "square", gain = 0.07, delay = 0) {
    if (!this.ctx) return;
    const t0 = this.#now() + delay;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(env);
    env.connect(this.master || this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  tick() {
    this.#tone(720, 0.06, "square", 0.05);
  }

  correct() {
    this.#tone(180, 0.12, "triangle", 0.09);
    this.#tone(360, 0.08, "square", 0.04, 0.04);
  }

  wrong() {
    this.#tone(140, 0.18, "sawtooth", 0.05);
    this.#tone(110, 0.22, "square", 0.04, 0.05);
  }

  turn() {
    this.#tone(520, 0.07, "square", 0.05);
    this.#tone(660, 0.08, "square", 0.045, 0.07);
  }

  twinkle() {
    this.#tone(880, 0.09, "square", 0.045);
    this.#tone(1320, 0.12, "triangle", 0.04, 0.05);
  }

  complete() {
    const notes = [523, 659, 784, 1046, 1318];
    notes.forEach((n, i) => this.#tone(n, 0.22, "square", 0.06, i * 0.12));
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.ambienceGain && this.ctx) {
      this.ambienceGain.gain.setTargetAtTime(
        this.ambienceId === "off" ? 0 : this.volume * 0.9,
        this.ctx.currentTime,
        0.08
      );
    }
  }

  setAmbience(id) {
    this.resume();
    if (!this.ctx) return;
    this.stopAmbience();
    this.ambienceId = id;
    if (id === "off") {
      this.ambienceGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.12);
      return;
    }
    this.ambienceGain.gain.setTargetAtTime(
      this.volume * 0.9,
      this.ctx.currentTime,
      0.12
    );
    this._bus = this.ctx.createGain();
    this._bus.gain.value = 1;
    this._bus.connect(this.ambienceGain);
    this.#keep(this._bus);
    if (id === "hearth") this.#startHearth();
    else if (id === "wind") this.#startWind();
    else this.#startEvening();
  }

  stopAmbience() {
    this._timers.forEach((tid) => clearTimeout(tid));
    this._timers = [];
    this._nodes.forEach((node) => {
      try {
        node.stop?.();
      } catch {
        /* already stopped */
      }
      try {
        node.disconnect();
      } catch {
        /* already disconnected */
      }
    });
    this._nodes = [];
    this._bus = null;
  }

  #keep(node) {
    this._nodes.push(node);
    return node;
  }

  #later(fn, ms) {
    const id = setTimeout(fn, ms);
    this._timers.push(id);
    return id;
  }

  #noiseBuffer(kind = "white", seconds = 8) {
    const key = `${kind}:${seconds}`;
    if (this._buffers[key]) return this._buffers[key];
    const sr = this.ctx.sampleRate;
    const len = Math.floor(sr * seconds);
    const buf = this.ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      let sample = white;
      if (kind === "pink") {
        b0 = 0.99765 * b0 + white * 0.099046;
        b1 = 0.963 * b1 + white * 0.2965164;
        b2 = 0.5703 * b2 + white * 1.052691;
        sample = (b0 + b1 + b2 + white * 0.1848) * 0.11;
      } else if (kind === "brown") {
        last = (last + 0.02 * white) / 1.02;
        sample = last * 3.2;
      }
      data[i] = sample;
    }
    const fade = Math.min(Math.floor(sr * 0.08), Math.floor(len / 4));
    for (let i = 0; i < fade; i++) {
      const t = i / fade;
      const a = data[i];
      const b = data[len - fade + i];
      data[i] = a * t + b * (1 - t);
      data[len - fade + i] = b * t + a * (1 - t);
    }
    this._buffers[key] = buf;
    return buf;
  }

  #loopNoise(kind, filterType, freq, q, gainVal) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.#noiseBuffer(kind);
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.value = gainVal;
    src.connect(filter);
    filter.connect(g);
    g.connect(this.#out());
    src.start();
    this.#keep(src);
    this.#keep(filter);
    this.#keep(g);
    return { src, filter, g };
  }

  #startHearth() {
    this.#loopNoise("brown", "lowpass", 180, 0.5, 0.07);
    const rumble = this.ctx.createOscillator();
    const rg = this.ctx.createGain();
    rumble.type = "sine";
    rumble.frequency.value = 48;
    rg.gain.value = 0.02;
    rumble.connect(rg);
    rg.connect(this.#out());
    rumble.start();
    this.#keep(rumble);
    this.#keep(rg);

    const crackle = () => {
      if (this.ambienceId !== "hearth" || !this.ctx || !this._bus) return;
      this.#pop();
      if (Math.random() < 0.28) this.#pop(0.09 + Math.random() * 0.08);
      this.#later(crackle, 2800 + Math.random() * 5200);
    };
    this.#later(crackle, 1600 + Math.random() * 1200);
  }

  #pop(delay = 0) {
    const t0 = this.#now() + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.#noiseBuffer("white", 2);
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 220 + Math.random() * 420;
    bp.Q.value = 0.9;
    const lp = this.ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1400;
    const env = this.ctx.createGain();
    const dur = 0.06 + Math.random() * 0.1;
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(0.09 + Math.random() * 0.05, t0 + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp);
    bp.connect(lp);
    lp.connect(env);
    env.connect(this.#out());
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  #startWind() {
    const bed = this.#loopNoise("brown", "lowpass", 420, 0.45, 0.055);
    const lfo = this.ctx.createOscillator();
    const lfoG = this.ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.04;
    lfoG.gain.value = 90;
    lfo.connect(lfoG);
    lfoG.connect(bed.filter.frequency);
    lfo.start();
    this.#keep(lfo);
    this.#keep(lfoG);

    const air = this.#loopNoise("pink", "lowpass", 640, 0.4, 0.022);
    const breathe = this.ctx.createOscillator();
    const breatheG = this.ctx.createGain();
    breathe.type = "sine";
    breathe.frequency.value = 0.05;
    breatheG.gain.value = 0.01;
    breathe.connect(breatheG);
    breatheG.connect(air.g.gain);
    breathe.start();
    this.#keep(breathe);
    this.#keep(breatheG);

    const swell = () => {
      if (this.ambienceId !== "wind" || !this.ctx || !this._bus) return;
      const t0 = this.#now();
      const peak = 0.08 + Math.random() * 0.03;
      const rise = 0.9 + Math.random() * 0.6;
      const hold = 0.8 + Math.random() * 1.1;
      const fall = 1.4 + Math.random() * 0.8;
      const quiet = 0.028;
      bed.g.gain.cancelScheduledValues(t0);
      bed.g.gain.setValueAtTime(Math.max(quiet, bed.g.gain.value), t0);
      bed.g.gain.linearRampToValueAtTime(peak, t0 + rise);
      bed.g.gain.linearRampToValueAtTime(quiet, t0 + rise + hold + fall);
      this.#later(swell, (rise + hold + fall + 3.2 + Math.random() * 3.8) * 1000);
    };
    this.#later(swell, 2200 + Math.random() * 1600);
  }

  #musicNote(freq, t0, dur, gain = 0.045) {
    if (!this.ctx || !this._bus) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const lp = this.ctx.createBiquadFilter();
    const env = this.ctx.createGain();
    osc.type = "sine";
    osc2.type = "sine";
    osc.frequency.setValueAtTime(freq, t0);
    osc2.frequency.setValueAtTime(freq * 1.003, t0);
    lp.type = "lowpass";
    lp.frequency.value = 1200;
    lp.Q.value = 0.4;
    const attack = Math.min(0.12, dur * 0.18);
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    env.gain.exponentialRampToValueAtTime(gain * 0.7, t0 + dur * 0.55);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(lp);
    osc2.connect(lp);
    lp.connect(env);
    env.connect(this.#out());
    osc.start(t0);
    osc2.start(t0);
    osc.stop(t0 + dur + 0.02);
    osc2.stop(t0 + dur + 0.02);
  }

  #startEvening() {
    this.#loopNoise("brown", "lowpass", 280, 0.4, 0.03);

    const pad = (freq, gain) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const lp = this.ctx.createBiquadFilter();
      osc.type = "sine";
      osc.frequency.value = freq;
      lp.type = "lowpass";
      lp.frequency.value = 700;
      g.gain.value = gain;
      osc.connect(lp);
      lp.connect(g);
      g.connect(this.#out());
      osc.start();
      this.#keep(osc);
      this.#keep(g);
      this.#keep(lp);
    };
    pad(130.81, 0.03);
    pad(196.0, 0.02);
    pad(261.63, 0.012);

    const beat = 0.52;
    const loopBeats = 16;
    const melody = [
      [0, 329.63, 1.6],
      [2, 392.0, 1.6],
      [4, 440.0, 1.1],
      [5.2, 392.0, 1.6],
      [7, 329.63, 1.5],
      [8.6, 293.66, 1.1],
      [10, 261.63, 2.2],
      [12.4, 293.66, 1.1],
      [13.6, 329.63, 2.2],
    ];
    const bass = [
      [0, 130.81],
      [4, 174.61],
      [8, 196.0],
      [12, 130.81],
    ];

    const playLoop = () => {
      if (this.ambienceId !== "evening" || !this.ctx || !this._bus) return;
      const t0 = this.#now() + 0.04;
      melody.forEach(([b, freq, dur]) => {
        this.#musicNote(freq, t0 + b * beat, dur * beat, 0.05);
      });
      bass.forEach(([b, freq]) => {
        this.#musicNote(freq, t0 + b * beat, 3.6 * beat, 0.034);
      });
      this.#later(playLoop, loopBeats * beat * 1000);
    };
    playLoop();
  }
}
