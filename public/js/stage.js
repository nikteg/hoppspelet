// ---------- Stage (canvas, resolution, orientation) ----------
// Owns the canvas element and everything screen-related: DPR scaling, safe
// area insets, ground line and the pause in portrait mode. Game logic
// imports dimensions from here instead of computing them itself.
import { Minimotor } from "minimotor";
import { game, player } from "./state.js";
export const canvas = document.getElementById("game");
Minimotor.Engine.init(canvas);
// Logical play area in CSS pixels. The canvas backing store is DPR times
// larger (set in resizeCanvas) so the game is sharp on mobile/retina
// displays - all game logic and rendering count in viewW/viewH.
export let viewW = 0;
export let viewH = 0;
export let DPR = 1;
// Safe area insets in CSS pixels (iPhone notch etc.), read in resizeCanvas.
export let safeLeft = 0;
export let safeTop = 0;
// Ground line y-coordinate (the gap above the ground strip).
export let GROUND_Y = 0;
export function resizeCanvas() {
    const prevGroundY = GROUND_Y;
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    // Backing store in physical pixels, logic in CSS pixels. Without DPR scaling
    // the game renders at one-third resolution on e.g. iPhone (DPR 3) and
    // becomes blurry. Capped at 2 - the difference 2->3 is barely visible but
    // costs ~2x fill-rate. CSS (width/height 100%) scales down to screen size.
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(viewW * DPR);
    canvas.height = Math.round(viewH * DPR);
    // Resize resets canvas state, so the transform is set again here.
    Minimotor.Engine.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // Ground strip is 80px on large screens but shrinks on short ones (mobile
    // in landscape) so it doesn't eat up the play area.
    GROUND_Y = viewH - Math.min(80, Math.max(40, Math.round(viewH * 0.12)));
    // Safe area insets (notch etc.) - CSS variables are set from env() in
    // styles.css; canvas-drawn HUD can't read env() directly.
    const rootStyle = getComputedStyle(document.documentElement);
    safeLeft = parseFloat(rootStyle.getPropertyValue("--sai-left")) || 0;
    safeTop = parseFloat(rootStyle.getPropertyValue("--sai-top")) || 0;
    // iPhone gives the same inset on BOTH sides in landscape, so without knowing
    // which way the phone is rotated, both the HUD (left) and the button row
    // (right) would be indented unnecessarily. window.orientation lives on iOS:
    // 90 = notch on left, -90 = notch on right.
    if (/iPhone/.test(navigator.userAgent)) {
        let angle = null;
        const win = window;
        if (typeof win.orientation === "number")
            angle = win.orientation;
        else if (screen.orientation && typeof screen.orientation.angle === "number")
            angle = screen.orientation.angle;
        let notch = "none";
        if (angle === 90)
            notch = "left";
        else if (angle === -90 || angle === 270)
            notch = "right";
        if (notch === "right")
            safeLeft = 0; // left-side HUD goes free
        // Right-side button row makes room via CSS (html[data-notch="right"]).
        document.documentElement.dataset.notch = notch;
    }
    // Live objects have coordinates relative to the old ground line. Move
    // them on resize, otherwise spikes float in the air and the ceiling gap
    // changes size (could become impassable). Ceiling blocks hang from the
    // top, so their height (distance down to the gap) follows the ground.
    const dy = GROUND_Y - prevGroundY;
    if (dy !== 0 && prevGroundY !== 0) {
        for (const obs of game.obstacles) {
            if (obs.type === "ceiling") {
                obs.h += dy;
            }
            else {
                obs.y += dy;
            }
        }
        for (const c of game.coins)
            c.y += dy;
        for (const ft of game.floatingTexts)
            ft.y += dy;
        if (game.state === "playing")
            player.y += dy;
    }
    if (game.state !== "playing") {
        player.y = GROUND_Y - player.h;
    }
    initParticles();
}
// Background particles (snow, embers, stars...) that are recreated on resize.
// The const array is refilled instead of replaced, so that
// importing modules always see the same instance.
export const ambientParticles = [];
export function initParticles() {
    ambientParticles.length = 0;
    for (let i = 0; i < 45; i++) {
        ambientParticles.push({
            x: Math.random() * (viewW || window.innerWidth),
            y: Math.random() * (viewH || window.innerHeight),
            size: 1 + Math.random() * 2.5,
            speed: 0.3 + Math.random() * 1.3,
            drift: (Math.random() - 0.5) * 0.6,
            phase: Math.random() * Math.PI * 2,
        });
    }
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
// iOS doesn't fire resize when the phone is rotated 180 degrees between the
// two landscape orientations (dimensions are unchanged) - but the notch
// changes side. So also listen on orientationchange. Run once more shortly
// after because env() values sometimes update only after the event.
window.addEventListener("orientationchange", function () {
    resizeCanvas();
    setTimeout(resizeCanvas, 300);
});
if (screen.orientation && typeof screen.orientation.addEventListener === "function") {
    screen.orientation.addEventListener("change", function () {
        resizeCanvas();
        setTimeout(resizeCanvas, 300);
    });
}
// ---------- Pause in portrait mode on mobile ----------
// Same media query that shows #rotateHint in styles.css. The game is paused
// so you don't die behind the rotation overlay.
const portraitBlock = window.matchMedia("(orientation: portrait) and (pointer: coarse)");
function applyOrientationPause() {
    Minimotor.Engine.paused = portraitBlock.matches;
}
if (portraitBlock.addEventListener) {
    portraitBlock.addEventListener("change", applyOrientationPause);
}
applyOrientationPause();
