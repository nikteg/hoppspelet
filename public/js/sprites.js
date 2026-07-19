"use strict";
import { DPR } from "./stage.js";
import { player, game } from "./state.js";
import { WORLDS } from "./worlds/index.js";
export function drawStarShape(ctx, cx, cy, outerR, innerR) {
    const spikes = 5;
    let rot = -Math.PI / 2;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
        let x = cx + Math.cos(rot) * outerR;
        let y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.closePath();
}
// Coins are pre-rendered to an offscreen-canvas per theme (the designs are static
// - the spin is just an x-scale at draw time). That way we pay for shadowBlur and
// gradients ONCE per theme instead of per coin and frame, so we can
// afford detailed designs.
const coinSpriteCache = new Map();
export function getCoinSprite(theme, r) {
    const key = theme.key + ":" + r + ":" + DPR;
    let sprite = coinSpriteCache.get(key);
    if (!sprite) {
        sprite = document.createElement("canvas");
        const size = Math.ceil(r * 5); // room for glow and shapes outside the radius
        // Baked at DPR resolution, otherwise coins become blurry on retina screens.
        sprite.width = Math.ceil(size * DPR);
        sprite.height = Math.ceil(size * DPR);
        sprite.logicalSize = size;
        const octx = sprite.getContext("2d");
        octx.scale(DPR, DPR);
        octx.translate(size / 2, size / 2);
        drawCoinDesign(octx, r, theme);
        coinSpriteCache.set(key, sprite);
    }
    return sprite;
}
export function drawCoin(ctx, coin, theme, t) {
    const spin = Math.max(0.15, Math.abs(Math.cos(t * 1.5 + coin.phase)));
    const sprite = getCoinSprite(theme, coin.r);
    const size = sprite.logicalSize;
    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.scale(spin, 1);
    ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
    ctx.restore();
}
// Draws the actual coin design centered at (0,0). Called ONLY against
// the offscreen-canvas in getCoinSprite, so composite tricks (e.g.
// destination-out for the crescent moon) are safe here.
export function drawCoinDesign(ctx, r, theme) {
    WORLDS[theme.key]?.drawCoinDesign(ctx, r);
}
export function drawPlayer(ctx) {
    ctx.save();
    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
    ctx.rotate(player.rotation);
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(-player.w / 2, -player.h / 2, player.w, player.h);
    // eyes
    ctx.fillStyle = "#1b1f2a";
    ctx.fillRect(4, -8, 5, 5);
    ctx.fillRect(-player.w / 2 + 6, -8, 5, 5);
    // angry eyebrows (angled lines above the eyes)
    ctx.strokeStyle = "#1b1f2a";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(2, -13);
    ctx.lineTo(11, -16);
    ctx.moveTo(-2, -13);
    ctx.lineTo(-11, -16);
    ctx.stroke();
    ctx.restore();
}
export function drawFloatingTexts(ctx) {
    for (const ft of game.floatingTexts) {
        const alpha = Math.max(0, ft.life / ft.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = "center";
        ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = 3;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = "#ffe066";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
    }
}
export function drawSeaUrchin(ctx, obs) {
    const cx = obs.x + obs.w / 2, cy = obs.y + obs.h / 2, r = Math.min(obs.w, obs.h) / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    const spikes = 10;
    for (let i = 0; i < spikes; i++) {
        const a = ((Math.PI * 2) / spikes) * i;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5);
        ctx.lineTo(cx + Math.cos(a) * r * 1.2, cy + Math.sin(a) * r * 1.2);
        ctx.stroke();
    }
}
export function drawVenusTrap(ctx, obs) {
    const cx = obs.x + obs.w / 2;
    const groundY = obs.y + obs.h;
    const headY = obs.y + obs.h * 0.42; // where the gaping jaws sit
    const lobeR = obs.w * 0.52;
    const gape = 0.42; // hur mycket munnen gapar (radianer fran mittlinjen)
    // Gentle "breathing"/chewing so the plant feels alive
    const chew = Math.sin(performance.now() / 220 + obs.x * 0.05) * 0.12;
    const openAngle = gape + Math.max(0, chew);
    // ---- Stem with a couple of leaves ----
    ctx.save();
    ctx.strokeStyle = "#2f6b22";
    ctx.lineWidth = obs.w * 0.16;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, groundY);
    ctx.quadraticCurveTo(cx + Math.sin(chew) * 6, (groundY + headY) / 2, cx, headY + lobeR * 0.4);
    ctx.stroke();
    // Blad
    ctx.fillStyle = "#3a7d26";
    for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(cx + dir * obs.w * 0.28, groundY - obs.h * 0.18, obs.w * 0.22, obs.h * 0.08, dir * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
    // ---- Two gaping jaw lobes ----
    // Varje lob ar en halvellips som roterats ut fran mittlinjen (uppat).
    for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(cx, headY);
        ctx.rotate(side * openAngle);
        // Yttre lob (gron gradient)
        const g = ctx.createLinearGradient(0, -lobeR, 0, 0);
        g.addColorStop(0, "#7ab83a");
        g.addColorStop(1, "#356b1e");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, -lobeR * 0.5, lobeR * 0.62, lobeR, 0, 0, Math.PI * 2);
        ctx.fill();
        // Rod insida
        ctx.fillStyle = "#c0324f";
        ctx.beginPath();
        ctx.ellipse(0, -lobeR * 0.5, lobeR * 0.4, lobeR * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Sma trigger-har pa insidan
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        for (let h = 0; h < 3; h++) {
            ctx.beginPath();
            ctx.moveTo(0, -lobeR * (0.35 + h * 0.2));
            ctx.lineTo(side * 3, -lobeR * (0.35 + h * 0.2) - 5);
            ctx.stroke();
        }
        // Sammanflatande tander langs innerkanten (den rundade toppen)
        ctx.fillStyle = "#eae4cf";
        const teeth = 7;
        for (let i = 0; i <= teeth; i++) {
            const a = Math.PI + (Math.PI * i) / teeth; // over ytterkanten
            const ex = Math.cos(a) * lobeR * 0.62;
            const ey = -lobeR * 0.5 + Math.sin(a) * lobeR;
            // rikta tanden inat mot mittlinjen (side * -1)
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(ex - side * 7, ey - 3);
            ctx.lineTo(ex - side * 2, ey + 6);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
    // Small glowing "lure" droplet in the middle of the mouth
    ctx.fillStyle = "rgba(255,240,150,0.8)";
    ctx.beginPath();
    ctx.arc(cx, headY - lobeR * 0.35, obs.w * 0.06, 0, Math.PI * 2);
    ctx.fill();
}
export function drawIcicleCluster(ctx, obs) {
    // Dark blue outline - the icicles are almost white, just like the ice ground
    ctx.save();
    ctx.strokeStyle = "#1f4a6a";
    ctx.lineWidth = 1.8;
    const n = 3;
    for (let i = 0; i < n; i++) {
        const bx = obs.x + (obs.w / n) * i;
        const bw = obs.w / n;
        const h = obs.h * (i === 1 ? 1 : 0.65);
        ctx.beginPath();
        ctx.moveTo(bx, obs.y + obs.h);
        ctx.lineTo(bx + bw / 2, obs.y + (obs.h - h));
        ctx.lineTo(bx + bw, obs.y + obs.h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}
export function drawAsteroidChunk(ctx, obs) {
    // Light outline + craters - the rock is almost as dark as the space ground
    ctx.save();
    ctx.strokeStyle = "#b8b8cf";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(obs.x, obs.y + obs.h * 0.6);
    ctx.lineTo(obs.x + obs.w * 0.25, obs.y + obs.h * 0.1);
    ctx.lineTo(obs.x + obs.w * 0.6, obs.y);
    ctx.lineTo(obs.x + obs.w, obs.y + obs.h * 0.35);
    ctx.lineTo(obs.x + obs.w * 0.85, obs.y + obs.h);
    ctx.lineTo(obs.x + obs.w * 0.2, obs.y + obs.h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(184,184,207,0.35)";
    ctx.beginPath();
    ctx.arc(obs.x + obs.w * 0.4, obs.y + obs.h * 0.45, 4, 0, Math.PI * 2);
    ctx.arc(obs.x + obs.w * 0.68, obs.y + obs.h * 0.7, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
export function drawCactus(ctx, obs) {
    // Saguaro cactus: rounded arms (thick lines with round ends), ribs,
    // spines and a flower on top. Dark outline gives clarity against the sand.
    const cx = obs.x + obs.w / 2;
    const bot = obs.y + obs.h;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const trunk = () => {
        ctx.beginPath();
        ctx.moveTo(cx, bot);
        ctx.lineTo(cx, obs.y + 8);
    };
    const armL = () => {
        ctx.beginPath();
        ctx.moveTo(cx - 1, bot - obs.h * 0.36);
        ctx.lineTo(cx - obs.w * 0.32, bot - obs.h * 0.4);
        ctx.lineTo(cx - obs.w * 0.32, bot - obs.h * 0.64);
    };
    const armR = () => {
        ctx.beginPath();
        ctx.moveTo(cx + 1, bot - obs.h * 0.5);
        ctx.lineTo(cx + obs.w * 0.32, bot - obs.h * 0.54);
        ctx.lineTo(cx + obs.w * 0.32, bot - obs.h * 0.76);
    };
    // Forst bred mork kontur, sedan gron kropp ovanpa
    for (const [col, extra] of [
        ["#142a0c", 3.5],
        ["#3f7d32", 0],
    ]) {
        ctx.strokeStyle = col;
        ctx.lineWidth = obs.w * 0.3 + extra;
        trunk();
        ctx.stroke();
        ctx.lineWidth = obs.w * 0.2 + extra;
        armL();
        ctx.stroke();
        armR();
        ctx.stroke();
    }
    // Ribbor
    ctx.strokeStyle = "rgba(15,40,8,0.45)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 2, bot - 2);
    ctx.lineTo(cx - 2, obs.y + 10);
    ctx.moveTo(cx + 2, bot - 2);
    ctx.lineTo(cx + 2, obs.y + 12);
    ctx.stroke();
    // Spines
    ctx.strokeStyle = "#ffdf9b";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (const [tx, ty] of [
        [-0.18, 0.2],
        [0.18, 0.3],
        [-0.18, 0.45],
        [0.18, 0.62],
        [-0.18, 0.72],
    ]) {
        ctx.moveTo(cx + tx * obs.w, bot - obs.h * ty);
        ctx.lineTo(cx + tx * obs.w * 1.7, bot - obs.h * (ty + 0.03));
    }
    ctx.stroke();
    // Blomma pa toppen
    ctx.fillStyle = "#ff7ab0";
    for (let p = 0; p < 5; p++) {
        const a = (Math.PI * 2 * p) / 5 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * 3.6, obs.y + 4 + Math.sin(a) * 3.6, 2.8, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = "#ffdf9b";
    ctx.beginPath();
    ctx.arc(cx, obs.y + 4, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
export function drawLollipop(ctx, obs) {
    // Big swirly lollipop on a stick (candy)
    const cx = obs.x + obs.w / 2;
    const R = obs.w * 0.48;
    const cy = obs.y + R + 2;
    ctx.save();
    // Pinne
    ctx.strokeStyle = "#8a4a5a";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, obs.y + obs.h);
    ctx.lineTo(cx, cy + R * 0.5);
    ctx.stroke();
    // Klubba
    ctx.fillStyle = "#fff6fa";
    ctx.strokeStyle = "#7a1435";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Rod spiral
    ctx.strokeStyle = "#e0325c";
    ctx.lineWidth = R * 0.24;
    ctx.lineCap = "round";
    ctx.beginPath();
    const turns = Math.PI * 5;
    for (let a = 0; a <= turns; a += 0.25) {
        const rr = R * 0.08 + (a / turns) * R * 0.74;
        const px = cx + Math.cos(a) * rr;
        const py = cy + Math.sin(a) * rr;
        if (a === 0)
            ctx.moveTo(px, py);
        else
            ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
}
export function drawGearSpike(ctx, obs) {
    // Gear with warm-yellow edge and hub ring - steel gray otherwise blends
    // into the factory's dark ground.
    const cx = obs.x + obs.w / 2, cy = obs.y + obs.h / 2, r = Math.min(obs.w, obs.h) / 2;
    const teeth = 8;
    ctx.save();
    ctx.strokeStyle = "#ffc94a";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
        const a1 = ((Math.PI * 2) / teeth) * i;
        const a2 = a1 + ((Math.PI * 2) / teeth) * 0.5;
        const x1 = cx + Math.cos(a1) * r, y1 = cy + Math.sin(a1) * r;
        const x2 = cx + Math.cos(a2) * r * 0.65, y2 = cy + Math.sin(a2) * r * 0.65;
        if (i === 0)
            ctx.moveTo(x1, y1);
        else
            ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffc94a";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
}
export function drawFlameSpike(ctx, obs, theme) {
    // Flickering flame pillar (dragon/phoenix/volcano themes)
    const cx = obs.x + obs.w / 2;
    const baseY = obs.y + obs.h;
    const flick = Math.sin(performance.now() / 90 + obs.x * 0.1) * obs.h * 0.06;
    ctx.save();
    ctx.shadowColor = theme.hazard.glow;
    ctx.shadowBlur = 14;
    const g = ctx.createLinearGradient(0, baseY, 0, obs.y);
    g.addColorStop(0, "#7a1a0a");
    g.addColorStop(0.45, "#ff6a2a");
    g.addColorStop(1, "#ffd94a");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx - obs.w * 0.5, baseY);
    ctx.quadraticCurveTo(cx - obs.w * 0.55, baseY - obs.h * 0.5, cx, obs.y + flick);
    ctx.quadraticCurveTo(cx + obs.w * 0.55, baseY - obs.h * 0.5, cx + obs.w * 0.5, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,245,200,0.85)";
    ctx.beginPath();
    ctx.moveTo(cx - obs.w * 0.18, baseY);
    ctx.quadraticCurveTo(cx - obs.w * 0.2, baseY - obs.h * 0.35, cx, baseY - obs.h * 0.55 + flick);
    ctx.quadraticCurveTo(cx + obs.w * 0.2, baseY - obs.h * 0.35, cx + obs.w * 0.18, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
export function drawCrystalSpike(ctx, obs, theme) {
    // Klunga av glodande kristallspetsar (kristall-/alv-/dromteman)
    const col = theme.crystalColor || theme.spikeStroke || theme.platformTop;
    ctx.save();
    ctx.shadowColor = col;
    ctx.shadowBlur = 12;
    ctx.fillStyle = theme.spike;
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    const n = 3;
    for (let i = 0; i < n; i++) {
        const bx = obs.x + (obs.w / n) * i;
        const bw = obs.w / n;
        const h = obs.h * (i === 1 ? 1 : 0.7);
        const skew = (i - 1) * bw * 0.2;
        ctx.beginPath();
        ctx.moveTo(bx, obs.y + obs.h);
        ctx.lineTo(bx + bw * 0.5 + skew, obs.y + obs.h - h);
        ctx.lineTo(bx + bw, obs.y + obs.h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}
export function drawAnchor(ctx, obs) {
    // Skeppsankare (piratema). Ritas forst med bred ljus kontur och sedan
    // morkt jarn ovanpa - annars forsvinner det mot strandens morka mark.
    const cx = obs.x + obs.w / 2;
    const top = obs.y;
    const bot = obs.y + obs.h;
    ctx.save();
    ctx.lineCap = "round";
    const strokeAll = (col, lw) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.arc(cx, top + obs.w * 0.14, obs.w * 0.13, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, top + obs.w * 0.28);
        ctx.lineTo(cx, bot - obs.h * 0.12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - obs.w * 0.32, top + obs.h * 0.32);
        ctx.lineTo(cx + obs.w * 0.32, top + obs.h * 0.32);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, bot - obs.h * 0.38, obs.w * 0.42, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
    };
    strokeAll("#e8dcc0", obs.w * 0.16 + 3.5);
    strokeAll("#22262a", obs.w * 0.16);
    for (const s of [-1, 1]) {
        const fx = cx + s * obs.w * 0.42;
        const fy = bot - obs.h * 0.3;
        ctx.fillStyle = "#22262a";
        ctx.strokeStyle = "#e8dcc0";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx + s * obs.w * 0.16, fy - obs.h * 0.1);
        ctx.lineTo(fx, fy - obs.h * 0.16);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    ctx.restore();
}
export function drawObelisk(ctx, obs, theme) {
    // Obelisk med guldtopp och hieroglyfstreck (egypten). Mork kontur och
    // glodande topp sa den inte flyter ihop med sandens farger.
    const cx = obs.x + obs.w / 2;
    ctx.save();
    ctx.fillStyle = theme.spike;
    ctx.strokeStyle = "#241404";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - obs.w * 0.32, obs.y + obs.h);
    ctx.lineTo(cx - obs.w * 0.2, obs.y + obs.h * 0.25);
    ctx.lineTo(cx, obs.y);
    ctx.lineTo(cx + obs.w * 0.2, obs.y + obs.h * 0.25);
    ctx.lineTo(cx + obs.w * 0.32, obs.y + obs.h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "rgba(255,216,90,0.9)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#ffd85a";
    ctx.beginPath();
    ctx.moveTo(cx, obs.y);
    ctx.lineTo(cx + obs.w * 0.14, obs.y + obs.h * 0.18);
    ctx.lineTo(cx - obs.w * 0.14, obs.y + obs.h * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,224,160,0.7)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cx - obs.w * 0.08, obs.y + obs.h * 0.35);
    ctx.lineTo(cx + obs.w * 0.08, obs.y + obs.h * 0.35);
    ctx.moveTo(cx, obs.y + obs.h * 0.45);
    ctx.lineTo(cx, obs.y + obs.h * 0.6);
    ctx.moveTo(cx - obs.w * 0.08, obs.y + obs.h * 0.7);
    ctx.lineTo(cx + obs.w * 0.08, obs.y + obs.h * 0.7);
    ctx.stroke();
    ctx.restore();
}
export function drawBrokenColumn(ctx, obs, theme) {
    // Avbruten antik kolonn (rom). Mork kontur + skuggad sida - utan dem
    // blends the light stone into Colosseum's light ground/background.
    const x = obs.x + obs.w * 0.15;
    const w = obs.w * 0.7;
    ctx.save();
    ctx.fillStyle = theme.platform;
    ctx.strokeStyle = "#2a1c08";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, obs.y + obs.h);
    ctx.lineTo(x, obs.y + obs.h * 0.25);
    ctx.lineTo(x + w * 0.3, obs.y + obs.h * 0.12);
    ctx.lineTo(x + w * 0.55, obs.y + obs.h * 0.3);
    ctx.lineTo(x + w * 0.8, obs.y);
    ctx.lineTo(x + w, obs.y + obs.h * 0.2);
    ctx.lineTo(x + w, obs.y + obs.h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(40,25,5,0.55)";
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (w / 4) * i, obs.y + obs.h * 0.35);
        ctx.lineTo(x + (w / 4) * i, obs.y + obs.h);
        ctx.stroke();
    }
    ctx.fillStyle = "rgba(40,25,5,0.3)";
    ctx.beginPath();
    ctx.moveTo(x + w * 0.8, obs.y);
    ctx.lineTo(x + w, obs.y + obs.h * 0.2);
    ctx.lineTo(x + w, obs.y + obs.h);
    ctx.lineTo(x + w * 0.72, obs.y + obs.h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = theme.platformTop;
    ctx.strokeStyle = "#2a1c08";
    ctx.lineWidth = 1.6;
    ctx.fillRect(x - 4, obs.y + obs.h - 7, w + 8, 7);
    ctx.strokeRect(x - 4, obs.y + obs.h - 7, w + 8, 7);
    ctx.restore();
}
export function drawObstacle(ctx, obs, theme) {
    if (obs.type === "platform") {
        ctx.fillStyle = theme.platform;
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillStyle = theme.platformTop;
        ctx.fillRect(obs.x, obs.y, obs.w, 8);
        // lite kant-textur
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        for (let x = obs.x + 10; x < obs.x + obs.w - 5; x += 22) {
            ctx.fillRect(x, obs.y + 10, 10, obs.h - 16);
        }
    }
    else if (obs.type === "ceiling") {
        ctx.fillStyle = theme.ceiling;
        ctx.fillRect(obs.x, 0, obs.w, obs.h);
        // hanging formations along the bottom edge (stalactites/icicles/vines/cliffs)
        ctx.fillStyle = theme.ceiling;
        const spikeCount = Math.max(2, Math.floor(obs.w / 20));
        const spikeW = obs.w / spikeCount;
        for (let i = 0; i < spikeCount; i++) {
            const sx = obs.x + i * spikeW;
            ctx.beginPath();
            ctx.moveTo(sx, obs.h);
            ctx.lineTo(sx + spikeW / 2, obs.h + 14);
            ctx.lineTo(sx + spikeW, obs.h);
            ctx.closePath();
            ctx.fill();
            if (theme.ceilingAccent) {
                ctx.save();
                ctx.shadowColor = theme.ceilingAccent;
                ctx.shadowBlur = 8;
                ctx.fillStyle = theme.ceilingAccent;
                ctx.beginPath();
                ctx.arc(sx + spikeW / 2, obs.h + 12, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                ctx.fillStyle = theme.ceiling;
            }
        }
    }
    else {
        // Gemensamma matt for farodesignerna. Varje theme har sin egen fara och
        // ALLA ritas med en kontrasterande kontur sa de syns mot bakgrunden.
        const sx = obs.x, sy = obs.y, sw = obs.w, sh = obs.h;
        const scx = sx + sw / 2, sgy = sy + sh;
        ctx.fillStyle = theme.spike;
        switch (theme.key) {
            case "ocean":
                drawSeaUrchin(ctx, obs);
                break;
            case "jungle":
                drawVenusTrap(ctx, obs);
                break;
            case "ice":
                drawIcicleCluster(ctx, obs);
                break;
            case "space":
                drawAsteroidChunk(ctx, obs);
                break;
            case "desert":
                drawCactus(ctx, obs);
                break;
            case "candy":
                drawLollipop(ctx, obs);
                break;
            case "robot":
                drawGearSpike(ctx, obs);
                break;
            case "dragon":
            case "phoenix":
            case "volcanoisland":
                drawFlameSpike(ctx, obs, theme);
                break;
            case "crystal":
            case "fairy":
            case "dream":
            case "unicorn":
                drawCrystalSpike(ctx, obs, theme);
                break;
            case "pirate":
                drawAnchor(ctx, obs);
                break;
            case "egypt":
                drawObelisk(ctx, obs, theme);
                break;
            case "rome":
                drawBrokenColumn(ctx, obs, theme);
                break;
            case "lava": {
                // Obsidianskarvor med glodande kanter
                ctx.save();
                ctx.fillStyle = "#14080a";
                ctx.strokeStyle = "#ff7b3a";
                ctx.lineWidth = 1.6;
                ctx.shadowColor = "rgba(255,120,40,0.8)";
                ctx.shadowBlur = 8;
                for (const [ox, hh] of [
                    [0.2, 0.6],
                    [0.5, 1],
                    [0.8, 0.55],
                ]) {
                    ctx.beginPath();
                    ctx.moveTo(sx + sw * (ox - 0.19), sgy);
                    ctx.lineTo(sx + sw * ox, sgy - sh * hh);
                    ctx.lineTo(sx + sw * (ox + 0.19), sgy);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "sky": {
                // Litet askmoln med blixt under
                ctx.save();
                ctx.fillStyle = "#5a6a7a";
                ctx.strokeStyle = "#1f2a36";
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.ellipse(scx, sy + sh * 0.28, sw * 0.52, sh * 0.2, 0, 0, Math.PI * 2);
                ctx.ellipse(scx - sw * 0.3, sy + sh * 0.36, sw * 0.28, sh * 0.15, 0, 0, Math.PI * 2);
                ctx.ellipse(scx + sw * 0.3, sy + sh * 0.36, sw * 0.28, sh * 0.15, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.shadowColor = "rgba(255,220,90,0.9)";
                ctx.shadowBlur = 8;
                ctx.fillStyle = "#ffd23a";
                ctx.beginPath();
                ctx.moveTo(scx + sw * 0.05, sy + sh * 0.45);
                ctx.lineTo(scx - sw * 0.18, sgy - sh * 0.26);
                ctx.lineTo(scx + sw * 0.02, sgy - sh * 0.26);
                ctx.lineTo(scx - sw * 0.12, sgy);
                ctx.lineTo(scx + sw * 0.26, sgy - sh * 0.36);
                ctx.lineTo(scx + sw * 0.07, sgy - sh * 0.36);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;
            }
            case "neon": {
                // Korsade laserstralar
                ctx.save();
                ctx.lineCap = "round";
                ctx.lineWidth = 3;
                ctx.shadowBlur = 10;
                ctx.shadowColor = "rgba(0,240,255,0.9)";
                ctx.strokeStyle = "#0ff0fc";
                ctx.beginPath();
                ctx.moveTo(sx + 3, sgy);
                ctx.lineTo(scx + sw * 0.18, sy);
                ctx.stroke();
                ctx.shadowColor = "rgba(255,47,176,0.9)";
                ctx.strokeStyle = "#ff2fb0";
                ctx.beginPath();
                ctx.moveTo(sx + sw - 3, sgy);
                ctx.lineTo(scx - sw * 0.18, sy);
                ctx.stroke();
                ctx.shadowColor = "rgba(255,255,255,0.9)";
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(scx, sy + sh * 0.2, 2.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "haunted": {
                // Spoklaga med onda ogon
                ctx.save();
                ctx.shadowColor = "rgba(140,255,170,0.8)";
                ctx.shadowBlur = 10;
                ctx.fillStyle = "rgba(80,150,100,0.92)";
                ctx.strokeStyle = "#c9ffd9";
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(sx + 3, sgy);
                ctx.quadraticCurveTo(sx - 1, sgy - sh * 0.5, scx - sw * 0.12, sgy - sh * 0.6);
                ctx.quadraticCurveTo(scx - sw * 0.05, sgy - sh * 0.85, scx + sw * 0.05, sgy - sh);
                ctx.quadraticCurveTo(scx + sw * 0.32, sgy - sh * 0.55, sx + sw - 3, sgy - sh * 0.3);
                ctx.quadraticCurveTo(sx + sw + 1, sgy - sh * 0.1, sx + sw - 3, sgy);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#0a140c";
                ctx.beginPath();
                ctx.arc(scx - 4, sgy - sh * 0.42, 2.2, 0, Math.PI * 2);
                ctx.arc(scx + 5, sgy - sh * 0.47, 2.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "viking": {
                // Nedstucken stridsyxa
                ctx.save();
                ctx.strokeStyle = "#5a4530";
                ctx.lineWidth = 4;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(scx, sgy);
                ctx.lineTo(scx, sy + 4);
                ctx.stroke();
                ctx.fillStyle = "#d5dde4";
                ctx.strokeStyle = "#1f2830";
                ctx.lineWidth = 1.6;
                for (const s of [-1, 1]) {
                    ctx.beginPath();
                    ctx.moveTo(scx, sy + 4);
                    ctx.quadraticCurveTo(scx + s * sw * 0.55, sy, scx + s * sw * 0.48, sy + sh * 0.36);
                    ctx.quadraticCurveTo(scx + s * sw * 0.18, sy + sh * 0.28, scx, sy + sh * 0.3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "dino": {
                // Boklyfta klor ur ground
                ctx.save();
                ctx.fillStyle = "#efe3c0";
                ctx.strokeStyle = "#2a1c08";
                ctx.lineWidth = 1.6;
                for (const [ox, hh] of [
                    [0.22, 0.65],
                    [0.52, 1],
                    [0.82, 0.55],
                ]) {
                    const bx = sx + sw * ox;
                    ctx.beginPath();
                    ctx.moveTo(bx - 5, sgy);
                    ctx.quadraticCurveTo(bx - 5, sgy - sh * hh * 0.6, bx - 9, sgy - sh * hh);
                    ctx.quadraticCurveTo(bx + 5, sgy - sh * hh * 0.55, bx + 5, sgy);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "autumn": {
                // Taggig gren med sista hostlovet
                ctx.save();
                ctx.lineCap = "round";
                ctx.strokeStyle = "#ffd9a0";
                ctx.lineWidth = 6.5;
                ctx.beginPath();
                ctx.moveTo(scx - 4, sgy);
                ctx.quadraticCurveTo(scx - 9, sgy - sh * 0.6, scx + 2, sy + 5);
                ctx.stroke();
                ctx.strokeStyle = "#3a2410";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(scx - 4, sgy);
                ctx.quadraticCurveTo(scx - 9, sgy - sh * 0.6, scx + 2, sy + 5);
                ctx.stroke();
                ctx.lineWidth = 2.2;
                ctx.beginPath();
                ctx.moveTo(scx - 6, sgy - sh * 0.32);
                ctx.lineTo(scx - 14, sgy - sh * 0.42);
                ctx.moveTo(scx - 6, sgy - sh * 0.58);
                ctx.lineTo(scx + 2, sgy - sh * 0.7);
                ctx.moveTo(scx - 3, sgy - sh * 0.78);
                ctx.lineTo(scx - 11, sgy - sh * 0.9);
                ctx.stroke();
                ctx.fillStyle = "#e0662f";
                ctx.strokeStyle = "#5a1f08";
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.ellipse(scx + 6, sy + 6, 6, 3.5, -0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "savanna": {
                // Termitstack med bohal
                ctx.save();
                ctx.fillStyle = "#6a3f16";
                ctx.strokeStyle = "#241102";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(sx, sgy);
                ctx.quadraticCurveTo(sx + sw * 0.15, sgy - sh * 0.5, scx - 4, sy + 3);
                ctx.quadraticCurveTo(scx + 1, sy, scx + 4, sy + 6);
                ctx.quadraticCurveTo(sx + sw * 0.85, sgy - sh * 0.5, sx + sw, sgy);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "rgba(30,12,0,0.85)";
                ctx.beginPath();
                ctx.ellipse(scx - 3, sgy - sh * 0.32, 3, 4.2, 0, 0, Math.PI * 2);
                ctx.ellipse(scx + 4, sgy - sh * 0.58, 2.2, 3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "bog": {
                // Trasktentakel som stracker sig upp
                ctx.save();
                ctx.lineCap = "round";
                ctx.strokeStyle = "#aad96a";
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(scx - 6, sgy);
                ctx.quadraticCurveTo(scx - 11, sgy - sh * 0.7, scx + 8, sy + 5);
                ctx.stroke();
                ctx.strokeStyle = "#2a3a14";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(scx - 6, sgy);
                ctx.quadraticCurveTo(scx - 11, sgy - sh * 0.7, scx + 8, sy + 5);
                ctx.stroke();
                ctx.shadowColor = "rgba(170,255,140,0.9)";
                ctx.shadowBlur = 8;
                ctx.fillStyle = "#c9ff8a";
                ctx.beginPath();
                ctx.arc(scx + 8, sy + 5, 2.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "bamboo": {
                // Vassa bambupalar
                ctx.save();
                ctx.fillStyle = "#a9d96a";
                ctx.strokeStyle = "#16260a";
                ctx.lineWidth = 1.5;
                for (const [ox, hh] of [
                    [0.22, 0.68],
                    [0.52, 1],
                    [0.82, 0.58],
                ]) {
                    const bx = sx + sw * ox;
                    const top = sgy - sh * hh;
                    ctx.fillRect(bx - 3.2, top + 7, 6.4, sgy - top - 7);
                    ctx.strokeRect(bx - 3.2, top + 7, 6.4, sgy - top - 7);
                    ctx.beginPath();
                    ctx.moveTo(bx - 3.2, top + 8);
                    ctx.lineTo(bx + 3.2, top);
                    ctx.lineTo(bx + 3.2, top + 8);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(bx - 3.2, sgy - 9);
                    ctx.lineTo(bx + 3.2, sgy - 9);
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "reef": {
                // Brandkorall med vita brannspetsar
                ctx.save();
                ctx.strokeStyle = "#ff4f7e";
                ctx.lineWidth = 4.5;
                ctx.lineCap = "round";
                ctx.shadowColor = "rgba(120,10,40,0.6)";
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.moveTo(scx, sgy);
                ctx.lineTo(scx, sgy - sh * 0.4);
                ctx.moveTo(scx, sgy - sh * 0.4);
                ctx.lineTo(scx - 8, sgy - sh * 0.78);
                ctx.moveTo(scx, sgy - sh * 0.4);
                ctx.lineTo(scx + 9, sgy - sh * 0.72);
                ctx.moveTo(scx - 8, sgy - sh * 0.78);
                ctx.lineTo(scx - 13, sy + 3);
                ctx.moveTo(scx - 8, sgy - sh * 0.78);
                ctx.lineTo(scx - 1, sy);
                ctx.moveTo(scx + 9, sgy - sh * 0.72);
                ctx.lineTo(scx + 14, sy + 7);
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#ffffff";
                for (const [px, py] of [
                    [-13, 3],
                    [-1, 0],
                    [14, 7],
                ]) {
                    ctx.beginPath();
                    ctx.arc(scx + px, sy + py, 2.4, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
                break;
            }
            case "steppe": {
                // Mammutbetar ur ground
                ctx.save();
                ctx.fillStyle = "#f0e8d0";
                ctx.strokeStyle = "#3a3226";
                ctx.lineWidth = 1.6;
                for (const s of [-1, 1]) {
                    ctx.beginPath();
                    ctx.moveTo(scx + s * 2, sgy);
                    ctx.quadraticCurveTo(scx + s * sw * 0.55, sgy - sh * 0.45, scx + s * sw * 0.26, sy + 3);
                    ctx.quadraticCurveTo(scx + s * sw * 0.6, sgy - sh * 0.52, scx + s * 11, sgy);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "canopy": {
                // Taggig slingervaxt
                ctx.save();
                ctx.lineCap = "round";
                ctx.strokeStyle = "#cdeaa0";
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.moveTo(scx - 8, sgy);
                ctx.quadraticCurveTo(scx - 13, sgy - sh * 0.55, scx + 4, sy + 3);
                ctx.stroke();
                ctx.strokeStyle = "#1f3a10";
                ctx.lineWidth = 4.2;
                ctx.beginPath();
                ctx.moveTo(scx - 8, sgy);
                ctx.quadraticCurveTo(scx - 13, sgy - sh * 0.55, scx + 4, sy + 3);
                ctx.stroke();
                ctx.strokeStyle = "#cdeaa0";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(scx - 10, sgy - sh * 0.3);
                ctx.lineTo(scx - 17, sgy - sh * 0.38);
                ctx.moveTo(scx - 9, sgy - sh * 0.55);
                ctx.lineTo(scx - 2, sgy - sh * 0.66);
                ctx.moveTo(scx - 4, sgy - sh * 0.78);
                ctx.lineTo(scx - 11, sgy - sh * 0.88);
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "saltflat": {
                // Vassa saltkristaller med tydlig kontur
                ctx.save();
                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#44545e";
                ctx.lineWidth = 2;
                for (const [ox, hh, tilt] of [
                    [0.24, 0.6, -0.16],
                    [0.54, 1, 0.04],
                    [0.82, 0.5, 0.2],
                ]) {
                    const len = sh * hh;
                    ctx.save();
                    ctx.translate(sx + sw * ox, sgy);
                    ctx.rotate(tilt);
                    ctx.beginPath();
                    ctx.moveTo(-5, 0);
                    ctx.lineTo(-4, -len * 0.72);
                    ctx.lineTo(0, -len);
                    ctx.lineTo(4, -len * 0.72);
                    ctx.lineTo(5, 0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.strokeStyle = "rgba(120,140,150,0.5)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(0, -len);
                    ctx.lineTo(-1, 0);
                    ctx.stroke();
                    ctx.restore();
                    ctx.strokeStyle = "#44545e";
                    ctx.lineWidth = 2;
                }
                ctx.restore();
                break;
            }
            case "mangrove": {
                // Bagformade rotter som griper ur dyn
                ctx.save();
                ctx.lineCap = "round";
                for (const [x1, cxo, x2, hh] of [
                    [0.1, 0.25, 0.55, 1],
                    [0.5, 0.72, 0.95, 0.62],
                ]) {
                    ctx.strokeStyle = "#cfe8c0";
                    ctx.lineWidth = 7;
                    ctx.beginPath();
                    ctx.moveTo(sx + sw * x1, sgy);
                    ctx.quadraticCurveTo(sx + sw * cxo, sgy - sh * hh * 1.4, sx + sw * x2, sgy);
                    ctx.stroke();
                    ctx.strokeStyle = "#4a3018";
                    ctx.lineWidth = 4.2;
                    ctx.beginPath();
                    ctx.moveTo(sx + sw * x1, sgy);
                    ctx.quadraticCurveTo(sx + sw * cxo, sgy - sh * hh * 1.4, sx + sw * x2, sgy);
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "troll": {
                // Troll club with studs
                ctx.save();
                ctx.strokeStyle = "#241a10";
                ctx.lineWidth = 6.5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(scx - 5, sgy);
                ctx.lineTo(scx + 2, sy + 12);
                ctx.stroke();
                ctx.strokeStyle = "#7a5a38";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(scx - 5, sgy);
                ctx.lineTo(scx + 2, sy + 12);
                ctx.stroke();
                ctx.fillStyle = "#8a929a";
                ctx.strokeStyle = "#14181c";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.ellipse(scx + 3, sy + 11, 9.5, 12, 0.15, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "#e0dac8";
                for (const a of [-2.4, -1.7, -1.0, -0.3]) {
                    const px = scx + 3 + Math.cos(a) * 10;
                    const py = sy + 11 + Math.sin(a) * 12.5;
                    ctx.beginPath();
                    ctx.arc(px, py, 2.2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
                break;
            }
            case "atlantis": {
                // Glodande treudd
                ctx.save();
                ctx.shadowColor = "rgba(125,232,255,0.85)";
                ctx.shadowBlur = 9;
                ctx.strokeStyle = "#7de8ff";
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(scx, sgy);
                ctx.lineTo(scx, sy + 8);
                ctx.moveTo(scx - 9, sy + 15);
                ctx.lineTo(scx - 9, sy + 3);
                ctx.moveTo(scx + 9, sy + 15);
                ctx.lineTo(scx + 9, sy + 3);
                ctx.moveTo(scx, sy + 8);
                ctx.lineTo(scx, sy);
                ctx.moveTo(scx - 9, sy + 15);
                ctx.quadraticCurveTo(scx, sy + 21, scx + 9, sy + 15);
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "witch": {
                // Bubblande haxkittel
                ctx.save();
                ctx.strokeStyle = "#0a060c";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(scx - 8, sgy);
                ctx.lineTo(scx - 11, sgy - sh * 0.14);
                ctx.moveTo(scx + 8, sgy);
                ctx.lineTo(scx + 11, sgy - sh * 0.14);
                ctx.stroke();
                ctx.fillStyle = "#120c16";
                ctx.strokeStyle = "#b06ad9";
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.arc(scx, sgy - sh * 0.45, sw * 0.44, 0, Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillRect(scx - sw * 0.5, sgy - sh * 0.5, sw, 4.5);
                ctx.strokeRect(scx - sw * 0.5, sgy - sh * 0.5, sw, 4.5);
                ctx.shadowColor = "rgba(140,230,90,0.9)";
                ctx.shadowBlur = 8;
                ctx.fillStyle = "#6ade4a";
                ctx.beginPath();
                ctx.ellipse(scx, sgy - sh * 0.5, sw * 0.4, 3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(scx - 6, sgy - sh * 0.66, 2.4, 0, Math.PI * 2);
                ctx.arc(scx + 5, sgy - sh * 0.76, 3, 0, Math.PI * 2);
                ctx.arc(scx - 1, sgy - sh * 0.92, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "giant": {
                // Halvt nedsjunket spikklot
                ctx.save();
                const gcy = sgy - sh * 0.4;
                const gr = sw * 0.4;
                ctx.fillStyle = "#e0dac8";
                ctx.strokeStyle = "#14100a";
                ctx.lineWidth = 1.6;
                for (let i = 0; i < 7; i++) {
                    const a = Math.PI + (Math.PI * i) / 6;
                    ctx.beginPath();
                    ctx.moveTo(scx + Math.cos(a - 0.2) * gr * 0.9, gcy + Math.sin(a - 0.2) * gr * 0.9);
                    ctx.lineTo(scx + Math.cos(a) * gr * 1.55, gcy + Math.sin(a) * gr * 1.55);
                    ctx.lineTo(scx + Math.cos(a + 0.2) * gr * 0.9, gcy + Math.sin(a + 0.2) * gr * 0.9);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.fillStyle = "#4a4440";
                ctx.beginPath();
                ctx.arc(scx, gcy, gr, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "moonbase": {
                // Parabolantenn pa stativ med varningslampa
                ctx.save();
                ctx.strokeStyle = "#1f262e";
                ctx.lineWidth = 2.8;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(sx + 6, sgy);
                ctx.lineTo(scx, sgy - sh * 0.42);
                ctx.moveTo(sx + sw - 6, sgy);
                ctx.lineTo(scx, sgy - sh * 0.42);
                ctx.moveTo(scx, sgy - sh * 0.42);
                ctx.lineTo(scx, sgy - sh * 0.6);
                ctx.stroke();
                ctx.save();
                ctx.translate(scx, sgy - sh * 0.68);
                ctx.rotate(-0.55);
                ctx.fillStyle = "#e4eaf2";
                ctx.strokeStyle = "#14181f";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.ellipse(0, 0, sw * 0.44, sh * 0.15, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.strokeStyle = "rgba(20,24,31,0.45)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(0, 0, sw * 0.26, sh * 0.08, 0, 0, Math.PI * 2);
                ctx.stroke();
                // Matararm ut till fokuspunkten
                ctx.strokeStyle = "#14181f";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -sh * 0.3);
                ctx.stroke();
                ctx.shadowColor = "rgba(255,80,80,0.95)";
                ctx.shadowBlur = 9;
                ctx.fillStyle = "#ff4a4a";
                ctx.beginPath();
                ctx.arc(0, -sh * 0.3, 2.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                ctx.restore();
                break;
            }
            case "mars": {
                // Rostroda klippskarvor med dammkant
                ctx.save();
                ctx.fillStyle = "#3a1005";
                ctx.strokeStyle = "#ffb894";
                ctx.lineWidth = 1.8;
                for (const [ox, hh] of [
                    [0.22, 0.6],
                    [0.52, 1],
                    [0.8, 0.5],
                ]) {
                    ctx.beginPath();
                    ctx.moveTo(sx + sw * (ox - 0.2), sgy);
                    ctx.lineTo(sx + sw * (ox - 0.04), sgy - sh * hh);
                    ctx.lineTo(sx + sw * (ox + 0.08), sgy - sh * hh * 0.75);
                    ctx.lineTo(sx + sw * (ox + 0.2), sgy);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "cyber": {
                // Glitchande hologrampylon
                ctx.save();
                ctx.shadowColor = "rgba(0,255,204,0.9)";
                ctx.shadowBlur = 10;
                ctx.fillStyle = "rgba(0,45,40,0.92)";
                ctx.strokeStyle = "#00ffcc";
                ctx.lineWidth = 1.6;
                for (const [f1, f2, off] of [
                    [0, 0.33, 3],
                    [0.36, 0.66, -4],
                    [0.69, 1, 2],
                ]) {
                    const y1 = sgy - sh * f1;
                    const y2 = sgy - sh * f2;
                    const w1 = sw * 0.5 * (1 - f1);
                    const w2 = sw * 0.5 * (1 - f2);
                    ctx.beginPath();
                    ctx.moveTo(scx - w1 + off, y1);
                    ctx.lineTo(scx + w1 + off, y1);
                    ctx.lineTo(scx + w2 + off, y2);
                    ctx.lineTo(scx - w2 + off, y2);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "time": {
                // Sprucken klocka pa fot
                ctx.save();
                const tcy = sy + sh * 0.34;
                const tr = sw * 0.42;
                ctx.fillStyle = "#241a08";
                ctx.fillRect(scx - 4, sgy - sh * 0.34, 8, sh * 0.34);
                ctx.fillStyle = "#ffe0a0";
                ctx.strokeStyle = "#241a08";
                ctx.lineWidth = 2.2;
                ctx.beginPath();
                ctx.arc(scx, tcy, tr, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(scx, tcy);
                ctx.lineTo(scx, tcy - tr * 0.68);
                ctx.moveTo(scx, tcy);
                ctx.lineTo(scx + tr * 0.52, tcy + tr * 0.2);
                ctx.stroke();
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.moveTo(scx - tr * 0.5, tcy - tr * 0.82);
                ctx.lineTo(scx - tr * 0.2, tcy - tr * 0.3);
                ctx.lineTo(scx - tr * 0.55, tcy - tr * 0.02);
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "ufo": {
                // Kraschad metallfena med glodande larm
                ctx.save();
                ctx.fillStyle = "#9aa4ae";
                ctx.strokeStyle = "#101c10";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(sx + 4, sgy);
                ctx.lineTo(scx - 3, sy + 3);
                ctx.lineTo(scx + 9, sy + 12);
                ctx.lineTo(sx + sw - 4, sgy);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.strokeStyle = "rgba(20,40,20,0.5)";
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(scx - 4, sgy - sh * 0.25);
                ctx.lineTo(scx + 7, sgy - sh * 0.3);
                ctx.stroke();
                ctx.shadowColor = "rgba(122,255,154,0.95)";
                ctx.shadowBlur = 9;
                ctx.fillStyle = "#7aff9a";
                ctx.beginPath();
                ctx.arc(scx + 1, sgy - sh * 0.55, 2.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "junk": {
                // Skrothog med utstickande ror
                ctx.save();
                ctx.strokeStyle = "#9aa2ae";
                ctx.lineWidth = 5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(scx + 2, sgy - sh * 0.4);
                ctx.lineTo(scx + 11, sy + 3);
                ctx.stroke();
                ctx.fillStyle = "#8a4a2a";
                ctx.strokeStyle = "#140a04";
                ctx.lineWidth = 1.8;
                ctx.save();
                ctx.translate(scx - 4, sgy - sh * 0.26);
                ctx.rotate(-0.12);
                ctx.fillRect(-12, -9, 24, 18);
                ctx.strokeRect(-12, -9, 24, 18);
                ctx.restore();
                ctx.fillStyle = "#b8beca";
                ctx.save();
                ctx.translate(scx + 4, sgy - sh * 0.5);
                ctx.rotate(0.2);
                ctx.fillRect(-9, -6, 18, 12);
                ctx.strokeRect(-9, -6, 18, 12);
                ctx.restore();
                ctx.fillStyle = "#e8b83a";
                ctx.beginPath();
                ctx.arc(scx - 8, sgy - sh * 0.55, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "whalegrave": {
                // Valrevben ur havsbotten
                ctx.save();
                ctx.lineCap = "round";
                for (const [x1, cxo, tx, hh, lw] of [
                    [0.15, 0.2, 0.75, 1, 5],
                    [0.6, 0.72, 1.0, 0.55, 4],
                ]) {
                    ctx.strokeStyle = "#20242a";
                    ctx.lineWidth = lw + 3;
                    ctx.beginPath();
                    ctx.moveTo(sx + sw * x1, sgy);
                    ctx.quadraticCurveTo(sx + sw * cxo, sgy - sh * hh, sx + sw * tx, sgy - sh * hh * 0.88);
                    ctx.stroke();
                    ctx.strokeStyle = "#e8e4d4";
                    ctx.lineWidth = lw;
                    ctx.beginPath();
                    ctx.moveTo(sx + sw * x1, sgy);
                    ctx.quadraticCurveTo(sx + sw * cxo, sgy - sh * hh, sx + sw * tx, sgy - sh * hh * 0.88);
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "mermaid": {
                // Taggig snacka
                ctx.save();
                ctx.fillStyle = "#ffb8e0";
                ctx.strokeStyle = "#6a1444";
                ctx.lineWidth = 1.8;
                const mcy = sgy - sh * 0.32;
                for (const a of [-2.6, -2.0, -1.4, -0.8]) {
                    ctx.beginPath();
                    ctx.moveTo(scx + Math.cos(a - 0.22) * sw * 0.36, mcy + Math.sin(a - 0.22) * sw * 0.36);
                    ctx.lineTo(scx + Math.cos(a) * sw * 0.62, mcy + Math.sin(a) * sh * 0.55);
                    ctx.lineTo(scx + Math.cos(a + 0.22) * sw * 0.36, mcy + Math.sin(a + 0.22) * sw * 0.36);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(scx, mcy, sw * 0.38, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.arc(scx, mcy, sw * 0.24, 0.4, Math.PI * 1.6);
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "sakura": {
                // Vass gren med korsbarsblommor
                ctx.save();
                ctx.lineCap = "round";
                ctx.strokeStyle = "#ffd0e0";
                ctx.lineWidth = 6.5;
                ctx.beginPath();
                ctx.moveTo(scx - 3, sgy);
                ctx.quadraticCurveTo(scx - 8, sgy - sh * 0.55, scx + 3, sy + 4);
                ctx.stroke();
                ctx.strokeStyle = "#2a1418";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(scx - 3, sgy);
                ctx.quadraticCurveTo(scx - 8, sgy - sh * 0.55, scx + 3, sy + 4);
                ctx.stroke();
                ctx.lineWidth = 2.4;
                ctx.beginPath();
                ctx.moveTo(scx - 5, sgy - sh * 0.45);
                ctx.lineTo(scx - 13, sgy - sh * 0.56);
                ctx.stroke();
                for (const [bxp, byp] of [
                    [scx + 3, sy + 4],
                    [scx - 13, sgy - sh * 0.56],
                ]) {
                    ctx.fillStyle = "#ff9ec0";
                    for (let p = 0; p < 5; p++) {
                        const a = (Math.PI * 2 * p) / 5 - Math.PI / 2;
                        ctx.beginPath();
                        ctx.arc(bxp + Math.cos(a) * 3.4, byp + Math.sin(a) * 3.4, 2.6, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.fillStyle = "#fff0f5";
                    ctx.beginPath();
                    ctx.arc(bxp, byp, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
                break;
            }
            case "medieval": {
                // Nedstucket svard
                ctx.save();
                ctx.fillStyle = "#d5dde4";
                ctx.strokeStyle = "#1a2028";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(scx - 3.5, sgy - 7);
                ctx.lineTo(scx - 3.5, sy + 13);
                ctx.lineTo(scx, sy);
                ctx.lineTo(scx + 3.5, sy + 13);
                ctx.lineTo(scx + 3.5, sgy - 7);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "#e8b83a";
                ctx.fillRect(scx - 9, sgy - 9, 18, 4.5);
                ctx.strokeRect(scx - 9, sgy - 9, 18, 4.5);
                ctx.fillRect(scx - 2.5, sgy - 4.5, 5, 4.5);
                ctx.strokeRect(scx - 2.5, sgy - 4.5, 5, 4.5);
                ctx.restore();
                break;
            }
            case "aztec": {
                // Trappstensspets med gyllene orm-oga
                ctx.save();
                ctx.fillStyle = "#8a936a";
                ctx.strokeStyle = "#101c08";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(sx + 1, sgy);
                ctx.lineTo(sx + 1, sgy - sh * 0.34);
                ctx.lineTo(sx + sw * 0.22, sgy - sh * 0.34);
                ctx.lineTo(sx + sw * 0.22, sgy - sh * 0.67);
                ctx.lineTo(sx + sw * 0.42, sgy - sh * 0.67);
                ctx.lineTo(scx, sy);
                ctx.lineTo(sx + sw * 0.58, sgy - sh * 0.67);
                ctx.lineTo(sx + sw * 0.78, sgy - sh * 0.67);
                ctx.lineTo(sx + sw * 0.78, sgy - sh * 0.34);
                ctx.lineTo(sx + sw - 1, sgy - sh * 0.34);
                ctx.lineTo(sx + sw - 1, sgy);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.shadowColor = "rgba(255,216,90,0.9)";
                ctx.shadowBlur = 7;
                ctx.fillStyle = "#ffd85a";
                ctx.beginPath();
                ctx.arc(scx, sgy - sh * 0.45, 3.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "westtown": {
                // Dynamitknippe med brinnande stubin
                ctx.save();
                ctx.fillStyle = "#b8231a";
                ctx.strokeStyle = "#3a0802";
                ctx.lineWidth = 1.5;
                for (const ox of [-9, 0, 9]) {
                    const hh = ox === 0 ? sh * 0.72 : sh * 0.58;
                    ctx.fillRect(scx + ox - 4.5, sgy - hh, 9, hh);
                    ctx.strokeRect(scx + ox - 4.5, sgy - hh, 9, hh);
                }
                ctx.fillStyle = "#f0e8d0";
                ctx.fillRect(scx - 14, sgy - sh * 0.4, 28, 4.5);
                ctx.strokeRect(scx - 14, sgy - sh * 0.4, 28, 4.5);
                ctx.strokeStyle = "#241404";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(scx, sgy - sh * 0.72);
                ctx.quadraticCurveTo(scx + 6, sy + 3, scx + 10, sy + 6);
                ctx.stroke();
                ctx.shadowColor = "rgba(255,220,100,0.95)";
                ctx.shadowBlur = 9;
                ctx.fillStyle = "#ffe066";
                drawStarShape(ctx, scx + 11, sy + 5, 4, 1.8);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "citynight": {
                // Trafikkon med reflexband
                ctx.save();
                ctx.fillStyle = "#ff7a2a";
                ctx.strokeStyle = "#0a0a10";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(scx - 4, sy + 5);
                ctx.lineTo(scx + 4, sy + 5);
                ctx.lineTo(scx + 12, sgy - 4);
                ctx.lineTo(scx - 12, sgy - 4);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillRect(scx - 15, sgy - 4.5, 30, 4.5);
                ctx.strokeRect(scx - 15, sgy - 4.5, 30, 4.5);
                ctx.fillStyle = "#f5f0e6";
                ctx.beginPath();
                ctx.moveTo(scx - 7, sgy - sh * 0.45);
                ctx.lineTo(scx + 7, sgy - sh * 0.45);
                ctx.lineTo(scx + 8.5, sgy - sh * 0.3);
                ctx.lineTo(scx - 8.5, sgy - sh * 0.3);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;
            }
            case "carnival": {
                // Spiky piñata star on a stick
                ctx.save();
                ctx.strokeStyle = "#f0e8d0";
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(scx, sgy);
                ctx.lineTo(scx, sgy - sh * 0.4);
                ctx.stroke();
                ctx.fillStyle = "#ff5ac0";
                ctx.strokeStyle = "#ffe066";
                ctx.lineWidth = 2.2;
                drawStarShape(ctx, scx, sy + sh * 0.34, sw * 0.52, sw * 0.22);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(scx, sy + sh * 0.34, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "circus": {
                // Jonglorkagla
                ctx.save();
                ctx.fillStyle = "#fff4e0";
                ctx.strokeStyle = "#2a0a10";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(scx - 4, sy);
                ctx.quadraticCurveTo(scx - 6, sy + sh * 0.3, scx - 11, sgy - sh * 0.3);
                ctx.quadraticCurveTo(scx - 13, sgy, scx - 8, sgy);
                ctx.lineTo(scx + 8, sgy);
                ctx.quadraticCurveTo(scx + 13, sgy, scx + 11, sgy - sh * 0.3);
                ctx.quadraticCurveTo(scx + 6, sy + sh * 0.3, scx + 4, sy);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "#e02f4a";
                ctx.fillRect(scx - 6, sy + sh * 0.24, 12, 5);
                ctx.fillRect(scx - 11, sgy - sh * 0.24, 22, 5);
                ctx.beginPath();
                ctx.arc(scx, sy + 2, 3.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "library": {
                // Lutande bokstapel
                ctx.save();
                ctx.strokeStyle = "#140c02";
                ctx.lineWidth = 1.6;
                const books = [
                    [0, "#a03030", sh * 0.26, -0.04],
                    [1, "#3a5a8a", sh * 0.24, 0.06],
                    [2, "#4a7a3a", sh * 0.22, -0.08],
                ];
                let by = sgy;
                for (const [, col, bh, rot] of books) {
                    by -= bh;
                    ctx.save();
                    ctx.translate(scx, by + bh / 2);
                    ctx.rotate(rot);
                    ctx.fillStyle = col;
                    ctx.fillRect(-sw * 0.48, -bh / 2, sw * 0.96, bh);
                    ctx.strokeRect(-sw * 0.48, -bh / 2, sw * 0.96, bh);
                    ctx.fillStyle = "#f0e8d0";
                    ctx.fillRect(sw * 0.3, -bh / 2 + 2, sw * 0.16, bh - 4);
                    ctx.restore();
                }
                ctx.fillStyle = "#f0e8d0";
                ctx.strokeStyle = "#140c02";
                ctx.beginPath();
                ctx.moveTo(scx - 3, by);
                ctx.lineTo(scx - 6, sy);
                ctx.lineTo(scx + 2, sy + 4);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "toyroom": {
                // Trampfarlig leksaks-jack
                ctx.save();
                const jcy = sgy - sh * 0.34;
                const jl = sw * 0.4;
                ctx.strokeStyle = "#2a2e36";
                ctx.lineWidth = 6;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(scx - jl, jcy + jl * 0.6);
                ctx.lineTo(scx + jl, jcy - jl * 0.6);
                ctx.moveTo(scx + jl, jcy + jl * 0.6);
                ctx.lineTo(scx - jl, jcy - jl * 0.6);
                ctx.moveTo(scx, jcy + jl * 0.8);
                ctx.lineTo(scx, jcy - jl * 1.2);
                ctx.stroke();
                ctx.strokeStyle = "#8a92a0";
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.moveTo(scx - jl, jcy + jl * 0.6);
                ctx.lineTo(scx + jl, jcy - jl * 0.6);
                ctx.moveTo(scx + jl, jcy + jl * 0.6);
                ctx.lineTo(scx - jl, jcy - jl * 0.6);
                ctx.moveTo(scx, jcy + jl * 0.8);
                ctx.lineTo(scx, jcy - jl * 1.2);
                ctx.stroke();
                ctx.fillStyle = "#e0325c";
                ctx.strokeStyle = "#2a2e36";
                ctx.lineWidth = 1.4;
                for (const [px, py] of [
                    [-jl, jl * 0.6],
                    [jl, -jl * 0.6],
                    [jl, jl * 0.6],
                    [-jl, -jl * 0.6],
                    [0, jl * 0.8],
                    [0, -jl * 1.2],
                ]) {
                    ctx.beginPath();
                    ctx.arc(scx + px, jcy + py, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "storm": {
                // Askledarstang med laddad topp
                ctx.save();
                ctx.strokeStyle = "#aab4c0";
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(scx, sgy);
                ctx.lineTo(scx, sy + 10);
                ctx.moveTo(scx - 8, sgy);
                ctx.lineTo(scx, sgy - sh * 0.3);
                ctx.moveTo(scx + 8, sgy);
                ctx.lineTo(scx, sgy - sh * 0.3);
                ctx.stroke();
                ctx.shadowColor = "rgba(255,220,90,0.95)";
                ctx.shadowBlur = 10;
                ctx.fillStyle = "#ffd23a";
                ctx.beginPath();
                ctx.moveTo(scx - 2, sy + 12);
                ctx.lineTo(scx + 5, sy + 4);
                ctx.lineTo(scx + 1, sy + 4);
                ctx.lineTo(scx + 4, sy - 2);
                ctx.lineTo(scx - 5, sy + 6);
                ctx.lineTo(scx - 1, sy + 6);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;
            }
            case "tornado": {
                // Liten virvelvind med planka
                ctx.save();
                ctx.fillStyle = "rgba(232,224,176,0.9)";
                ctx.strokeStyle = "#241f08";
                ctx.lineWidth = 1.6;
                for (let i = 0; i < 4; i++) {
                    const fy = sy + sh * (0.12 + i * 0.24);
                    const fw = sw * (0.52 - i * 0.11);
                    const off = (i % 2 === 0 ? 1 : -1) * 2.5;
                    ctx.beginPath();
                    ctx.ellipse(scx + off, fy, fw, sh * 0.1, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.fillStyle = "#6a4a20";
                ctx.save();
                ctx.translate(scx + sw * 0.34, sy + sh * 0.2);
                ctx.rotate(0.6);
                ctx.fillRect(-7, -2.2, 14, 4.4);
                ctx.strokeRect(-7, -2.2, 14, 4.4);
                ctx.restore();
                ctx.restore();
                break;
            }
            case "fog": {
                // Ghost stone with a wisp of mist
                ctx.save();
                ctx.fillStyle = "#242e2a";
                ctx.strokeStyle = "#e0e8e8";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(sx + 5, sgy);
                ctx.lineTo(sx + 3, sgy - sh * 0.55);
                ctx.quadraticCurveTo(sx + 4, sy + 2, scx, sy);
                ctx.quadraticCurveTo(sx + sw - 4, sy + 2, sx + sw - 3, sgy - sh * 0.55);
                ctx.lineTo(sx + sw - 5, sgy);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "#c9d9d4";
                ctx.beginPath();
                ctx.arc(scx - 4, sgy - sh * 0.62, 2, 0, Math.PI * 2);
                ctx.arc(scx + 4, sgy - sh * 0.62, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "rgba(230,240,240,0.8)";
                ctx.lineWidth = 3.5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(sx - 3, sgy - sh * 0.32);
                ctx.quadraticCurveTo(scx, sgy - sh * 0.2, sx + sw + 3, sgy - sh * 0.36);
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "pizzeria": {
                // Pizzaskarare pa hogkant
                ctx.save();
                const pcy = sgy - sh * 0.4;
                const pr = sw * 0.42;
                ctx.strokeStyle = "#3a1408";
                ctx.lineWidth = 6;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(scx + pr * 0.5, pcy - pr * 0.5);
                ctx.lineTo(scx + sw * 0.55, sy);
                ctx.stroke();
                ctx.strokeStyle = "#7a4a20";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(scx + pr * 0.5, pcy - pr * 0.5);
                ctx.lineTo(scx + sw * 0.55, sy);
                ctx.stroke();
                ctx.fillStyle = "#e0e6ee";
                ctx.strokeStyle = "#28160a";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.arc(scx - 2, pcy, pr, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "#28160a";
                ctx.beginPath();
                ctx.arc(scx - 2, pcy, 2.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "orchard": {
                // Argt getingbo
                ctx.save();
                ctx.fillStyle = "#e0b86a";
                ctx.strokeStyle = "#3a2205";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.ellipse(scx, sgy - sh * 0.3, sw * 0.42, sh * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.strokeStyle = "#6a4210";
                ctx.lineWidth = 2.2;
                for (const fy of [0.18, 0.32, 0.46]) {
                    ctx.beginPath();
                    ctx.moveTo(scx - sw * 0.38, sgy - sh * fy);
                    ctx.quadraticCurveTo(scx, sgy - sh * (fy - 0.06), scx + sw * 0.38, sgy - sh * fy);
                    ctx.stroke();
                }
                ctx.fillStyle = "#140c02";
                ctx.beginPath();
                ctx.ellipse(scx, sgy - sh * 0.26, 3.5, 4.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#ffd23a";
                ctx.strokeStyle = "#140c02";
                ctx.lineWidth = 1;
                for (const [wx, wy] of [
                    [-sw * 0.42, -sh * 0.75],
                    [sw * 0.3, -sh * 0.95],
                ]) {
                    ctx.beginPath();
                    ctx.ellipse(scx + wx, sgy + wy, 3, 2, 0.4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "icecream": {
                // Tappad strut, spetsen uppat
                ctx.save();
                ctx.fillStyle = "#ff8ab8";
                ctx.strokeStyle = "#5a2038";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.ellipse(scx, sgy - 6, sw * 0.46, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "#d9a05a";
                ctx.strokeStyle = "#3a2008";
                ctx.beginPath();
                ctx.moveTo(scx - sw * 0.34, sgy - 9);
                ctx.lineTo(scx, sy);
                ctx.lineTo(scx + sw * 0.34, sgy - 9);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.strokeStyle = "rgba(60,32,8,0.55)";
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(scx - sw * 0.2, sgy - sh * 0.3);
                ctx.lineTo(scx + sw * 0.05, sy + sh * 0.24);
                ctx.moveTo(scx + sw * 0.2, sgy - sh * 0.3);
                ctx.lineTo(scx - sw * 0.05, sy + sh * 0.24);
                ctx.moveTo(scx - sw * 0.12, sgy - sh * 0.52);
                ctx.lineTo(scx + sw * 0.12, sgy - sh * 0.52);
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "spring": {
                // Tornig ros
                ctx.save();
                ctx.lineCap = "round";
                ctx.strokeStyle = "#eaffea";
                ctx.lineWidth = 5.5;
                ctx.beginPath();
                ctx.moveTo(scx - 2, sgy);
                ctx.quadraticCurveTo(scx - 6, sgy - sh * 0.5, scx + 1, sy + 10);
                ctx.stroke();
                ctx.strokeStyle = "#1a3a10";
                ctx.lineWidth = 3.2;
                ctx.beginPath();
                ctx.moveTo(scx - 2, sgy);
                ctx.quadraticCurveTo(scx - 6, sgy - sh * 0.5, scx + 1, sy + 10);
                ctx.stroke();
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(scx - 4, sgy - sh * 0.32);
                ctx.lineTo(scx - 10, sgy - sh * 0.4);
                ctx.moveTo(scx - 4, sgy - sh * 0.58);
                ctx.lineTo(scx + 3, sgy - sh * 0.68);
                ctx.stroke();
                ctx.fillStyle = "#e02f4a";
                ctx.strokeStyle = "#5a0a18";
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.arc(scx + 1, sy + 7, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.strokeStyle = "#ff7a94";
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.arc(scx + 1, sy + 7, 4, 0.4, Math.PI * 1.7);
                ctx.arc(scx + 1, sy + 7, 1.8, Math.PI * 1.7, Math.PI * 3.2);
                ctx.stroke();
                ctx.restore();
                break;
            }
            case "beach": {
                // Argsint krabba
                ctx.save();
                ctx.fillStyle = "#e0483a";
                ctx.strokeStyle = "#4a0c04";
                ctx.lineWidth = 1.8;
                ctx.lineCap = "round";
                // ben
                ctx.lineWidth = 2.4;
                ctx.strokeStyle = "#4a0c04";
                for (const s of [-1, 1]) {
                    for (const [dx, dy] of [
                        [0.3, 0.12],
                        [0.38, 0.02],
                    ]) {
                        ctx.beginPath();
                        ctx.moveTo(scx + s * sw * 0.2, sgy - sh * 0.28);
                        ctx.lineTo(scx + s * sw * (dx + 0.16), sgy - sh * dy);
                        ctx.stroke();
                    }
                }
                // kropp
                ctx.strokeStyle = "#4a0c04";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.ellipse(scx, sgy - sh * 0.3, sw * 0.36, sh * 0.22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                // klor hojda
                for (const s of [-1, 1]) {
                    ctx.beginPath();
                    ctx.moveTo(scx + s * sw * 0.44, sgy - sh * 0.66);
                    ctx.arc(scx + s * sw * 0.44, sgy - sh * 0.66, 6.5, s * 0.5, s * 0.5 + Math.PI * 1.5, s < 0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(scx + s * sw * 0.3, sgy - sh * 0.44);
                    ctx.lineTo(scx + s * sw * 0.42, sgy - sh * 0.56);
                    ctx.stroke();
                }
                // ogon pa skaft
                ctx.beginPath();
                ctx.moveTo(scx - 4, sgy - sh * 0.48);
                ctx.lineTo(scx - 5, sgy - sh * 0.62);
                ctx.moveTo(scx + 4, sgy - sh * 0.48);
                ctx.lineTo(scx + 5, sgy - sh * 0.62);
                ctx.stroke();
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(scx - 5, sgy - sh * 0.66, 2.6, 0, Math.PI * 2);
                ctx.arc(scx + 5, sgy - sh * 0.66, 2.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#140404";
                ctx.beginPath();
                ctx.arc(scx - 5, sgy - sh * 0.66, 1.2, 0, Math.PI * 2);
                ctx.arc(scx + 5, sgy - sh * 0.66, 1.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "newyear": {
                // Raket redo att smalla av
                ctx.save();
                ctx.strokeStyle = "#c9b088";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(scx + 6, sgy);
                ctx.lineTo(scx + 6, sgy - sh * 0.5);
                ctx.stroke();
                ctx.fillStyle = "#e03a4a";
                ctx.strokeStyle = "#ffe0a0";
                ctx.lineWidth = 1.6;
                ctx.fillRect(scx - 6, sy + 10, 12, sh * 0.55);
                ctx.strokeRect(scx - 6, sy + 10, 12, sh * 0.55);
                ctx.fillStyle = "#ffd23a";
                ctx.beginPath();
                ctx.moveTo(scx - 6, sy + 10);
                ctx.lineTo(scx, sy);
                ctx.lineTo(scx + 6, sy + 10);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.strokeStyle = "#c9b088";
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(scx, sy + 10 + sh * 0.55);
                ctx.quadraticCurveTo(scx - 6, sgy - 4, scx - 10, sgy - 2);
                ctx.stroke();
                ctx.shadowColor = "rgba(255,220,100,0.95)";
                ctx.shadowBlur = 9;
                ctx.fillStyle = "#ffe066";
                drawStarShape(ctx, scx - 11, sgy - 2, 3.5, 1.5);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "artgallery": {
                // Vass skulptur pa piedestal
                ctx.save();
                ctx.fillStyle = "#fafaf5";
                ctx.strokeStyle = "#1a1a1a";
                ctx.lineWidth = 1.8;
                ctx.fillRect(sx + 3, sgy - sh * 0.22, sw - 6, sh * 0.22);
                ctx.strokeRect(sx + 3, sgy - sh * 0.22, sw - 6, sh * 0.22);
                ctx.fillStyle = "#141414";
                ctx.beginPath();
                ctx.moveTo(sx + 6, sgy - sh * 0.22);
                ctx.lineTo(sx + sw * 0.3, sy + sh * 0.3);
                ctx.lineTo(scx, sgy - sh * 0.5);
                ctx.lineTo(sx + sw * 0.7, sy);
                ctx.lineTo(sx + sw - 6, sgy - sh * 0.22);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "#e02f4a";
                ctx.beginPath();
                ctx.arc(sx + sw * 0.7, sy + 4, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "disco": {
                // Krossade spegelskarvor
                ctx.save();
                ctx.fillStyle = "#d8dee8";
                ctx.strokeStyle = "#0a0a14";
                ctx.lineWidth = 1.6;
                ctx.shadowColor = "rgba(255,255,255,0.5)";
                ctx.shadowBlur = 6;
                for (const [ox, hh, tilt] of [
                    [0.22, 0.62, -0.18],
                    [0.52, 1, 0.05],
                    [0.8, 0.5, 0.22],
                ]) {
                    const len = sh * hh;
                    ctx.save();
                    ctx.translate(sx + sw * ox, sgy);
                    ctx.rotate(tilt);
                    ctx.beginPath();
                    ctx.moveTo(-5, 0);
                    ctx.lineTo(-2, -len);
                    ctx.lineTo(3, -len * 0.8);
                    ctx.lineTo(5, 0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                }
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#ff5ac0";
                ctx.beginPath();
                ctx.arc(sx + sw * 0.4, sgy - sh * 0.55, 1.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#5ae0ff";
                ctx.beginPath();
                ctx.arc(sx + sw * 0.62, sgy - sh * 0.75, 1.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            }
            case "shadow": {
                // Skugghand som griper ur ground
                ctx.save();
                ctx.lineCap = "round";
                const fingers = [
                    [-0.5, 0.42],
                    [-0.25, 0.62],
                    [0, 0.8],
                    [0.25, 0.58],
                    [0.5, 0.38],
                ];
                // vit kontur forst, svart ovanpa
                for (const [col, lw] of [
                    ["#ffffff", 6.5],
                    ["#000000", 3.5],
                ]) {
                    ctx.strokeStyle = col;
                    ctx.lineWidth = lw;
                    ctx.beginPath();
                    for (const [fo, fl] of fingers) {
                        ctx.moveTo(scx + fo * sw * 0.55, sgy - sh * 0.18);
                        ctx.lineTo(scx + fo * sw * 0.9, sgy - sh * (0.18 + fl));
                    }
                    ctx.stroke();
                }
                ctx.fillStyle = "#000000";
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.ellipse(scx, sgy - sh * 0.12, sw * 0.36, sh * 0.16, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                break;
            }
            default:
                ctx.beginPath();
                ctx.moveTo(obs.x, obs.y + obs.h);
                ctx.lineTo(obs.x + obs.w / 2, obs.y);
                ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
                ctx.closePath();
                ctx.fill();
                if (theme.spikeStroke) {
                    ctx.strokeStyle = theme.spikeStroke;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
        }
    }
}
