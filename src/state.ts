"use strict";

// ---------- Spelet ----------
const canvas = document.getElementById("game") as HTMLCanvasElement;
Engine.init(canvas);

// Logisk spelyta i CSS-pixlar. Canvasens backing store ar DPR ganger
// storre (satts i resizeCanvas) sa spelet blir skarpt pa mobil-/retina-
// skarmar - all spellogik och rendering raknar i viewW/viewH.
let viewW = 0;
let viewH = 0;
let DPR = 1;
// Safe area-insets i CSS-pixlar (iPhone-notch m.m.), lasta i resizeCanvas.
let safeLeft = 0;
let safeTop = 0;

const GRAVITY = 0.7;
const JUMP_FORCE = -13.5;
const PLAYER_X = 150;
const PLAYER_SIZE = 36;

let GROUND_Y = 0;
let state: GameState = "ready"; // ready | playing | gameover
let speed = 6;
let distance = 0;
let best = 0;
try {
  best = parseInt(localStorage.getItem("hoppspelet_best") || "0", 10) || 0;
} catch (e) {}
let spawnTimer = 0;
let nextSpawnAt = 0;

const player = {
  x: PLAYER_X,
  y: 0,
  w: PLAYER_SIZE,
  h: PLAYER_SIZE,
  vy: 0,
  onGround: true,
  rotation: 0,
};

let obstacles: Obstacle[] = [];
let coins: Coin[] = [];
let coinScore = 0;
let coinSpawnTimer = 0;
let coinNextSpawnAt = 0;
let floatingTexts: FloatingText[] = [];

function getScore() {
  return Math.floor(distance / 10) + coinScore;
}
