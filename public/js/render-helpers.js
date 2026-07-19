"use strict";
import { Minimotor } from "minimotor";
import { GROUND_Y, viewW, viewH, DPR, ambientParticles } from "./stage.js";
import { game } from "./state.js";
export function drawGround(ctx, theme) {
    // Kontrastband: mork gradient som tonar in mot marknivan, ritad OVER
    // sceneriet men UNDER obstacle/coins/player (de ritas efter drawGround).
    // Gor att spelobjekten syns tydligt aven i ljusa themes som Saltoknen.
    const bandH = 180;
    const band = ctx.createLinearGradient(0, GROUND_Y - bandH, 0, GROUND_Y);
    band.addColorStop(0, "rgba(0,0,0,0)");
    band.addColorStop(1, "rgba(0,0,0,0.32)");
    ctx.fillStyle = band;
    ctx.fillRect(0, GROUND_Y - bandH, viewW, bandH);
    // Ground (stone/sand/ice depending on theme)
    ctx.fillStyle = theme.groundColor;
    ctx.fillRect(0, GROUND_Y, viewW, viewH - GROUND_Y);
    // Texture in ground, scrolls with the game for a sense of speed
    ctx.fillStyle = theme.crackColor;
    const stripeWidth = 46;
    const offset = Math.floor(game.distance) % stripeWidth;
    for (let x = -offset; x < viewW; x += stripeWidth) {
        ctx.fillRect(x, GROUND_Y + 14, stripeWidth * 0.4, viewH - GROUND_Y - 14);
    }
    // Glowing "hazard strip" right below ground - purely visual, doesn't affect gameplay.
    // Lava, bioluminescent reef, golden nectar, cracking ice or alien energy depending on theme.
    // Remsan med sin dyra shadowBlur-glow forrenderas till en offscreen-canvas
    // per theme/width; per frame ar det bara tva drawImage-anrop.
    const hazardH = 12;
    const t = performance.now() / 250;
    const glow = 0.5 + Math.sin(t) * 0.5;
    const strip = getHazardStrip(theme);
    const stripH = hazardH + HAZARD_PAD * 2;
    ctx.drawImage(strip, 0, GROUND_Y - 2 - HAZARD_PAD, viewW, stripH);
    // "Pulsen": rita glowlagret en gang till med varierande alpha sa remsan
    // lyser starkare och svagare, som originalets pulserande shadowBlur.
    ctx.save();
    ctx.globalAlpha = glow * 0.4;
    ctx.drawImage(strip, 0, GROUND_Y - 2 - HAZARD_PAD, viewW, stripH);
    ctx.restore();
    // Glowing particles in the strip. Sin-seeded with world coordinate (not
    // skarmpositionen), annars hoppar guppet varje gang offseten slar runt.
    ctx.fillStyle = theme.hazard.dot;
    const dotSpacing = 90;
    const dotScroll = Math.floor(game.distance * 1.4);
    const dOffset = dotScroll % dotSpacing;
    for (let x = -dOffset; x < viewW; x += dotSpacing) {
        const bob = Math.sin(t + x + dotScroll) * 2;
        ctx.beginPath();
        ctx.arc(x, GROUND_Y + 2 + bob, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    // Glowing crystals embedded in the rock, for a bit of color pop against the stone
    if (theme.crystalColor) {
        const crystalSpacing = 150;
        const crScroll = Math.floor(game.distance * 0.7);
        const crOffset = crScroll % crystalSpacing;
        ctx.save();
        ctx.shadowColor = theme.crystalColor;
        ctx.shadowBlur = 10;
        ctx.fillStyle = theme.crystalColor;
        for (let x = -crOffset; x < viewW; x += crystalSpacing) {
            const cy = GROUND_Y + 34 + Math.sin((x + crScroll) * 0.04) * 8;
            ctx.beginPath();
            ctx.moveTo(x, cy - 8);
            ctx.lineTo(x + 5, cy);
            ctx.lineTo(x, cy + 8);
            ctx.lineTo(x - 5, cy);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
}
// ---------- Forrenderad hazard-remsa ----------
const HAZARD_PAD = 26; // utrymme for glowen ovanfor/under remsan
let hazardStripCache = null;
let hazardStripKey = "";
export function getHazardStrip(theme) {
    const key = theme.key + ":" + viewW + ":" + DPR;
    if (hazardStripKey !== key) {
        const hazardH = 12;
        const off = document.createElement("canvas");
        // Bakas i DPR-upplosning (logiken raknar i CSS-pixlar) sa remsan ar
        // skarp aven pa retinaskarmar.
        off.width = Math.max(1, Math.ceil(viewW * DPR));
        off.height = Math.ceil((hazardH + HAZARD_PAD * 2) * DPR);
        const octx = off.getContext("2d");
        octx.scale(DPR, DPR);
        // Remsan ritas pa y=GROUND_Y-2 men gradienten spande GROUND_Y±hazardH i
        // originalet - samma forhallande har (rekt-toppen ligger 10px in i gradienten).
        const grad = octx.createLinearGradient(0, HAZARD_PAD - (hazardH - 2), 0, HAZARD_PAD + hazardH + 2);
        grad.addColorStop(0, theme.hazard.top);
        grad.addColorStop(0.4, theme.hazard.mid);
        grad.addColorStop(1, theme.hazard.bottom);
        octx.shadowColor = theme.hazard.glow;
        octx.shadowBlur = 20;
        octx.fillStyle = grad;
        octx.fillRect(0, HAZARD_PAD, viewW, hazardH);
        hazardStripCache = off;
        hazardStripKey = key;
    }
    return hazardStripCache;
}
export function drawAmbientParticles(ctx, theme, t) {
    // Partiklarna flyttas i rit-steget (inte update) sa de lever aven pa
    // start-/gameover-skarmen. Skala med frameScale sa farten blir densamma
    // pa 120+ Hz-skarmar som pa 60 Hz.
    const fs = Minimotor.Engine.frameScale;
    for (const p of ambientParticles) {
        switch (theme.particle) {
            case "bubbles":
                p.y -= p.speed * fs;
                if (p.y < -10)
                    p.y = viewH + 10;
                break;
            case "snow":
                p.y += p.speed * 0.6 * fs;
                p.x += Math.sin(t + p.phase) * 0.4 * fs;
                if (p.y > viewH + 10)
                    p.y = -10;
                break;
            case "embers":
                p.y -= p.speed * 0.8 * fs;
                p.x += p.drift * fs;
                if (p.y < -10) {
                    p.y = viewH + 10;
                    p.x = Math.random() * viewW;
                }
                break;
            case "fireflies":
                p.x += Math.sin(t * 0.6 + p.phase) * 0.6 * fs;
                p.y += Math.cos(t * 0.5 + p.phase) * 0.4 * fs;
                break;
            case "stars":
                // Stars stay still and just twinkle
                break;
        }
        if (p.x < -10)
            p.x = viewW + 10;
        if (p.x > viewW + 10)
            p.x = -10;
        const twinkle = theme.particle === "stars" || theme.particle === "fireflies"
            ? 0.4 + 0.6 * (0.5 + Math.sin(t * 2 + p.phase) * 0.5)
            : 1;
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = theme.particleColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
export function drawJaggedSilhouette(ctx, baseY, peakMin, peakMax, spacing, color, offsetFactor) {
    const scroll = game.distance * offsetFactor;
    const offset = scroll % spacing;
    // Toppens hojd seedas med varldskolumnen (inte skarmplatsen) - annars
    // byter alla berg form varje gang offseten slar runt.
    const colBase = Math.floor(scroll / spacing) * spacing;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-spacing * 2, GROUND_Y);
    ctx.lineTo(-spacing * 2, baseY);
    for (let bx = -spacing * 2; bx < viewW + spacing * 2; bx += spacing) {
        const x = bx - offset;
        const peak = baseY - (peakMin + Math.abs(Math.sin((bx + colBase) * 0.013)) * (peakMax - peakMin));
        ctx.lineTo(x + spacing / 2, peak);
        ctx.lineTo(x + spacing, baseY);
    }
    ctx.lineTo(viewW + spacing * 2, baseY);
    ctx.lineTo(viewW + spacing * 2, GROUND_Y);
    ctx.closePath();
    ctx.fill();
}
export function drawShootingStar(ctx, t, cycle, seedOffset, color, y0, y1) {
    const phase = ((t + seedOffset) % cycle) / cycle;
    if (phase > 0.15)
        return;
    const p = phase / 0.15;
    const startX = viewW * 1.05;
    const endX = -viewW * 0.1;
    const x = startX + (endX - startX) * p;
    const y = y0 + (y1 - y0) * p;
    const len = 90;
    ctx.save();
    ctx.globalAlpha = 1 - p;
    const grad = ctx.createLinearGradient(x, y, x + len, y - len * 0.35);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y - len * 0.35);
    ctx.stroke();
    ctx.restore();
}
export function drawFish(ctx, x, y, size, color, t, phase) {
    const wob = Math.sin(t * 3 + phase) * 3;
    ctx.save();
    ctx.translate(x, y + wob);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    // Stjart pekar bakat (at hoger) eftersom fisken simmar at vanster, som allt annat i banan
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(size * 1.7, -size * 0.55);
    ctx.lineTo(size * 1.7, size * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
export function drawBird(ctx, x, y, size, t, phase, color) {
    const flap = Math.sin(t * 6 + phase) * 0.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color || "rgba(20,15,5,0.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-size, flap * size * 0.7);
    ctx.quadraticCurveTo(0, -size * 0.7, size, flap * size * 0.7);
    ctx.stroke();
    ctx.restore();
}
export function drawFlutterfly(ctx, x, y, size, t, phase, color) {
    const wingOpen = 0.3 + Math.abs(Math.sin(t * 8 + phase)) * 0.7;
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 2 + phase) * 4);
    ctx.fillStyle = color;
    ctx.save();
    ctx.scale(wingOpen, 1);
    ctx.beginPath();
    ctx.ellipse(-size * 0.6, 0, size * 0.6, size * 0.4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.scale(wingOpen, 1);
    ctx.beginPath();
    ctx.ellipse(size * 0.6, 0, size * 0.6, size * 0.4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "rgba(30,20,10,0.7)";
    ctx.fillRect(-1, -size * 0.35, 2, size * 0.7);
    ctx.restore();
}
export function drawHangingVine(ctx, x, topY, len, t, phase, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i <= len; i += 6) {
        const yy = topY + i;
        const xx = x + Math.sin(t * 0.8 + phase + i * 0.05) * 6;
        if (i === 0)
            ctx.moveTo(xx, yy);
        else
            ctx.lineTo(xx, yy);
    }
    ctx.stroke();
    ctx.restore();
}
export function drawIceberg(ctx, x, y, w, h, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x - w * 0.2, y - h);
    ctx.lineTo(x + w * 0.1, y - h * 0.6);
    ctx.lineTo(x + w / 2, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
export function drawRainbow(ctx, cx, baseY, radius) {
    const colors = ["#ff5a5a", "#ffb84a", "#ffe24a", "#6fce7a", "#5ab4ff", "#a06fff"];
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    for (let i = 0; i < colors.length; i++) {
        ctx.strokeStyle = colors[i];
        ctx.beginPath();
        ctx.arc(cx, baseY, radius - i * 8, Math.PI, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}
export function drawFallingStreaks(ctx, t, canvasW, canvasH, count, color, speed, streakLen) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let i = 0; i < count; i++) {
        const seed = i * 137.5;
        const x = (seed * 3.1) % canvasW;
        const y = (((t * game.speed + seed) * 4) % (canvasH + 40)) - 20;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - streakLen * 0.3, y + streakLen);
        ctx.stroke();
    }
    ctx.restore();
}
export function drawGroundProp(ctx, x, groundY, type, color) {
    ctx.save();
    ctx.fillStyle = color;
    switch (type) {
        case "mushroom":
            ctx.fillRect(x - 3, groundY - 14, 6, 14);
            ctx.beginPath();
            ctx.ellipse(x, groundY - 16, 12, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        case "pumpkin":
            ctx.beginPath();
            ctx.ellipse(x, groundY - 10, 13, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#3a5a20";
            ctx.fillRect(x - 2, groundY - 22, 4, 6);
            break;
        case "tombstone":
            ctx.beginPath();
            ctx.moveTo(x - 10, groundY);
            ctx.lineTo(x - 10, groundY - 20);
            ctx.arc(x, groundY - 20, 10, Math.PI, 0);
            ctx.lineTo(x + 10, groundY);
            ctx.closePath();
            ctx.fill();
            break;
        case "flower":
            ctx.fillRect(x - 1.5, groundY - 14, 3, 14);
            for (let i = 0; i < 5; i++) {
                const a = (Math.PI * 2 * i) / 5;
                ctx.beginPath();
                ctx.arc(x + Math.cos(a) * 6, groundY - 16 + Math.sin(a) * 6, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        case "chest":
            ctx.fillRect(x - 14, groundY - 14, 28, 14);
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fillRect(x - 14, groundY - 15, 28, 3);
            ctx.fillStyle = "#e8c24a";
            ctx.fillRect(x - 3, groundY - 11, 6, 6);
            break;
        case "gumdrop":
            ctx.beginPath();
            ctx.moveTo(x - 12, groundY);
            ctx.quadraticCurveTo(x - 12, groundY - 20, x, groundY - 20);
            ctx.quadraticCurveTo(x + 12, groundY - 20, x + 12, groundY);
            ctx.closePath();
            ctx.fill();
            break;
    }
    ctx.restore();
}
// ---------- Storslagna dekorations-hjalpare ----------
export function drawCloud(ctx, x, y, scale, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, 34 * scale, 16 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 24 * scale, y - 6 * scale, 22 * scale, 13 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 24 * scale, y - 4 * scale, 20 * scale, 12 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
// Parallax-lager av moln som glider forbi langsamt
export function drawDriftingClouds(ctx, t, color, count, yBase, scale, speed) {
    for (let i = 0; i < count; i++) {
        const span = viewW + 300;
        const x = (((i * span) / count + t * game.speed) % span) - 150;
        const y = yBase + (i % 2) * 40 * scale;
        drawCloud(ctx, x, y, scale * (0.7 + (i % 3) * 0.2), color);
    }
}
export function drawPillar(ctx, x, groundY, w, h, color, capColor) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x - w / 2, groundY - h, w, h);
    // rafflor
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x - w / 2 + (w / 4) * i, groundY - h);
        ctx.lineTo(x - w / 2 + (w / 4) * i, groundY);
        ctx.stroke();
    }
    ctx.fillStyle = capColor || color;
    ctx.fillRect(x - w / 2 - 5, groundY - h - 8, w + 10, 8);
    ctx.fillRect(x - w / 2 - 5, groundY - 6, w + 10, 6);
    ctx.restore();
}
export function drawFloatingIsland(ctx, x, y, w, topColor, rockColor, t) {
    const bob = Math.sin(t * 0.6 + x) * 4;
    ctx.save();
    ctx.translate(0, bob);
    ctx.fillStyle = rockColor;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x + w / 2, y);
    ctx.lineTo(x + w * 0.15, y + w * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, w * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
export function drawBalloon(ctx, x, y, r, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + r * 1.2);
    ctx.lineTo(x, y + r * 1.9);
    ctx.stroke();
    ctx.restore();
}
export function drawSwayingTree(ctx, x, groundY, trunkH, crownR, trunkColor, crownColor, t, seed) {
    ctx.save();
    ctx.translate(x, groundY);
    ctx.rotate(Math.sin(t * 0.4 + seed) * 0.02);
    ctx.strokeStyle = trunkColor;
    ctx.lineWidth = trunkH * 0.12;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -trunkH);
    ctx.stroke();
    ctx.fillStyle = crownColor;
    ctx.beginPath();
    ctx.arc(0, -trunkH - crownR * 0.4, crownR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
export function drawWavingBanner(ctx, x, topY, w, h, color, t, seed) {
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.lineTo(x, topY + h + 20);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, topY);
    for (let i = 0; i <= w; i += 6) {
        ctx.lineTo(x + i, topY + Math.sin(t * 3 + i * 0.2 + seed) * 3);
    }
    for (let i = w; i >= 0; i -= 6) {
        ctx.lineTo(x + i, topY + h + Math.sin(t * 3 + i * 0.2 + seed) * 3);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
export function drawFirework(ctx, cx, cy, t, cycle, seed, color) {
    const phase = ((t + seed) % cycle) / cycle;
    if (phase > 0.4)
        return;
    const p = phase / 0.4;
    ctx.save();
    ctx.globalAlpha = 1 - p;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    const rays = 12;
    for (let i = 0; i < rays; i++) {
        const a = (Math.PI * 2 * i) / rays;
        const r1 = p * 8;
        const r2 = p * 45;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}
export function drawLantern(ctx, x, y, color, t, seed) {
    ctx.save();
    ctx.globalAlpha = 0.5 + 0.3 * (0.5 + Math.sin(t * 2 + seed) * 0.5);
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
// Silhuett av flera byggnader/torn som en stad langt bort
export function drawTowerRow(ctx, baseY, color, offsetFactor, seed) {
    const spacing = 90;
    const scroll = game.distance * offsetFactor;
    const offset = scroll % spacing;
    // Byggnadernas form seedas med varldskolumnen sa staden inte byter
    // skepnad varje gang offseten slar runt.
    const colBase = Math.floor(scroll / spacing) * spacing;
    ctx.save();
    ctx.fillStyle = color;
    for (let bx = -spacing; bx < viewW + spacing; bx += spacing) {
        const x = bx - offset;
        const wc = bx + colBase + seed;
        const h = 60 + Math.abs(Math.sin(wc * 0.03)) * 120;
        const w = spacing * (0.4 + Math.abs(Math.sin(wc * 0.07)) * 0.25);
        ctx.fillRect(x, baseY - h, w, h);
        // spira ibland
        if (Math.sin(wc * 0.05) > 0.5) {
            ctx.beginPath();
            ctx.moveTo(x, baseY - h);
            ctx.lineTo(x + w / 2, baseY - h - 20);
            ctx.lineTo(x + w, baseY - h);
            ctx.closePath();
            ctx.fill();
        }
    }
    ctx.restore();
}
