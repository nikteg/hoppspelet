"use strict";
import { Minimotor } from "minimotor";
import { canvas } from "./stage.js";
import { handleAction } from "./gameplay.js";
import { debugGoToTheme } from "./world.js";
import { startMusic, setMusicOn, isMusicOn } from "./audio.js";
Minimotor.Engine.onKeyDown = function (code) {
    if (code === "Space")
        handleAction();
};
canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    handleAction();
}, { passive: false });
// ---------- Button wiring ----------
// mousedown with preventDefault keeps buttons from grabbing focus, so
// SPACE to jump continues working normally after a click.
// Touch is handled separately and directly in touchstart since preventDefault there
// stops the browser from ever sending the subsequent click event
// (otherwise the buttons did nothing on iPad).
// Returns the element (or null if missing from the HTML - then the
// button is just skipped instead of crashing the rest of the input wiring).
function wireButton(id, action) {
    const btn = document.getElementById(id);
    if (!btn)
        return null;
    btn.addEventListener("mousedown", function (e) {
        e.preventDefault();
    });
    btn.addEventListener("touchstart", function (e) {
        e.preventDefault();
        action();
    }, { passive: false });
    btn.addEventListener("click", function () {
        action();
        btn.blur();
    });
    return btn;
}
// ---------- Debug buttons (temabyte) ----------
wireButton("debugPrevTheme", function () {
    debugGoToTheme(-1);
});
wireButton("debugNextTheme", function () {
    debugGoToTheme(1);
});
// ---------- Landing page Play button ----------
// handleAction hides the landing page and starts the round directly (game.state "ready").
wireButton("playBtn", handleAction);
// ---------- Mute button for music ----------
function toggleMusic() {
    startMusic(); // ensure music is started (and audio unlocked by the gesture)
    setMusicOn(!isMusicOn());
}
const muteBtn = wireButton("musicMute", toggleMusic);
if (muteBtn)
    muteBtn.textContent = isMusicOn() ? "🔊" : "🔇";
