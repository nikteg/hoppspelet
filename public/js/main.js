"use strict";
import { Minimotor } from "minimotor";
import { THEMES } from "./themes.js";
import { currentThemeIndex, level, resetGame } from "./world.js";
import { canvas, viewW, viewH, safeLeft, safeTop } from "./stage.js";
import { game, getScore } from "./state.js";
import { drawAmbientParticles, drawGround } from "./render-helpers.js";
import { drawScenery } from "./scenery.js";
import { drawObstacle, drawCoin, drawPlayer, drawFloatingTexts } from "./sprites.js";
import { update } from "./update.js";
import "./input.js";
function drawUI(ctx, theme) {
    // HUD:en skjuts in innanfor safe area (iPhone-notchen sitter till
    // vanster/uppe beroende pa hur mobilen halls).
    const hx = 16 + safeLeft;
    const hy = safeTop;
    ctx.save();
    ctx.fillStyle = "#f5f0e6";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("Points: " + getScore(), hx, hy + 30);
    ctx.font = "14px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("Bästa: " + game.best, hx, hy + 50);
    ctx.font = "13px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("#" + (currentThemeIndex() + 1) + " " + theme.name, hx, hy + 70);
    ctx.restore();
    if (game.state === "ready") {
        overlayText(ctx, "Tryck MELLANSLAG eller skärmen", "för att start");
    }
    else if (game.state === "gameover") {
        overlayText(ctx, "Du dog! Points: " + getScore(), "Mellanslag/skärm för att start om");
    }
    // Tidsbaserad (inte frame-raknad) sa annonsen visas lika lange pa alla
    // skarmar. Ligger en bit upp pa skarmen sa den inte skymmer player
    // och obstacles mitt i bild.
    const announceLeft = level.announceUntil - performance.now();
    if (announceLeft > 0) {
        const announceY = Math.max(safeTop + 90, viewH * 0.24);
        const alpha = Math.min(1, announceLeft / 500);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(0, announceY - 60, viewW, 90);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 34px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("#" + (currentThemeIndex() + 1) + " " + theme.name + "!", viewW / 2, announceY);
        ctx.restore();
    }
}
function overlayText(ctx, text, subtext) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(text, viewW / 2, viewH / 2 - (subtext ? 14 : 0));
    if (subtext) {
        ctx.font = "18px 'Segoe UI', Arial, sans-serif";
        ctx.fillText(subtext, viewW / 2, viewH / 2 + 22);
    }
    ctx.restore();
}
function draw() {
    const ctx = Minimotor.Engine.ctx;
    const themeIndex = currentThemeIndex();
    const theme = THEMES[themeIndex];
    if (level.appliedIndex !== themeIndex) {
        level.appliedIndex = themeIndex;
        canvas.style.background = theme.bg;
        if (game.state === "playing") {
            level.announceUntil = performance.now() + 2500;
        }
    }
    ctx.clearRect(0, 0, viewW, viewH);
    const t = performance.now() / 250;
    drawAmbientParticles(ctx, theme, t);
    drawScenery(ctx, theme, t);
    drawGround(ctx, theme);
    for (const obs of game.obstacles)
        drawObstacle(ctx, obs, theme);
    for (const c of game.coins)
        drawCoin(ctx, c, theme, t);
    drawPlayer(ctx);
    drawFloatingTexts(ctx);
    drawUI(ctx, theme);
    // Loggan visas bara pa startskarmen
    const showLogo = game.state === "ready";
    if (showLogo !== logoVisible) {
        logoVisible = showLogo;
        logoEl.classList.toggle("hidden", !showLogo);
    }
}
const logoEl = document.getElementById("logo");
let logoVisible = true;
resetGame();
Minimotor.Engine.start(update, draw);
