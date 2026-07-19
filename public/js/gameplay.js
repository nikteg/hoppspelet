"use strict";
import { game, player, JUMP_FORCE, PLAYER_SIZE, getScore } from "./state.js";
import { viewW, GROUND_Y } from "./stage.js";
import { currentThemeIndex, level, resetGame } from "./world.js";
import { playJumpSound, playDeathSound, startMusic } from "./audio.js";
import { Minimotor } from "minimotor";
function jump() {
    if (player.onGround) {
        player.vy = JUMP_FORCE;
        player.onGround = false;
        playJumpSound();
    }
}
// Brief lock after death so a player hammering the jump button doesn't
// accidentally restart before even seeing the score screen.
let diedAt = 0;
const RESTART_LOCK_MS = 600;
export function die() {
    if (game.state === "gameover")
        return;
    // Remember which level you died on so the next round starts there (but with 0 points).
    // Applied only on reset (resetGame) so the game over screen shows the correct theme.
    level.pending = currentThemeIndex();
    game.state = "gameover";
    diedAt = performance.now();
    game.best = Math.max(game.best, getScore());
    Minimotor.Storage.save("hoppspelet_best", game.best);
    playDeathSound();
}
function hasCoinNear(x1, x2) {
    for (const c of game.coins) {
        if (c.x + c.r > x1 - 30 && c.x - c.r < x2 + 30)
            return true;
    }
    return false;
}
export function spawnObstacle() {
    const spawnX = viewW + 20;
    // Don't spawn on top of an already placed coin arc - otherwise the player is lured
    // straight into a hazard that appeared after coins were placed.
    if (hasCoinNear(spawnX, spawnX + 150))
        return;
    // Random type: spike (jump over), platform (jump onto) or ceiling block (must go under)
    let r = Math.random();
    if (r >= 0.8) {
        // Ceiling blocks require the player to run LOW. An obstacle right BEFORE a
        // ceiling block is impossible to pass: the jump arc over the spike/platform
        // reaches the ceiling block's zone and you never have time to get back down (a full
        // jump takes ~39 steps but the minimum spawn distance is 35). Therefore require clear
        // ground equivalent to a full jump plus margin before every ceiling block,
        // otherwise spawn something else instead.
        const clearPx = 55 * game.speed;
        for (const obs of game.obstacles) {
            if (obs.x + obs.w > spawnX - clearPx) {
                r = obs.type === "platform" ? 0.7 : 0.3; // platform or spike instead
                break;
            }
        }
    }
    if (r < 0.55) {
        // Hazards (spike / carnivorous plant) always have the same size
        const w = 34;
        const h = 44;
        game.obstacles.push({ type: "spike", x: spawnX, y: GROUND_Y - h, w: w, h: h });
    }
    else if (r < 0.8) {
        // Platforms still get to vary (they are not hazards)
        const w = 90 + Math.random() * 90;
        const platformHeight = 55 + Math.random() * 55;
        const topY = GROUND_Y - platformHeight;
        game.obstacles.push({ type: "platform", x: spawnX, y: topY, w: w, h: GROUND_Y - topY });
    }
    else {
        // Ceiling blocks (hazard) always have the same size and height above ground
        const w = 100;
        const bottomY = GROUND_Y - PLAYER_SIZE - 38;
        game.obstacles.push({ type: "ceiling", x: spawnX, y: 0, w: w, h: bottomY });
    }
}
function hasObstacleNear(x1, x2) {
    for (const obs of game.obstacles) {
        if (obs.x < x2 + 30 && obs.x + obs.w > x1 - 30)
            return true;
    }
    return false;
}
export function spawnCoins() {
    const arcCount = 5;
    const spacing = 60;
    const startX = viewW + 40;
    const endX = startX + spacing * (arcCount - 1);
    if (hasObstacleNear(startX, endX))
        return;
    const baseY = GROUND_Y - PLAYER_SIZE - 20 - Math.random() * 30;
    const arcHeight = 50;
    for (let i = 0; i < arcCount; i++) {
        const x = startX + i * spacing;
        const y = baseY - Math.sin((Math.PI * i) / (arcCount - 1)) * arcHeight;
        game.coins.push({ x: x, y: y, r: 17, phase: Math.random() * Math.PI * 2, collected: false });
    }
}
// The landing page should go away on first game press - whether it's the Play button,
// spacebar or a tap on the screen.
function hideLanding() {
    const el = document.getElementById("landing");
    if (el && el.style.display !== "none")
        el.style.display = "none";
}
export function handleAction() {
    hideLanding();
    startMusic(); // starts music on first user interaction (browsers require a gesture)
    if (game.state === "ready") {
        game.state = "playing";
        resetGame();
    }
    else if (game.state === "playing") {
        jump();
    }
    else if (game.state === "gameover") {
        if (performance.now() - diedAt < RESTART_LOCK_MS)
            return;
        game.state = "playing";
        resetGame();
    }
}
