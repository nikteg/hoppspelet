// ---------- Game helpers ----------
// Score tracking, game-over overlay, letterbox scaling, and misc
// utilities that every sample was re-implementing.
import * as Storage from "./storage.js";
import * as Text from "./text.js";
export function createScoreTracker(storageKey) {
    let _score = 0;
    let _best = Storage.load(storageKey, 0);
    return {
        get score() { return _score; },
        get best() { return _best; },
        add(points) {
            _score += points;
            if (_score > _best) {
                _best = _score;
                Storage.save(storageKey, _best);
            }
        },
        save() { Storage.save(storageKey, _best); },
    };
}
/** Standard game-over overlay. Draw after your game draw code.
 *  `w`/`h` is the visible game area (not the full canvas if letterboxed). */
export function drawGameOver(ctx, w, h, score, best, restartHint) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, w, h);
    Text.drawCentered(ctx, "GAME OVER", w / 2, h / 2 - 16, {
        font: "bold 28px monospace",
        color: "#ff6b6b",
    });
    Text.drawCentered(ctx, `Score: ${score}  Best: ${best}`, w / 2, h / 2 + 20);
    if (restartHint) {
        Text.drawCentered(ctx, restartHint, w / 2, h / 2 + 48);
    }
}
/** Standard level-complete overlay. */
export function drawLevelComplete(ctx, w, h, score, subtitle, restartHint) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, w, h);
    Text.drawCentered(ctx, "LEVEL COMPLETE! ⭐", w / 2, h / 2 - 30, {
        font: "bold 32px monospace",
        color: "#ffd700",
    });
    Text.drawCentered(ctx, `Score: ${score}`, w / 2, h / 2 + 10);
    if (subtitle) {
        Text.drawCentered(ctx, subtitle, w / 2, h / 2 + 32);
    }
    if (restartHint) {
        Text.drawCentered(ctx, restartHint, w / 2, h / 2 + 58);
    }
}
/** Letterbox scaling: compute the scale and offset to fit a fixed game
 *  area (gameW × gameH) inside the viewport while maintaining aspect ratio.
 *  Returns { scale, ox, oy }. */
export function letterbox(gameW, gameH, viewW, viewH) {
    const scale = Math.min(viewW / gameW, viewH / gameH);
    const ox = (viewW - gameW * scale) / 2;
    const oy = (viewH - gameH * scale) / 2;
    return { scale, ox, oy };
}
/** Draw the letterbox background (fills the full canvas, then draws the
 *  game-area background). Call at the start of your draw function. */
export function drawLetterbox(ctx, viewW, viewH, gameW, gameH, bgColor = "#000", gameBgColor = "#111") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, viewW, viewH);
    const { scale, ox, oy } = letterbox(gameW, gameH, viewW, viewH);
    ctx.fillStyle = gameBgColor;
    ctx.fillRect(ox, oy, gameW * scale, gameH * scale);
    return { scale, ox, oy };
}
