"use strict";

function jump() {
  if (player.onGround) {
    player.vy = JUMP_FORCE;
    player.onGround = false;
    playJumpSound();
  }
}

// Kort sparr efter doden sa att en spelare som hamrar hopp-knappen inte
// rakar starta om innan hen ens sett poangskarmen.
let diedAt = 0;
const RESTART_LOCK_MS = 600;

function die() {
  if (state === "gameover") return;
  // Kom ihag vilken niva man dog pa sa nasta omgang startar dar (fast med 0 poang).
  // Appliceras forst vid omstart (resetGame) sa gameover-skarmen visar ratt tema.
  pendingLevelOffset = currentThemeIndex();
  state = "gameover";
  diedAt = performance.now();
  best = Math.max(best, getScore());
  try {
    localStorage.setItem("hoppspelet_best", String(best));
  } catch (e) {}
  playDeathSound();
}

function hasCoinNear(x1: number, x2: number) {
  for (const c of coins) {
    if (c.x + c.r > x1 - 30 && c.x - c.r < x2 + 30) return true;
  }
  return false;
}

function spawnObstacle() {
  const spawnX = viewW + 20;
  // Spawna inget ovanpa en redan utlagd myntbage - annars lockas spelaren
  // rakt in i en fara som dok upp efter att mynten placerades.
  if (hasCoinNear(spawnX, spawnX + 150)) return;

  // Slumpa typ: spik (hoppa över), plattform (hoppa upp på) eller takblock (måste gå under)
  let r = Math.random();
  if (r >= 0.8) {
    // Takblock kraver att man springer LAGT. Ett hinder tatt FORE ett
    // takblock ar omojligt att passera: hopp-bagen over spiken/plattformen
    // nar in i takblockets zon och man hinner aldrig ner igen (ett helt
    // hopp tar ~39 steg men minsta spawn-avstand ar 35). Krav darfor fri
    // mark motsvarande ett helt hopp plus marginal fore varje takblock,
    // annars spawnas nagot annat i stallet.
    const clearPx = 55 * speed;
    for (const obs of obstacles) {
      if (obs.x + obs.w > spawnX - clearPx) {
        r = obs.type === "platform" ? 0.7 : 0.3; // plattform resp. spik i stallet
        break;
      }
    }
  }

  if (r < 0.55) {
    // Faror (spik / kottatande vaxt) har alltid samma storlek
    const w = 34;
    const h = 44;
    obstacles.push({ type: "spike", x: spawnX, y: GROUND_Y - h, w: w, h: h });
  } else if (r < 0.8) {
    // Plattformar far fortfarande variera (de ar inte faror)
    const w = 90 + Math.random() * 90;
    const platformHeight = 55 + Math.random() * 55;
    const topY = GROUND_Y - platformHeight;
    obstacles.push({ type: "platform", x: spawnX, y: topY, w: w, h: GROUND_Y - topY });
  } else {
    // Takblock (fara) har alltid samma storlek och hojd over marken
    const w = 100;
    const bottomY = GROUND_Y - PLAYER_SIZE - 38;
    obstacles.push({ type: "ceiling", x: spawnX, y: 0, w: w, h: bottomY });
  }
}

function hasObstacleNear(x1: number, x2: number) {
  for (const obs of obstacles) {
    if (obs.x < x2 + 30 && obs.x + obs.w > x1 - 30) return true;
  }
  return false;
}

function spawnCoins() {
  const arcCount = 5;
  const spacing = 60;
  const startX = viewW + 40;
  const endX = startX + spacing * (arcCount - 1);
  if (hasObstacleNear(startX, endX)) return;

  const baseY = GROUND_Y - PLAYER_SIZE - 20 - Math.random() * 30;
  const arcHeight = 50;
  for (let i = 0; i < arcCount; i++) {
    const x = startX + i * spacing;
    const y = baseY - Math.sin((Math.PI * i) / (arcCount - 1)) * arcHeight;
    coins.push({ x: x, y: y, r: 17, phase: Math.random() * Math.PI * 2, collected: false });
  }
}

// Startsidan ska bort vid forsta speltryck - oavsett om det ar Spela-knappen,
// mellanslag eller ett tryck pa skarmen.
function hideLanding() {
  const el = document.getElementById("landing");
  if (el && el.style.display !== "none") el.style.display = "none";
}

function handleAction() {
  hideLanding();
  startMusic(); // startar musiken vid forsta anvandarinteraktion (browsers kraver en gest)
  if (state === "ready") {
    state = "playing";
    resetGame();
  } else if (state === "playing") {
    jump();
  } else if (state === "gameover") {
    if (performance.now() - diedAt < RESTART_LOCK_MS) return;
    state = "playing";
    resetGame();
  }
}
