"use strict";
// ---------- Ljud ----------
let audioCtx = null;
function ensureAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
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
    }
    catch (e) {
        /* tyst - hellre inget ljud an ett fruset spel */
    }
}
// ---------- Bakgrundsmusik (procedurell, upbeat, laag volym) ----------
let musicOn = true;
try {
    musicOn = localStorage.getItem("hoppspelet_music") !== "off";
}
catch (e) { }
let musicGain = null;
let musicStarted = false;
let musicStep = 0;
let musicTimer = null;
let musicNextNoteTime = 0;
const MUSIC_VOL = 0.05;
const STEP_MS = 145;
// Web Audio-schemalaggning: timern vacker oss ofta, men noterna bokas i
// forvag mot audioCtx!.currentTime. Da spelar melodin jamnt aven om timers
// jittrar, och den hackar inte sonder om intervallet skulle stypas.
const SCHED_AHEAD_S = 0.2;
const SCHED_INTERVAL_MS = 60;
// Halvtonssteg fran C5 (523.25 Hz). Ett steg ar en attondel (~103 BPM),
// en takt ar 8 steg. Laten ar byggd av 8-takterssektioner (vers, varierad
// vers, refrang, brygga) som tillsammans ger ~65 s musik innan den borjar
// om - och vartannat varv byter vers/refrang klangfarg, sa i praktiken
// upprepas ingenting pa drygt tva minuter.
const C5 = 523.25;
const semi = (n) => C5 * Math.pow(2, n / 12);
const STEPS_PER_BAR = 8;
const SECTION_STEPS = 64; // 8 takter a 8 steg
// Melodier: halvtonssteg fran C5, _ = paus. Allt i C-dur.
const _ = null;
// Vers - lugn, stigande arpeggiokontur
const MEL_A = [
    0,
    _,
    4,
    _,
    7,
    _,
    9,
    _,
    9,
    _,
    7,
    _,
    4,
    _,
    2,
    _, // C  Am
    5,
    _,
    9,
    _,
    12,
    _,
    9,
    _,
    7,
    _,
    11,
    _,
    7,
    _,
    2,
    _, // F  G
    0,
    _,
    4,
    _,
    7,
    _,
    12,
    _,
    9,
    _,
    12,
    _,
    16,
    _,
    12,
    _, // C  Am
    17,
    _,
    16,
    _,
    12,
    _,
    9,
    _,
    7,
    _,
    11,
    _,
    14,
    _,
    11,
    _, // F  G
];
// Versvariation - tatare "svar" pa versen
const MEL_A2 = [
    16,
    14,
    12,
    _,
    7,
    _,
    4,
    _,
    9,
    _,
    12,
    14,
    16,
    _,
    12,
    _, // C  Am
    17,
    _,
    12,
    _,
    9,
    12,
    5,
    _,
    7,
    9,
    11,
    _,
    14,
    _,
    11,
    9, // F  G
    12,
    _,
    16,
    _,
    12,
    _,
    7,
    _,
    9,
    12,
    16,
    _,
    14,
    12,
    9,
    _, // C  Am
    5,
    _,
    9,
    _,
    12,
    _,
    16,
    14,
    12,
    11,
    7,
    _,
    11,
    _,
    14,
    _, // F  G
];
// Refrang - hogre lage, mer driv
const MEL_B = [
    12,
    _,
    17,
    _,
    16,
    _,
    12,
    _,
    14,
    _,
    19,
    _,
    16,
    _,
    14,
    _, // F  G
    16,
    _,
    19,
    _,
    21,
    _,
    19,
    _,
    16,
    _,
    14,
    _,
    12,
    _,
    9,
    _, // C  Am
    17,
    16,
    17,
    _,
    21,
    _,
    19,
    17,
    19,
    _,
    14,
    _,
    11,
    _,
    14,
    _, // F  G
    16,
    _,
    12,
    _,
    19,
    _,
    16,
    _,
    14,
    12,
    11,
    _,
    14,
    _,
    19,
    _, // C  G
];
// Brygga - gles och drommande
const MEL_C = [
    9,
    _,
    _,
    _,
    12,
    _,
    _,
    _,
    7,
    _,
    _,
    _,
    11,
    _,
    _,
    _, // Am Em
    5,
    _,
    _,
    _,
    9,
    _,
    _,
    _,
    7,
    _,
    _,
    _,
    11,
    _,
    14,
    _, // F  G
    16,
    _,
    _,
    _,
    12,
    _,
    _,
    _,
    14,
    _,
    _,
    _,
    11,
    _,
    _,
    _, // Am Em
    12,
    _,
    _,
    _,
    9,
    _,
    _,
    _,
    11,
    _,
    14,
    _,
    11,
    _,
    7,
    _, // F  G
];
// Ackord per takt: [basrot (halvtoner fran C5, oktaven under), ters (4=dur, 3=moll)]
const PROG_A = [
    [-12, 4],
    [-15, 3],
    [-19, 4],
    [-17, 4],
    [-12, 4],
    [-15, 3],
    [-19, 4],
    [-17, 4],
]; // C Am F G x2
const PROG_B = [
    [-19, 4],
    [-17, 4],
    [-12, 4],
    [-15, 3],
    [-19, 4],
    [-17, 4],
    [-12, 4],
    [-17, 4],
]; // F G C Am / F G C G
const PROG_C = [
    [-15, 3],
    [-20, 3],
    [-19, 4],
    [-17, 4],
    [-15, 3],
    [-20, 3],
    [-19, 4],
    [-17, 4],
]; // Am Em F G x2
// Arrangemanget: vers, vers', refrang, vers', brygga, refrang, vers (utro).
// drums: 0 = bara mjuka ticks, 1 = bastrumma + hi-hat, 2 = fullt komp med virvel.
const SONG = [
    { mel: MEL_A, prog: PROG_A, lead: "triangle", leadVol: 0.5, drums: 1 },
    { mel: MEL_A2, prog: PROG_A, lead: "triangle", leadVol: 0.5, drums: 1, stabs: true },
    { mel: MEL_B, prog: PROG_B, lead: "square", leadVol: 0.3, drums: 2, stabs: true },
    { mel: MEL_A2, prog: PROG_A, lead: "triangle", leadVol: 0.5, drums: 2, stabs: true },
    { mel: MEL_C, prog: PROG_C, lead: "sine", leadVol: 0.55, drums: 0, pad: true, longNotes: true },
    { mel: MEL_B, prog: PROG_B, lead: "square", leadVol: 0.3, drums: 2, stabs: true },
    { mel: MEL_A, prog: PROG_A, lead: "triangle", leadVol: 0.45, drums: 1 },
];
const TOTAL_STEPS = SONG.length * SECTION_STEPS;
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
// Trummorna syntas: bastrumman ar en sjunkande sinuston, hi-hat och virvel
// ar filtrerat brus fran en aterandvand brusbuffer.
let noiseBuffer = null;
function getNoiseBuffer() {
    if (!noiseBuffer) {
        const len = Math.floor(audioCtx.sampleRate * 0.2);
        noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < len; i++)
            data[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
}
function playKick(when) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, when);
    osc.frequency.exponentialRampToValueAtTime(45, when + 0.1);
    g.gain.setValueAtTime(0.9, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.22);
    osc.connect(g).connect(musicGain);
    osc.start(when);
    osc.stop(when + 0.25);
}
function playNoiseHit(when, dur, vol, filterType, freq) {
    const src = audioCtx.createBufferSource();
    src.buffer = getNoiseBuffer();
    const f = audioCtx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = freq;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(vol, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    src.connect(f).connect(g).connect(musicGain);
    src.start(when);
    src.stop(when + dur + 0.02);
}
function scheduleMusicStep(step, when) {
    const pass = Math.floor(step / TOTAL_STEPS);
    const s = step % TOTAL_STEPS;
    const sec = SONG[Math.floor(s / SECTION_STEPS)];
    const stepInSec = s % SECTION_STEPS;
    const bar = Math.floor(stepInSec / STEPS_PER_BAR);
    const beat = stepInSec % STEPS_PER_BAR;
    const root = sec.prog[bar][0];
    const third = sec.prog[bar][1];
    // Vartannat varv byter vers och refrang klangfarg med varandra
    let lead = sec.lead;
    let leadVol = sec.leadVol;
    if (pass % 2 === 1 && sec.lead !== "sine") {
        lead = sec.lead === "triangle" ? "square" : "triangle";
        leadVol = lead === "square" ? 0.3 : 0.5;
    }
    const note = sec.mel[stepInSec];
    if (note !== null) {
        playMusicNote(semi(note), sec.longNotes ? 0.5 : 0.2, lead, leadVol, when);
    }
    // Bas: rot pa slag 1, kvint pa slag 3, upptakt mot nasta takt i fullt komp
    if (beat === 0) {
        playMusicNote(semi(root), 0.42, "sine", 0.9, when);
    }
    else if (beat === 4) {
        playMusicNote(semi(root + 7), 0.3, "sine", 0.7, when);
    }
    else if (beat === 7 && sec.drums === 2) {
        playMusicNote(semi(root + 12), 0.12, "sine", 0.4, when);
    }
    // Ackordstotar pa offbeats i de tatare sektionerna
    const stab = sec.stabs && (beat === 3 || beat === 7);
    if (stab) {
        playMusicNote(semi(root + 12), 0.1, "square", 0.1, when);
        playMusicNote(semi(root + 12 + third), 0.1, "square", 0.08, when);
    }
    // Mjuk ackordplatta i bryggan
    if (sec.pad && beat === 0) {
        const barDur = (STEP_MS / 1000) * STEPS_PER_BAR;
        playMusicNote(semi(root + 12), barDur, "sine", 0.16, when);
        playMusicNote(semi(root + 12 + third), barDur, "sine", 0.12, when);
        playMusicNote(semi(root + 19), barDur, "sine", 0.1, when);
    }
    // Trummor
    if (sec.drums >= 1) {
        if (beat === 0 || beat === 4)
            playKick(when);
        if (beat % 2 === 1 && !stab) {
            playNoiseHit(when, beat === 7 ? 0.06 : 0.035, beat === 7 ? 0.16 : 0.1, "highpass", 6000);
        }
    }
    else if (beat === 3 || beat === 7) {
        playNoiseHit(when, 0.03, 0.06, "highpass", 7000);
    }
    if (sec.drums === 2 && (beat === 2 || beat === 6)) {
        playNoiseHit(when, 0.12, 0.22, "bandpass", 1800);
        playMusicNote(180, 0.1, "triangle", 0.3, when);
    }
}
function musicSchedulerTick() {
    if (!audioCtx || !musicGain)
        return;
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
    if (musicTimer !== null || !musicStarted)
        return;
    musicNextNoteTime = 0; // nollstall sa forsta ticket borjar "nu"
    musicSchedulerTick();
    musicTimer = setInterval(musicSchedulerTick, SCHED_INTERVAL_MS);
}
function startMusic() {
    if (musicStarted)
        return;
    // Ljud far ALDRIG kunna blockera spelet - svalj alla fel (t.ex. om AudioContext
    // saknas eller blockeras av webblasaren).
    try {
        ensureAudio();
        musicGain = audioCtx.createGain();
        musicGain.gain.value = musicOn ? MUSIC_VOL : 0;
        musicGain.connect(audioCtx.destination);
        musicStarted = true;
        startMusicScheduler();
    }
    catch (e) {
        musicStarted = true; // forsok inte igen varje bildruta
    }
}
// Pausa schemalaggningen nar fliken ar dold: spelet star anda stilla (rAF
// pausas) och bakgrundsflikar stryper timers sa melodin skulle hacka sonder.
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        stopMusicScheduler();
    }
    else {
        startMusicScheduler();
    }
});
function setMusicOn(on) {
    musicOn = on;
    try {
        localStorage.setItem("hoppspelet_music", on ? "on" : "off");
    }
    catch (e) { }
    if (musicGain) {
        const now = audioCtx.currentTime;
        musicGain.gain.cancelScheduledValues(now);
        musicGain.gain.setTargetAtTime(on ? MUSIC_VOL : 0, now, 0.05);
    }
    const btn = document.getElementById("musicMute");
    if (btn)
        btn.textContent = on ? "🔊" : "🔇";
}
function playJumpSound() {
    playSfx(function (ctx, now) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        // Liten slumpvariation sa hoppet inte later exakt likadant varje gang
        const detune = 0.94 + Math.random() * 0.12; // ±6 % tonhojd
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
