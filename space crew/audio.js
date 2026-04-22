/* ═══════════════════════════════════════════════════════════════
   Space Crew — Enhanced Sound Engine
   Loaded last on every mission page; overrides bare oscillator
   stubs with richer, layered Web Audio sounds.
   All functions exported to window so mission-file call sites
   (playWin, playBuzz, playClick, playChime, playTaskWin) pick
   up the new versions automatically.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Shared audio context ───────────────────────────────────── */
  let _ctx = null;
  function ac() {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }

  /* ── Small helpers ──────────────────────────────────────────── */
  function osc(c, type, freq, start, stop, gainVals) {
    // gainVals: array of [method, ...args] pairs on GainNode.gain
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    if (Array.isArray(freq)) {
      o.frequency.setValueAtTime(freq[0], start);
      o.frequency.exponentialRampToValueAtTime(freq[1], stop);
    } else {
      o.frequency.value = freq;
    }
    gainVals.forEach(([method, ...args]) => g.gain[method](...args));
    o.connect(g); g.connect(c.destination);
    o.start(start); o.stop(stop + 0.01);
  }

  function noiseBuffer(c, durationSec) {
    const len = Math.ceil(c.sampleRate * durationSec);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    return buf;
  }

  /* ══════════════════════════════════════════════════════════════
     playClick — crisp holographic panel tap
  ══════════════════════════════════════════════════════════════ */
  function playClick() {
    try {
      const c = ac(), t = c.currentTime;

      // Tone: triangle glide down (2000→900 Hz)
      osc(c, 'triangle', [2000, 900], t, t + 0.055, [
        ['setValueAtTime',         0.22, t],
        ['exponentialRampToValueAtTime', 0.001, t + 0.07],
      ]);

      // Noise transient for "click" texture
      const ns = c.createBufferSource();
      ns.buffer = noiseBuffer(c, 0.018);
      const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5500;
      const ng = c.createGain(); ng.gain.value = 0.1;
      ns.connect(hp); hp.connect(ng); ng.connect(c.destination);
      ns.start(t);
    } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════════════
     playBuzz — gentle "access denied" (not harsh)
  ══════════════════════════════════════════════════════════════ */
  function playBuzz() {
    try {
      const c = ac(), t = c.currentTime;

      // Two descending sine tones — "nuh-uh" pattern
      [[290, 195, 0], [210, 140, 0.13]].forEach(([f0, f1, delay]) => {
        const st = t + delay;
        osc(c, 'sine', [f0, f1], st, st + 0.18, [
          ['setValueAtTime',         0,    st],
          ['linearRampToValueAtTime',0.16, st + 0.018],
          ['exponentialRampToValueAtTime', 0.001, st + 0.22],
        ]);
      });

      // Sub thump for a tiny bit of weight
      osc(c, 'sine', [85, 42], t, t + 0.1, [
        ['setValueAtTime',         0.14, t],
        ['exponentialRampToValueAtTime', 0.001, t + 0.12],
      ]);

      if (navigator.vibrate) navigator.vibrate(55);
    } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════════════
     playChime — single correct-answer chime (3-note arpeggio)
  ══════════════════════════════════════════════════════════════ */
  function playChime() {
    try {
      const c = ac(), t = c.currentTime;

      // C major triad: C5 → E5 → G5
      [[523.25, 0], [659.25, 0.09], [784, 0.18]].forEach(([freq, delay]) => {
        const st = t + delay;

        // Fundamental — bell-like sine with clean ADSR
        osc(c, 'sine', freq, st, st + 0.5, [
          ['setValueAtTime',         0,    st],
          ['linearRampToValueAtTime',0.15, st + 0.012],
          ['setValueAtTime',         0.15, st + 0.06],
          ['exponentialRampToValueAtTime', 0.001, st + 0.48],
        ]);

        // Octave harmonic (shimmer)
        osc(c, 'sine', freq * 2, st, st + 0.24, [
          ['setValueAtTime',         0,    st],
          ['linearRampToValueAtTime',0.05, st + 0.012],
          ['exponentialRampToValueAtTime', 0.001, st + 0.22],
        ]);
      });

      // Two-note sparkle at end
      [[1568, 0.25], [2093, 0.32]].forEach(([freq, delay]) => {
        const st = t + delay;
        osc(c, 'sine', freq, st, st + 0.15, [
          ['setValueAtTime',         0.045, st],
          ['exponentialRampToValueAtTime', 0.001, st + 0.16],
        ]);
      });

      if (navigator.vibrate) navigator.vibrate(28);
    } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════════════
     playWin — level-complete fanfare
     Rising C-major arpeggio → chord resolution → sparkle burst
  ══════════════════════════════════════════════════════════════ */
  function playWin() {
    try {
      const c = ac(), t = c.currentTime;

      // Ascending melody: C4 G4 C5 E5 G5 C6
      const melody = [
        [261.63, 0],
        [392,    0.09],
        [523.25, 0.18],
        [659.25, 0.28],
        [784,    0.38],
        [1046.5, 0.50],
      ];

      melody.forEach(([freq, delay]) => {
        const st = t + delay;

        // Main voice
        osc(c, 'sine', freq, st, st + 0.58, [
          ['setValueAtTime',         0,    st],
          ['linearRampToValueAtTime',0.17, st + 0.016],
          ['setValueAtTime',         0.17, st + 0.12],
          ['exponentialRampToValueAtTime', 0.001, st + 0.58],
        ]);

        // Octave shimmer
        osc(c, 'sine', freq * 2, st, st + 0.28, [
          ['setValueAtTime',         0,    st],
          ['linearRampToValueAtTime',0.055, st + 0.016],
          ['exponentialRampToValueAtTime', 0.001, st + 0.28],
        ]);

        // Fifth interval (freq × 1.5) — adds warmth
        osc(c, 'sine', freq * 1.5, st, st + 0.2, [
          ['setValueAtTime',         0,    st],
          ['linearRampToValueAtTime',0.03, st + 0.016],
          ['exponentialRampToValueAtTime', 0.001, st + 0.2],
        ]);
      });

      // Final C major chord (C5 E5 G5 C6) — let it ring
      const chT = t + 0.62;
      [523.25, 659.25, 784, 1046.5].forEach((freq, i) => {
        const gain = Math.max(0.04, 0.14 - i * 0.025);
        osc(c, 'sine', freq, chT, chT + 0.9, [
          ['setValueAtTime',         0,     chT],
          ['linearRampToValueAtTime',gain,  chT + 0.022],
          ['setValueAtTime',         gain,  chT + 0.2],
          ['exponentialRampToValueAtTime', 0.001, chT + 0.88],
        ]);
      });

      // Sparkle burst — random high-pitched pings
      for (let i = 0; i < 14; i++) {
        const freq = 1600 + Math.random() * 3000;
        const st   = t + 0.46 + Math.random() * 0.36;
        osc(c, 'sine', freq, st, st + 0.18, [
          ['setValueAtTime',         0.038, st],
          ['exponentialRampToValueAtTime', 0.001, st + 0.18],
        ]);
      }

      if (navigator.vibrate) navigator.vibrate([45, 35, 90]);
    } catch (e) {}
  }

  /* playTaskWin = same fanfare */
  function playTaskWin() { playWin(); }

  /* ── Export — overrides bare stubs defined in each mission file ── */
  window.playClick   = playClick;
  window.playBuzz    = playBuzz;
  window.playChime   = playChime;
  window.playWin     = playWin;
  window.playTaskWin = playTaskWin;

})();
