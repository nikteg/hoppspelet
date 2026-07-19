"use strict";
import { Minimotor } from "minimotor";
import { handleAction } from "./gameplay.js";
import { debugGoToTheme } from "./world.js";
import { startMusic, setMusicOn, isMusicOn } from "./audio.js";
Minimotor.Engine.onKeyDown = (code) => {
    if (code === "Space")
        handleAction();
};
// ---------- Debug buttons (theme switch) ----------
Minimotor.Input.wireButton("debugPrevTheme", () => debugGoToTheme(-1));
Minimotor.Input.wireButton("debugNextTheme", () => debugGoToTheme(1));
// ---------- Landing page Play button ----------
// handleAction hides the landing page and starts the round directly (game.state "ready").
Minimotor.Input.wireButton("playBtn", handleAction);
// ---------- Mute button for music ----------
function toggleMusic() {
    startMusic(); // ensure music is started (and audio unlocked by the gesture)
    setMusicOn(!isMusicOn());
}
const muteBtn = Minimotor.Input.wireButton("musicMute", toggleMusic);
if (muteBtn)
    muteBtn.textContent = isMusicOn() ? "🔊" : "🔇";
