"use strict";

  // ---------- Ljud ----------
  let audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Alla ljudeffekter gar via denna: ljud far ALDRIG kunna krascha spelet
  // (t.ex. nar AudioContext saknas eller blockeras av webblasaren). Ett kastat
  // fel har skulle annars bubbla upp genom update() och stoppa hela game-loopen.
  function playSfx(build) {
    try {
      const ctx = ensureAudio();
      build(ctx, ctx.currentTime);
    } catch (e) { /* tyst - hellre inget ljud an ett fruset spel */ }
  }

  // ---------- Bakgrundsmusik (procedurell, upbeat, laag volym) ----------
  let musicOn = true;
  try { musicOn = localStorage.getItem("hoppspelet_music") !== "off"; } catch (e) {}
  let musicGain = null;
  let musicStarted = false;
  let musicStep = 0;
  let musicTimer = null;
  let musicNextNoteTime = 0;
  const MUSIC_VOL = 0.05;
  const STEP_MS = 145;
  // Web Audio-schemalaggning: timern vacker oss ofta, men noterna bokas i
  // forvag mot audioCtx.currentTime. Da spelar melodin jamnt aven om timers
  // jittrar, och den hackar inte sonder om intervallet skulle stypas.
  const SCHED_AHEAD_S = 0.2;
  const SCHED_INTERVAL_MS = 60;

  // Halvtonssteg fran C5 (523.25 Hz). En lang loop (16 takter / 64 steg) med fyra
  // olika fraser sa den inte later sa enformig.
  const C5 = 523.25;
  const semi = (n) => C5 * Math.pow(2, n / 12);

  // 64 steg = 16 takter a 4 steg. Melodin arpeggierar med varierande kontur och rester (null).
  const MELODY = [
    // Fras 1: C  G  Am F
    0, 4, 7, 12,   11, 7, 11, 14,   12, 9, 12, 16,   14, 12, 9, 5,
    // Fras 2: F  G  C  Am
    5, 9, 12, 9,   7, 11, 14, 11,   12, 7, 4, 7,     9, 12, 9, 4,
    // Fras 3: Am F  C  G
    16, 12, 9, 12, 12, 9, 5, 9,     7, 12, 16, 12,   14, 11, 7, 2,
    // Fras 4: C  G  F  G  (avslut/vandning)
    0, 4, 7, 12,   11, 7, 2, null,  5, 9, 5, 9,      7, 11, 14, null
  ];

  // En basrot per takt (16 takter), en oktav ner. Kvinten laggs till pa halvtakten.
  const CHORD_ROOTS = [
    -12, -17, -15, -19,   // C  G  Am F
    -19, -17, -12, -15,   // F  G  C  Am
    -15, -19, -12, -17,   // Am F  C  G
    -12, -17, -19, -17    // C  G  F  G
  ];

  function playMusicNote(freq, dur, type, vol, when) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(g).connect(musicGain);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  function scheduleMusicStep(step, when) {
    const s = step % MELODY.length;
    const bar = Math.floor(s / 4);
    const beat = s % 4;

    if (MELODY[s] !== null) {
      playMusicNote(semi(MELODY[s]), 0.18, "triangle", 0.5, when);
    }
    // Bas: rot pa taktslag 0, kvint pa taktslag 2 for studsig kanslo
    if (beat === 0) {
      playMusicNote(semi(CHORD_ROOTS[bar]), 0.42, "sine", 0.9, when);
    } else if (beat === 2) {
      playMusicNote(semi(CHORD_ROOTS[bar] + 7), 0.3, "sine", 0.7, when);
    }
    // Latt "hi-hat"-blip pa offbeats for driv
    if (s % 2 === 1) {
      playMusicNote(semi(24 + (s % 3)), 0.04, "square", 0.12, when);
    }
  }

  function musicSchedulerTick() {
    if (!audioCtx || !musicGain) return;
    // Om klockan hunnit ifatt (t.ex. efter suspend) - hoppa fram i stallet
    // for att boka en storm av forsenade noter.
    if (musicNextNoteTime < audioCtx.currentTime) {
      musicNextNoteTime = audioCtx.currentTime + 0.05;
    }
    while (musicNextNoteTime < audioCtx.currentTime + SCHED_AHEAD_S) {
      scheduleMusicStep(musicStep, musicNextNoteTime);
      musicStep++;
      musicNextNoteTime += STEP_MS / 1000;
    }
  }

  function stopMusicScheduler() {
    if (musicTimer !== null) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
  }

  function startMusicScheduler() {
    if (musicTimer !== null || !musicStarted) return;
    musicNextNoteTime = 0; // nollstall sa forsta ticket borjar "nu"
    musicSchedulerTick();
    musicTimer = setInterval(musicSchedulerTick, SCHED_INTERVAL_MS);
  }

  function startMusic() {
    if (musicStarted) return;
    // Ljud far ALDRIG kunna blockera spelet - svalj alla fel (t.ex. om AudioContext
    // saknas eller blockeras av webblasaren).
    try {
      ensureAudio();
      musicGain = audioCtx.createGain();
      musicGain.gain.value = musicOn ? MUSIC_VOL : 0;
      musicGain.connect(audioCtx.destination);
      musicStarted = true;
      startMusicScheduler();
    } catch (e) {
      musicStarted = true; // forsok inte igen varje bildruta
    }
  }

  // Pausa schemalaggningen nar fliken ar dold: spelet star anda stilla (rAF
  // pausas) och bakgrundsflikar stryper timers sa melodin skulle hacka sonder.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopMusicScheduler();
    } else {
      startMusicScheduler();
    }
  });

  function setMusicOn(on) {
    musicOn = on;
    try { localStorage.setItem("hoppspelet_music", on ? "on" : "off"); } catch (e) {}
    if (musicGain) {
      const now = audioCtx.currentTime;
      musicGain.gain.cancelScheduledValues(now);
      musicGain.gain.setTargetAtTime(on ? MUSIC_VOL : 0, now, 0.05);
    }
    const btn = document.getElementById("musicMute");
    if (btn) btn.textContent = on ? "🔊" : "🔇";
  }

  function playJumpSound() {
    playSfx(function (ctx, now) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      // Liten slumpvariation sa hoppet inte later exakt likadant varje gang
      const detune = 0.94 + Math.random() * 0.12;      // ±6 % tonhojd
      const dur = 0.16 + Math.random() * 0.05;
      osc.frequency.setValueAtTime(280 * detune, now);
      osc.frequency.exponentialRampToValueAtTime(620 * detune, now + dur * 0.7);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    });
  }

  function playDeathSound() {
    playSfx(function (ctx, now) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  function playCoinSound() {
    playSfx(function (ctx, now) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.setValueAtTime(990, now + 0.07);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    });
  }
