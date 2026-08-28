/** Tiny 8-bit-style SFX via Web Audio — no audio files, no tracking. */

export class Sfx {
  constructor() {
    this.ctx = null;
  }

  resume() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!this.ctx) this.ctx = new Ctx();
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
    env.connect(this.ctx.destination);
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
}
