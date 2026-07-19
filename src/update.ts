"use strict";
import { Minimotor } from "minimotor";
import { game, player, GRAVITY } from "./state.js";
import { GROUND_Y } from "./stage.js";
import { die, spawnObstacle, spawnCoins } from "./gameplay.js";
import { playCoinSound } from "./audio.js";

// Fartkapp: hindrar bade omojlig svarighetsgrad och "tunnling" - vid extrem
// fart kan ett smalt obstacle annars passera rakt genom player hitbox
// mellan tva uppdateringar utan att kollisionen upptacks.
const MAX_SPEED = 22;

export function update() {
  if (game.state !== "playing") return;

  // Increase difficulty slowly over time
  if (game.speed < MAX_SPEED) game.speed += 0.0015;
  game.distance += game.speed;

  // Gravity + collision against platforms (can jump onto, otherwise solid)
  const prevBottom = player.y + player.h;
  player.vy += GRAVITY;
  const tentativeY = player.y + player.vy;
  const tentativeBottom = tentativeY + player.h;

  let floor = GROUND_Y;
  let crashed = false;
  // Samma marginal som dodliga obstacle far (nedan), sa att en pixelsnudd
  // mot plattformens framkant inte dodar - kanns orattvist annars.
  const sideMargin = 6;

  for (const obs of game.obstacles) {
    if (obs.type !== "platform") continue;
    const overlapsX = player.x + player.w > obs.x && player.x < obs.x + obs.w;
    if (!overlapsX) continue;
    if (prevBottom <= obs.y + 1 && tentativeBottom >= obs.y) {
      // Landing on top of platform
      if (obs.y < floor) floor = obs.y;
    } else if (
      tentativeBottom > obs.y + sideMargin &&
      player.y + sideMargin < obs.y + obs.h &&
      player.x + player.w - sideMargin > obs.x &&
      player.x + sideMargin < obs.x + obs.w
    ) {
      // Sprang in i plattformens sida/undersida
      crashed = true;
    }
  }

  if (crashed) {
    die();
    return;
  }

  player.y = tentativeY;
  if (player.y + player.h >= floor) {
    player.y = floor - player.h;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // Rotate the character slightly in the air for feel
  if (!player.onGround) {
    player.rotation += 0.12;
  } else {
    player.rotation = 0;
  }

  // Flytta obstacle
  for (const obs of game.obstacles) {
    obs.x -= game.speed;
  }
  game.obstacles = game.obstacles.filter((o) => o.x + o.w > -10);

  // Spawna nya obstacle
  game.spawnTimer++;
  if (game.spawnTimer >= game.nextSpawnAt) {
    spawnObstacle();
    game.spawnTimer = 0;
    game.nextSpawnAt = 55 + Math.random() * 50 - Math.min(game.speed, 20);
    if (game.nextSpawnAt < 35) game.nextSpawnAt = 35;
  }

  // Move and collect coins (give bonus points, never dangerous)
  for (const c of game.coins) {
    c.x -= game.speed;
  }
  for (const c of game.coins) {
    if (c.collected) continue;
    const dx = player.x + player.w / 2 - c.x;
    const dy = player.y + player.h / 2 - c.y;
    if (Math.sqrt(dx * dx + dy * dy) < c.r + player.w * 0.4) {
      c.collected = true;
      game.coinScore += 10;
      playCoinSound();
      game.floatingTexts.push({
        x: player.x + player.w / 2,
        y: player.y - 6,
        text: "+10",
        life: 45,
        maxLife: 45,
      });
    }
  }
  game.coins = game.coins.filter((c) => !c.collected && c.x > -30);

  // Score text floating up from the character and fading out
  for (const ft of game.floatingTexts) {
    ft.y -= 1.3;
    ft.x -= game.speed * 0.3;
    ft.life--;
  }
  game.floatingTexts = game.floatingTexts.filter((ft) => ft.life > 0);

  game.coinSpawnTimer++;
  if (game.coinSpawnTimer >= game.coinNextSpawnAt) {
    spawnCoins();
    game.coinSpawnTimer = 0;
    game.coinNextSpawnAt = 70 + Math.random() * 80;
  }

  // Collision check against deadly obstacles (spikes and ceiling blocks). Small margin for fair feel.
  const margin = 6;
  const playerBox = {
    x: player.x + margin,
    y: player.y + margin,
    w: player.w - margin * 2,
    h: player.h - margin * 2,
  };
  for (const obs of game.obstacles) {
    if (obs.type === "platform") continue;
    if (Minimotor.Collision.rectsOverlap(playerBox, obs)) {
      die();
    }
  }
}
