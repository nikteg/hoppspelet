import { Minimotor } from "minimotor";
import type { SongSection } from "./types.js";

// The engine's audio support (Minimotor.Audio) handles AudioContext, scheduling,
// volume and pause on hidden tab. Here we define only the game's own material:
// the song (melodies, chords, arrangement) and the sound effects.
const audio = Minimotor.Audio;

// ---------- Background music (procedural, upbeat, low volume) ----------
const MUSIC_VOL = 0.05;
const STEP_MS = 145;

// Semitone steps from C5 (523.25 Hz). One step is an eighth note (~103 BPM),
// one bar is 8 steps. The song is built from 8-bar sections (verse, varied
// verse, chorus, bridge) which together produce ~65 s of music before it starts
// over - and every other loop the verse/chorus swap timbre, so in practice
// nothing repeats for over two minutes.
const C5 = 523.25;
const semi = (n: number) => C5 * Math.pow(2, n / 12);
const STEPS_PER_BAR = 8;
const SECTION_STEPS = 64; // 8 bars of 8 steps

// Melodies: semitone steps from C5, _ = rest. All in C major.
const _ = null;
// Verse - calm, rising arpeggio contour
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
// Verse variation - denser "response" to the verse
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
// Chorus - higher register, more drive
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
// Bridge - sparse and dreamy
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

// Chords per bar: [bass root (halftones from C5, octave below), third (4=major, 3=minor)]
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

// Arrangement: verse, verse', chorus, verse', bridge, chorus, verse (outro).
// drums: 0 = soft ticks only, 1 = kick + hi-hat, 2 = full groove with snare.
const SONG: SongSection[] = [
  { mel: MEL_A, prog: PROG_A, lead: "triangle", leadVol: 0.5, drums: 1 },
  { mel: MEL_A2, prog: PROG_A, lead: "triangle", leadVol: 0.5, drums: 1, stabs: true },
  { mel: MEL_B, prog: PROG_B, lead: "square", leadVol: 0.3, drums: 2, stabs: true },
  { mel: MEL_A2, prog: PROG_A, lead: "triangle", leadVol: 0.5, drums: 2, stabs: true },
  { mel: MEL_C, prog: PROG_C, lead: "sine", leadVol: 0.55, drums: 0, pad: true, longNotes: true },
  { mel: MEL_B, prog: PROG_B, lead: "square", leadVol: 0.3, drums: 2, stabs: true },
  { mel: MEL_A, prog: PROG_A, lead: "triangle", leadVol: 0.45, drums: 1 },
];
const TOTAL_STEPS = SONG.length * SECTION_STEPS;

// The instruments (note, kick, noise drum) come from the engine -
// the drums are synthesized there: the kick is a descending sine tone, hi-hat and
// snare are filtered noise from a reused noise buffer.
function scheduleMusicStep(step: number, when: number) {
  const pass = Math.floor(step / TOTAL_STEPS);
  const s = step % TOTAL_STEPS;
  const sec = SONG[Math.floor(s / SECTION_STEPS)];
  const stepInSec = s % SECTION_STEPS;
  const bar = Math.floor(stepInSec / STEPS_PER_BAR);
  const beat = stepInSec % STEPS_PER_BAR;
  const root = sec.prog[bar][0];
  const third = sec.prog[bar][1];

  // Every other loop, verse and chorus swap timbre with each other
  let lead = sec.lead;
  let leadVol = sec.leadVol;
  if (pass % 2 === 1 && sec.lead !== "sine") {
    lead = sec.lead === "triangle" ? "square" : "triangle";
    leadVol = lead === "square" ? 0.3 : 0.5;
  }

  const note = sec.mel[stepInSec];
  if (note !== null) {
    audio.music.note(semi(note), sec.longNotes ? 0.5 : 0.2, lead, leadVol, when);
  }

  // Bass: root on beat 1, fifth on beat 3, upbeat to next bar in full groove
  if (beat === 0) {
    audio.music.note(semi(root), 0.42, "sine", 0.9, when);
  } else if (beat === 4) {
    audio.music.note(semi(root + 7), 0.3, "sine", 0.7, when);
  } else if (beat === 7 && sec.drums === 2) {
    audio.music.note(semi(root + 12), 0.12, "sine", 0.4, when);
  }

  // Chord stabs on offbeats in the denser sections
  const stab = sec.stabs && (beat === 3 || beat === 7);
  if (stab) {
    audio.music.note(semi(root + 12), 0.1, "square", 0.1, when);
    audio.music.note(semi(root + 12 + third), 0.1, "square", 0.08, when);
  }

  // Soft chord pad in the bridge
  if (sec.pad && beat === 0) {
    const barDur = (STEP_MS / 1000) * STEPS_PER_BAR;
    audio.music.note(semi(root + 12), barDur, "sine", 0.16, when);
    audio.music.note(semi(root + 12 + third), barDur, "sine", 0.12, when);
    audio.music.note(semi(root + 19), barDur, "sine", 0.1, when);
  }

  // Drums
  if (sec.drums >= 1) {
    if (beat === 0 || beat === 4) audio.music.kick(when);
    if (beat % 2 === 1 && !stab) {
      audio.music.noiseHit(
        when,
        beat === 7 ? 0.06 : 0.035,
        beat === 7 ? 0.16 : 0.1,
        "highpass",
        6000,
      );
    }
  } else if (beat === 3 || beat === 7) {
    audio.music.noiseHit(when, 0.03, 0.06, "highpass", 7000);
  }
  if (sec.drums === 2 && (beat === 2 || beat === 6)) {
    audio.music.noiseHit(when, 0.12, 0.22, "bandpass", 1800);
    audio.music.note(180, 0.1, "triangle", 0.3, when);
  }
}

// Starts the engine's music player with the game's song. Called on first
// user interaction (browsers require a gesture to unlock audio).
export function startMusic() {
  audio.music.start({
    volume: MUSIC_VOL,
    stepMs: STEP_MS,
    storageKey: "hoppspelet_music",
    schedule: scheduleMusicStep,
  });
}

export function isMusicOn() {
  return audio.music.on;
}

export function setMusicOn(on: boolean) {
  audio.music.setOn(on);
  const btn = document.getElementById("musicMute");
  if (btn) btn.textContent = on ? "🔊" : "🔇";
}

export function playJumpSound() {
  audio.playSfx(function (ctx, now) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    // Small random variation so the jump doesn't sound exactly the same every time
    const detune = 0.94 + Math.random() * 0.12; // ±6 % pitch variation
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

export function playDeathSound() {
  audio.playSfx(function (ctx, now) {
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

export function playCoinSound() {
  audio.playSfx(function (ctx, now) {
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
