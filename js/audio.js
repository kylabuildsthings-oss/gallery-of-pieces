/** Original Web Audio SFX and ambiences — no audio files, no licenses to clear. */

export const AMBIENCES = [
  { id: "off", label: "Quiet", hint: "Just the gallery" },
  { id: "rain", label: "Soft rain", hint: "A drizzle on the skylight" },
  { id: "hearth", label: "Hearth", hint: "A low fire in the next room" },
  { id: "evening", label: "Evening gallery", hint: "Hushed room, distant notes" },
];

export class Sfx {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.ambienceGain = null;
    this.ambienceId = "evening";
    this.volume = 0.55;
    this._nodes = [];
    this._timers = [];
    this._noise = null;
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
    if (id === "rain") this.#startRain();
    else if (id === "hearth") this.#startHearth();
    else this.#startEvening();
  }

  stopAmbience() {
    this._timers.forEach((id) => clearTimeout(id));
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

  #noiseBuffer(seconds = 2) {
    if (this._noise) return this._noise;
    const sr = this.ctx.sampleRate;
    const len = Math.floor(sr * seconds);
    const buf = this.ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    this._noise = buf;
    return buf;
  }

  #loopNoise(filterType, freq, q, gainVal) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.#noiseBuffer();
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.value = gainVal;
    src.connect(filter);
    filter.connect(g);
    g.connect(this.ambienceGain);
    src.start();
    this.#keep(src);
    this.#keep(filter);
    this.#keep(g);
    return { src, filter, g };
  }

  #startRain() {
    const bed = this.#loopNoise("lowpass", 920, 0.65, 0.22);
    const lfo = this.ctx.createOscillator();
    const lfoG = this.ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    lfoG.gain.value = 180;
    lfo.connect(lfoG);
    lfoG.connect(bed.filter.frequency);
    lfo.start();
    this.#keep(lfo);
    this.#keep(lfoG);

    const drip = () => {
      if (this.ambienceId !== "rain" || !this.ctx) return;
      const t0 = this.#now();
      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400 + Math.random() * 900, t0);
      f.type = "highpass";
      f.frequency.value = 900;
      env.gain.setValueAtTime(0.0001, t0);
      env.gain.exponentialRampToValueAtTime(0.045, t0 + 0.01);
      env.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
      osc.connect(f);
      f.connect(env);
      env.connect(this.ambienceGain);
      osc.start(t0);
      osc.stop(t0 + 0.16);
      this.#keep(osc);
      this.#later(drip, 900 + Math.random() * 2200);
    };
    drip();
  }

  #startHearth() {
    this.#loopNoise("lowpass", 240, 0.5, 0.1);
    const rumble = this.ctx.createOscillator();
    const rg = this.ctx.createGain();
    rumble.type = "sine";
    rumble.frequency.value = 52;
    rg.gain.value = 0.035;
    rumble.connect(rg);
    rg.connect(this.ambienceGain);
    rumble.start();
    this.#keep(rumble);
    this.#keep(rg);

    const pop = () => {
      if (this.ambienceId !== "hearth" || !this.ctx) return;
      const t0 = this.#now();
      const src = this.ctx.createBufferSource();
      src.buffer = this.#noiseBuffer();
      const bp = this.ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 400 + Math.random() * 1400;
      bp.Q.value = 0.8;
      const env = this.ctx.createGain();
      const dur = 0.04 + Math.random() * 0.11;
      env.gain.setValueAtTime(0.0001, t0);
      env.gain.exponentialRampToValueAtTime(0.12 + Math.random() * 0.1, t0 + 0.008);
      env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(bp);
      bp.connect(env);
      env.connect(this.ambienceGain);
      src.start(t0);
      src.stop(t0 + dur + 0.02);
      this.#keep(src);
      this.#later(pop, 70 + Math.random() * 380);
    };
    pop();
  }

  #startEvening() {
    this.#loopNoise("lowpass", 380, 0.4, 0.055);
    const notes = [196, 247, 294, 330, 392, 494];
    const phrase = () => {
      if (this.ambienceId !== "evening" || !this.ctx) return;
      const t0 = this.#now();
      const a = notes[Math.floor(Math.random() * notes.length)];
      const b = notes[Math.floor(Math.random() * notes.length)];
      [a, b].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        const f = this.ctx.createBiquadFilter();
        osc.type = "triangle";
        osc.frequency.value = freq;
        f.type = "lowpass";
        f.frequency.value = 900;
        const start = t0 + i * 1.4;
        env.gain.setValueAtTime(0.0001, start);
        env.gain.exponentialRampToValueAtTime(0.045, start + 1.1);
        env.gain.exponentialRampToValueAtTime(0.0001, start + 4.2);
        osc.connect(f);
        f.connect(env);
        env.connect(this.ambienceGain);
        osc.start(start);
        osc.stop(start + 4.4);
        this.#keep(osc);
      });
      this.#later(phrase, 5200 + Math.random() * 4200);
    };
    phrase();
  }
}
