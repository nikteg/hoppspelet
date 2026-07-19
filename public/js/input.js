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
// ---------- Knapp-koppling ----------
// mousedown med preventDefault hindrar knapparna fran att ta emot fokus, sa att
// MELLANSLAG for att hoppa fortsatter fungera som vanligt efter ett klick.
// Touch hanteras separat och direkt i touchstart eftersom preventDefault dar
// stops the browser from ever sending the subsequent click event
// (annars gjorde knapparna ingenting pa iPad).
// Returnerar elementet (eller null om det saknas i HTML:en - da hoppas
// knappen bara over i stallet for att krascha resten av inputkopplingen).
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
// ---------- Startsidans Spela-knapp ----------
// handleAction gommer startsidan och starts rundan direkt (game.state "ready").
wireButton("playBtn", handleAction);
// ---------- Mute-knapp for music ----------
function toggleMusic() {
    startMusic(); // ensure music is started (and audio unlocked by the gesture)
    setMusicOn(!isMusicOn());
}
const muteBtn = wireButton("musicMute", toggleMusic);
if (muteBtn)
    muteBtn.textContent = isMusicOn() ? "🔊" : "🔇";
