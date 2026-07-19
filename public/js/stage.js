// ---------- Scenen (canvas, resolution, orientering) ----------
// Äger canvas-elementet och allt som rör skärmen: DPR-skalning, safe
// area-insets, ground och pausen i porträttläge. Spellogiken importerar
// måtten härifrån i stället för att räkna ut dem själv.
import { Minimotor } from "minimotor";
import { game, player } from "./state.js";
export const canvas = document.getElementById("game");
Minimotor.Engine.init(canvas);
// Logisk spelyta i CSS-pixlar. Canvasens backing store är DPR gånger
// större (sätts i resizeCanvas) så game blir skarpt på mobil-/retina-
// skärmar - all spellogik och rendering räknar i viewW/viewH.
export let viewW = 0;
export let viewH = 0;
export let DPR = 1;
// Safe area-insets i CSS-pixlar (iPhone-notch m.m.), lästa i resizeCanvas.
export let safeLeft = 0;
export let safeTop = 0;
// Marklinjens y-koordinat (mellanslaget ovanför ground strip).
export let GROUND_Y = 0;
export function resizeCanvas() {
    const prevGroundY = GROUND_Y;
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    // Backing store i fysiska pixlar, logiken i CSS-pixlar. Utan DPR-skalning
    // renderas game i tredjedels resolution på t.ex. iPhone (DPR 3) och
    // blir suddigt. Cap på 2 - skillnaden 2->3 syns knappt men kostar ~2x
    // fill-rate. CSS:en (width/height 100%) skalar ner till skärmstorlek.
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(viewW * DPR);
    canvas.height = Math.round(viewH * DPR);
    // Resize nollställer canvas-tillståndet, så transformen sätts om här.
    Minimotor.Engine.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // Markremsan är 80px på stora skärmar men krymper på låga (mobil i
    // liggande läge) så den inte äter upp spelytan.
    GROUND_Y = viewH - Math.min(80, Math.max(40, Math.round(viewH * 0.12)));
    // Safe area-insets (notch etc.) - CSS-variablerna sätts från env() i
    // styles.css; canvasritad HUD kan inte läsa env() direkt.
    const rootStyle = getComputedStyle(document.documentElement);
    safeLeft = parseFloat(rootStyle.getPropertyValue("--sai-left")) || 0;
    safeTop = parseFloat(rootStyle.getPropertyValue("--sai-top")) || 0;
    // iPhone ger samma inset på BÅDA sidor i liggande läge, så utan att veta
    // åt vilket håll mobilen är vriden indenteras både HUD:en (vänster) och
    // knappraden (höger) i onödan. window.orientation lever kvar på iOS:
    // 90 = notch till vänster, -90 = notch till höger.
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
            safeLeft = 0; // HUD:en till vänster går fri
        // Knappraden till höger viker undan via CSS (html[data-notch="right"]).
        document.documentElement.dataset.notch = notch;
    }
    // Levande objekt har koordinater räknade från den gamla ground. Flytta
    // med dem vid resize, annars svävar spikar i luften och takblockens lucka
    // ändrar storlek (kunde bli opasserbar). Takblock hänger från taket, så
    // där är det höjden (avståndet ner till luckan) som följer ground.
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
// Bakgrundspartiklar (snö, eldar, stjärnor...) som drivs om vid resize.
// Konst-arrayen fylls på nytt i stället för att bytas ut, så att
// importerande moduler alltid ser samma instans.
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
// iOS skickar ingen resize när mobilen vänds 180 grader mellan de två
// liggande lägena (måtten är oförändrade) - men notchen byter sida. Lyssna
// därför också på orientationchange. Kör en extra gång strax efteråt
// eftersom env()-värdena ibland uppdateras först efter händelsen.
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
// ---------- Pausa i porträttläge på mobil ----------
// Samma media query som visar #rotateHint i styles.css. Spelet pausas så
// att man inte hinner dö bakom rotera-överlagret.
const portraitBlock = window.matchMedia("(orientation: portrait) and (pointer: coarse)");
function applyOrientationPause() {
    Minimotor.Engine.paused = portraitBlock.matches;
}
if (portraitBlock.addEventListener) {
    portraitBlock.addEventListener("change", applyOrientationPause);
}
applyOrientationPause();
