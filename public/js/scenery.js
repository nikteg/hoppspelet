"use strict";
function drawScenery(ctx, theme, t) {
    switch (theme.key) {
        case "lava": {
            drawJaggedSilhouette(ctx, GROUND_Y - 30, 50, 140, 220, "rgba(20,6,8,0.9)", 0.05);
            const craterX = viewW * 0.75;
            const craterY = GROUND_Y - 175;
            // Rök som stiger fran vulkanen
            for (let i = 0; i < 4; i++) {
                const cycle = 10;
                const localT = (t * 0.6 + i * 2.5) % cycle;
                const p = localT / cycle;
                ctx.save();
                ctx.globalAlpha = (1 - p) * 0.3;
                ctx.fillStyle = "rgba(90,80,80,0.8)";
                ctx.beginPath();
                ctx.arc(craterX + Math.sin(i * 2) * 8, craterY - p * 150, 8 + p * 20, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Glödande krater, med periodiskt utbrott
            const eruptCycle = 24;
            const eruptPhase = (t % eruptCycle) / eruptCycle;
            const eruptBurst = eruptPhase < 0.08 ? 1 - eruptPhase / 0.08 : 0;
            ctx.save();
            ctx.shadowColor = "rgba(255,140,40,0.9)";
            ctx.shadowBlur = 25 + eruptBurst * 30;
            ctx.fillStyle = "rgba(255,150,60,0.6)";
            ctx.beginPath();
            ctx.arc(craterX, craterY, 9 + eruptBurst * 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Mindre avlagsen vulkan i bakgrunden
            const smallVolcX = viewW * 0.4;
            ctx.fillStyle = "rgba(15,5,8,0.7)";
            ctx.beginPath();
            ctx.moveTo(smallVolcX - 35, GROUND_Y - 30);
            ctx.lineTo(smallVolcX, GROUND_Y - 100);
            ctx.lineTo(smallVolcX + 35, GROUND_Y - 30);
            ctx.closePath();
            ctx.fill();
            // Glodande aska/stendebris som driver nedat
            for (let i = 0; i < 5; i++) {
                const cycle = 12;
                const localT = (t * 0.4 + i * 2.2) % cycle;
                const p = localT / cycle;
                const ax = (i * 240 + 60) % viewW;
                ctx.save();
                ctx.globalAlpha = (1 - p) * 0.5;
                ctx.fillStyle = "rgba(255,120,50,0.7)";
                ctx.fillRect(ax, viewH * 0.1 + p * viewH * 0.4, 4, 4);
                ctx.restore();
            }
            break;
        }
        case "ocean": {
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = "#bfe9ff";
            for (let i = 0; i < 4; i++) {
                const bx = (((viewW / 4) * i + t * 6) % (viewW + 200)) - 100;
                ctx.beginPath();
                ctx.moveTo(bx, 0);
                ctx.lineTo(bx + 60, 0);
                ctx.lineTo(bx - 40, GROUND_Y);
                ctx.lineTo(bx - 100, GROUND_Y);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
            // Simmande fiskstim i olika djup
            for (let i = 0; i < 4; i++) {
                const spd = 12 + i * 5;
                const x = viewW + 80 - ((t * spd + i * 260) % (viewW + 300));
                const y = viewH * 0.2 + i * 60;
                drawFish(ctx, x, y, 9 + (i % 2) * 3, "rgba(8,25,35,0.5)", t, i * 2);
            }
            drawJaggedSilhouette(ctx, GROUND_Y - 10, 20, 55, 150, "rgba(6,40,45,0.85)", 0.06);
            // Manetflockar som svavar
            for (let i = 0; i < 2; i++) {
                const jx = viewW * (0.35 + i * 0.4);
                const jy = viewH * 0.3 + Math.sin(t * 0.7 + i) * 30;
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "rgba(220,180,255,0.6)";
                ctx.beginPath();
                ctx.arc(jx, jy, 16, Math.PI, 0);
                ctx.fill();
                ctx.strokeStyle = "rgba(220,180,255,0.5)";
                ctx.lineWidth = 2;
                for (let k = -2; k <= 2; k++) {
                    ctx.beginPath();
                    ctx.moveTo(jx + k * 6, jy);
                    ctx.lineTo(jx + k * 6 + Math.sin(t * 2 + k) * 4, jy + 18);
                    ctx.stroke();
                }
                ctx.restore();
            }
            // Sjögräs som vaggar fran havsbotten
            for (let i = 0; i < 4; i++) {
                const gx = 100 + i * ((viewW - 200) / 4);
                ctx.save();
                ctx.strokeStyle = "rgba(20,80,60,0.6)";
                ctx.lineWidth = 4;
                ctx.lineCap = "round";
                ctx.beginPath();
                for (let s = 0; s <= 40; s += 8) {
                    const yy = GROUND_Y - s;
                    const xx = gx + Math.sin(t * 0.9 + i + s * 0.08) * 8;
                    if (s === 0)
                        ctx.moveTo(xx, yy);
                    else
                        ctx.lineTo(xx, yy);
                }
                ctx.stroke();
                ctx.restore();
            }
            break;
        }
        case "jungle": {
            drawJaggedSilhouette(ctx, GROUND_Y - 20, 60, 170, 240, "rgba(10,30,8,0.85)", 0.045);
            // Flygande faglar
            for (let i = 0; i < 3; i++) {
                const spd = 20 + i * 8;
                const x = ((t * spd + i * 300) % (viewW + 200)) - 100;
                const y = viewH * 0.12 + i * 30;
                drawBird(ctx, x, y, 8, t, i * 3);
            }
            // Svajande tempeltrad (placerad langt fran figurens fasta position)
            ctx.save();
            const tx = Math.max(320, viewW * 0.3);
            const ty = GROUND_Y - 90;
            ctx.translate(tx, GROUND_Y);
            ctx.rotate(Math.sin(t * 0.4) * 0.02);
            ctx.fillStyle = "rgba(30,25,10,0.7)";
            ctx.beginPath();
            ctx.moveTo(-45, 0);
            ctx.lineTo(-30, ty - GROUND_Y);
            ctx.lineTo(30, ty - GROUND_Y);
            ctx.lineTo(45, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            // Fjarilar
            const butterflyColors = [
                "rgba(255,140,60,0.8)",
                "rgba(140,200,255,0.8)",
                "rgba(255,220,80,0.8)",
            ];
            for (let i = 0; i < 3; i++) {
                const bx2 = ((t * (8 + i * 3) + i * 400) % (viewW + 100)) - 50;
                const by2 = viewH * 0.4 + i * 40 + Math.sin(t + i) * 20;
                drawFlutterfly(ctx, bx2, by2, 7, t, i * 4, butterflyColors[i]);
            }
            // Hangande rankor fran overkanten
            for (let i = 0; i < 3; i++) {
                const vx = viewW * (0.45 + i * 0.18);
                drawHangingVine(ctx, vx, 0, 70 + i * 20, t, i * 2, "rgba(30,60,15,0.6)");
            }
            // Blommor pa marken
            drawGroundProp(ctx, Math.max(380, viewW * 0.5), GROUND_Y, "flower", "rgba(255,120,160,0.7)");
            drawGroundProp(ctx, Math.max(460, viewW * 0.58), GROUND_Y, "flower", "rgba(255,220,80,0.7)");
            break;
        }
        case "ice": {
            ctx.save();
            ctx.globalAlpha = 0.25;
            const auroraColors = ["#8affc1", "#8ad9ff", "#c58aff"];
            for (let i = 0; i < 3; i++) {
                ctx.strokeStyle = auroraColors[i];
                ctx.lineWidth = 18;
                ctx.beginPath();
                for (let x = 0; x <= viewW; x += 20) {
                    const y = 60 + i * 30 + Math.sin(x * 0.01 + t + i) * 25;
                    if (x === 0)
                        ctx.moveTo(x, y);
                    else
                        ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            ctx.restore();
            drawShootingStar(ctx, t, 26, 4, "rgba(255,255,255,0.95)", viewH * 0.1, viewH * 0.35);
            drawJaggedSilhouette(ctx, GROUND_Y - 10, 70, 190, 210, "rgba(180,220,240,0.5)", 0.05);
            // Isberg som flyter forbi i fjarran
            for (let i = 0; i < 2; i++) {
                const ibx = viewW * (0.4 + i * 0.35);
                drawIceberg(ctx, ibx, GROUND_Y - 5, 90 + i * 30, 55 + i * 15, "rgba(210,235,245,0.55)");
            }
            // Pingviner som vaggar pa marken
            for (let i = 0; i < 2; i++) {
                const pgx = Math.max(400, viewW * (0.5 + i * 0.1));
                const bob = Math.sin(t * 4 + i) * 2;
                ctx.save();
                ctx.translate(pgx, GROUND_Y + bob);
                ctx.fillStyle = "#1a2a30";
                ctx.beginPath();
                ctx.ellipse(0, -14, 9, 14, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#f2f8fa";
                ctx.beginPath();
                ctx.ellipse(0, -12, 5, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                // Ogon
                ctx.fillStyle = "#0a1418";
                ctx.beginPath();
                ctx.arc(-2.5, -22, 1.2, 0, Math.PI * 2);
                ctx.arc(2.5, -22, 1.2, 0, Math.PI * 2);
                ctx.fill();
                // Orange nabb
                ctx.fillStyle = "#f5a623";
                ctx.beginPath();
                ctx.moveTo(0, -20);
                ctx.lineTo(7, -18);
                ctx.lineTo(0, -16);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            break;
        }
        case "space": {
            ctx.save();
            const ringAngle = -0.3 + Math.sin(t * 0.08) * 0.12;
            ctx.fillStyle = "#5b3a9e";
            ctx.beginPath();
            ctx.arc(viewW * 0.8, viewH * 0.22, 34, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(200,180,255,0.6)";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.ellipse(viewW * 0.8, viewH * 0.22, 52, 14, ringAngle, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = "#2e6f9e";
            ctx.beginPath();
            ctx.arc(viewW * 0.25, viewH * 0.15, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            drawShootingStar(ctx, t, 20, 0, "rgba(220,200,255,0.95)", viewH * 0.05, viewH * 0.4);
            // Avlagsen rymdstation
            ctx.save();
            const stX = viewW * 0.45;
            const stY = viewH * 0.12;
            ctx.fillStyle = "rgba(180,190,210,0.6)";
            ctx.fillRect(stX - 16, stY - 6, 32, 12);
            ctx.fillStyle = "rgba(120,180,255,0.5)";
            ctx.fillRect(stX - 30, stY - 3, 12, 6);
            ctx.fillRect(stX + 18, stY - 3, 12, 6);
            ctx.restore();
            // Asteroidbalte som driver forbi
            for (let i = 0; i < 5; i++) {
                const spd = 6 + (i % 3) * 3;
                const ax = viewW + 40 - ((t * spd + i * 180) % (viewW + 200));
                const ay = viewH * (0.15 + (i % 4) * 0.08);
                ctx.save();
                ctx.fillStyle = "rgba(90,80,100,0.6)";
                ctx.beginPath();
                ctx.arc(ax, ay, 4 + (i % 3) * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            break;
        }
        case "desert": {
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 40, 100, 260, "rgba(150,90,30,0.5)", 0.04);
            ctx.save();
            ctx.shadowColor = "rgba(255,230,150,0.9)";
            ctx.shadowBlur = 30;
            ctx.fillStyle = "rgba(255,240,190,0.9)";
            ctx.beginPath();
            ctx.arc(viewW * 0.82, viewH * 0.18, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            const px = Math.max(340, viewW * 0.65);
            ctx.fillStyle = "rgba(120,70,25,0.7)";
            ctx.beginPath();
            ctx.moveTo(px - 55, GROUND_Y);
            ctx.lineTo(px, GROUND_Y - 95);
            ctx.lineTo(px + 55, GROUND_Y);
            ctx.closePath();
            ctx.fill();
            // Kamelkaravan som vandrar i fjarran
            ctx.save();
            ctx.fillStyle = "rgba(90,55,20,0.6)";
            for (let i = 0; i < 3; i++) {
                const cx2 = viewW * 0.42 + i * 30;
                const bob = Math.sin(t * 3 + i) * 2;
                ctx.beginPath();
                ctx.ellipse(cx2, GROUND_Y - 12 + bob, 12, 8, 0, 0, Math.PI * 2);
                ctx.ellipse(cx2 + 8, GROUND_Y - 20 + bob, 6, 7, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            // Rullande ökentumlare
            const tumbleX = viewW - ((t * 40) % (viewW + 60)) - 30;
            ctx.save();
            ctx.translate(tumbleX, GROUND_Y - 8);
            ctx.rotate(t * 4);
            ctx.strokeStyle = "rgba(100,70,30,0.7)";
            ctx.lineWidth = 2;
            for (let a = 0; a < 6; a++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos((Math.PI / 3) * a) * 8, Math.sin((Math.PI / 3) * a) * 8);
                ctx.stroke();
            }
            ctx.restore();
            // Oas med palmer langt bort
            const oasisX = viewW * 0.2;
            ctx.fillStyle = "rgba(80,50,15,0.6)";
            ctx.fillRect(oasisX - 2, GROUND_Y - 45, 4, 45);
            ctx.fillStyle = "rgba(60,110,40,0.6)";
            ctx.beginPath();
            ctx.ellipse(oasisX - 10, GROUND_Y - 48, 12, 6, 0.3, 0, Math.PI * 2);
            ctx.ellipse(oasisX + 10, GROUND_Y - 48, 12, 6, -0.3, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case "sky": {
            for (let i = 0; i < 3; i++) {
                const ix = ((viewW * 0.4 * i + t * 4) % (viewW + 300)) - 100;
                const iy = viewH * (0.28 + i * 0.12);
                ctx.save();
                ctx.globalAlpha = 0.55;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.ellipse(ix, iy, 55, 18, 0, 0, Math.PI * 2);
                ctx.ellipse(ix + 30, iy - 8, 30, 14, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            drawJaggedSilhouette(ctx, GROUND_Y - 5, 15, 40, 180, "rgba(255,255,255,0.4)", 0.07);
            drawRainbow(ctx, viewW * 0.72, viewH * 0.55, 90);
            // Avlagset luftskepp
            const airX = viewW * 0.3 + Math.sin(t * 0.3) * 20;
            const airY = viewH * 0.2;
            ctx.save();
            ctx.fillStyle = "rgba(200,60,60,0.6)";
            ctx.beginPath();
            ctx.ellipse(airX, airY, 30, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(80,60,40,0.6)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(airX - 10, airY + 10);
            ctx.lineTo(airX - 10, airY + 18);
            ctx.moveTo(airX + 10, airY + 10);
            ctx.lineTo(airX + 10, airY + 18);
            ctx.stroke();
            ctx.fillStyle = "rgba(140,90,40,0.6)";
            ctx.fillRect(airX - 12, airY + 18, 24, 6);
            ctx.restore();
            break;
        }
        case "neon": {
            const spacing = 130;
            const scroll = distance * 0.06;
            const offset = scroll % spacing;
            // Byggnadens hojd och fonstermonster seedas med dess VARLDSKOLUMN
            // (bx + colBase), inte skarmplatsen - annars byter alla hus form och
            // fonster varje gang offseten slar runt (och fonstren "blinkar").
            const colBase = Math.floor(scroll / spacing) * spacing;
            for (let bx = -spacing; bx < viewW + spacing; bx += spacing) {
                const x = bx - offset;
                const wcol = bx + colBase;
                const h = 90 + Math.abs(Math.sin(wcol * 0.02)) * 140;
                ctx.fillStyle = "rgba(10,5,20,0.85)";
                ctx.fillRect(x, GROUND_Y - h, spacing * 0.6, h);
                let row = 0;
                for (let wy = GROUND_Y - h + 10; wy < GROUND_Y - 10; wy += 16) {
                    let col = 0;
                    for (let wx = x + 6; wx < x + spacing * 0.6 - 6; wx += 14) {
                        if (Math.sin(wcol * 0.7 + row * 2.1 + col * 1.3) > 0.3) {
                            ctx.fillStyle = "rgba(0,255,255,0.5)";
                        }
                        else {
                            ctx.fillStyle = "rgba(255,60,200,0.35)";
                        }
                        ctx.fillRect(wx, wy, 6, 8);
                        col++;
                    }
                    row++;
                }
            }
            // Flygande bilar
            for (let i = 0; i < 3; i++) {
                const spd2 = 25 + i * 10;
                const cx3 = ((t * spd2 + i * 260) % (viewW + 100)) - 50;
                const cy3 = viewH * (0.15 + i * 0.1);
                ctx.save();
                ctx.shadowColor = i % 2 === 0 ? "rgba(0,255,255,0.9)" : "rgba(255,0,200,0.9)";
                ctx.shadowBlur = 8;
                ctx.fillStyle = i % 2 === 0 ? "#0ff0fc" : "#ff2fb0";
                ctx.beginPath();
                ctx.ellipse(cx3, cy3, 14, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            break;
        }
        case "haunted": {
            ctx.save();
            ctx.fillStyle = "rgba(230,230,220,0.5)";
            ctx.beginPath();
            ctx.arc(viewW * 0.78, viewH * 0.18, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            const cx = Math.max(340, viewW * 0.62);
            ctx.fillStyle = "rgba(20,18,25,0.85)";
            ctx.fillRect(cx - 60, GROUND_Y - 110, 120, 110);
            ctx.fillRect(cx - 80, GROUND_Y - 80, 20, 80);
            ctx.fillRect(cx + 60, GROUND_Y - 80, 20, 80);
            ctx.beginPath();
            ctx.moveTo(cx - 80, GROUND_Y - 80);
            ctx.lineTo(cx - 70, GROUND_Y - 105);
            ctx.lineTo(cx - 60, GROUND_Y - 80);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx + 60, GROUND_Y - 80);
            ctx.lineTo(cx + 70, GROUND_Y - 105);
            ctx.lineTo(cx + 80, GROUND_Y - 80);
            ctx.closePath();
            ctx.fill();
            // Fladdermoss
            for (let i = 0; i < 4; i++) {
                const spd = 15 + i * 6;
                const bx3 = ((t * spd + i * 220) % (viewW + 100)) - 50;
                const by3 = viewH * 0.2 + Math.sin(t * 2 + i) * 20 + i * 15;
                drawBird(ctx, bx3, by3, 7, t, i * 5, "rgba(10,10,15,0.8)");
            }
            // Gravstenar
            drawGroundProp(ctx, Math.max(400, viewW * 0.48), GROUND_Y, "tombstone", "rgba(60,60,65,0.7)");
            drawGroundProp(ctx, Math.max(460, viewW * 0.55), GROUND_Y, "tombstone", "rgba(60,60,65,0.7)");
            // Dimma langs marken
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "#a8c9a8";
            const fogOffset = (t * 5) % 200;
            for (let x = -fogOffset; x < viewW; x += 200) {
                ctx.beginPath();
                ctx.ellipse(x, GROUND_Y - 5, 110, 14, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            break;
        }
        case "viking": {
            drawJaggedSilhouette(ctx, GROUND_Y - 20, 80, 200, 240, "rgba(20,40,50,0.7)", 0.045);
            const shipX = Math.max(340, viewW * 0.68);
            const shipY = GROUND_Y - 40;
            ctx.fillStyle = "rgba(15,12,10,0.75)";
            ctx.beginPath();
            ctx.moveTo(shipX - 40, shipY);
            ctx.quadraticCurveTo(shipX, shipY + 14, shipX + 40, shipY);
            ctx.lineTo(shipX + 30, shipY - 10);
            ctx.lineTo(shipX - 30, shipY - 10);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "rgba(15,12,10,0.75)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(shipX, shipY - 10);
            ctx.lineTo(shipX, shipY - 55);
            ctx.stroke();
            // Ett andra, mindre skepp langre bort
            const ship2X = viewW * 0.4;
            const ship2Y = GROUND_Y - 25;
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "rgba(15,12,10,0.75)";
            ctx.beginPath();
            ctx.moveTo(ship2X - 25, ship2Y);
            ctx.quadraticCurveTo(ship2X, ship2Y + 8, ship2X + 25, ship2Y);
            ctx.lineTo(ship2X + 18, ship2Y - 6);
            ctx.lineTo(ship2X - 18, ship2Y - 6);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            // Korpar som flyger
            for (let i = 0; i < 2; i++) {
                const spd = 18 + i * 6;
                const rx = ((t * spd + i * 300) % (viewW + 100)) - 50;
                const ry = viewH * 0.15 + i * 20;
                drawBird(ctx, rx, ry, 7, t, i * 4, "rgba(10,10,10,0.7)");
            }
            // Byhus vid fjorden
            const villageX = viewW * 0.2;
            ctx.fillStyle = "rgba(40,30,20,0.6)";
            ctx.fillRect(villageX - 20, GROUND_Y - 30, 40, 30);
            ctx.beginPath();
            ctx.moveTo(villageX - 25, GROUND_Y - 30);
            ctx.lineTo(villageX, GROUND_Y - 50);
            ctx.lineTo(villageX + 25, GROUND_Y - 30);
            ctx.closePath();
            ctx.fill();
            break;
        }
        case "dino": {
            drawJaggedSilhouette(ctx, GROUND_Y - 25, 70, 190, 230, "rgba(20,35,10,0.8)", 0.045);
            const dx = Math.max(360, viewW * 0.66);
            ctx.fillStyle = "rgba(20,30,10,0.7)";
            ctx.beginPath();
            ctx.ellipse(dx, GROUND_Y - 30, 45, 25, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(dx + 30, GROUND_Y - 45);
            ctx.quadraticCurveTo(dx + 70, GROUND_Y - 110, dx + 60, GROUND_Y - 140);
            ctx.lineTo(dx + 50, GROUND_Y - 135);
            ctx.quadraticCurveTo(dx + 60, GROUND_Y - 100, dx + 25, GROUND_Y - 55);
            ctx.closePath();
            ctx.fill();
            // Pterodaktyler som flyger over dalen
            for (let i = 0; i < 2; i++) {
                const spd = 22 + i * 8;
                const px2 = ((t * spd + i * 320) % (viewW + 100)) - 50;
                const py2 = viewH * 0.18 + i * 25;
                drawBird(ctx, px2, py2, 13, t, i * 3, "rgba(30,25,10,0.7)");
            }
            // Ormbunkar i forgrunden
            for (let i = 0; i < 3; i++) {
                const fx2 = Math.max(360, viewW * (0.4 + i * 0.08));
                ctx.save();
                ctx.strokeStyle = "rgba(30,60,15,0.6)";
                ctx.lineWidth = 3;
                for (let leaf = -2; leaf <= 2; leaf++) {
                    ctx.beginPath();
                    ctx.moveTo(fx2, GROUND_Y);
                    ctx.quadraticCurveTo(fx2 + leaf * 8, GROUND_Y - 20, fx2 + leaf * 16, GROUND_Y - 5);
                    ctx.stroke();
                }
                ctx.restore();
            }
            break;
        }
        case "candy": {
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 50, 130, 200, "rgba(255,180,210,0.5)", 0.05);
            const lx = Math.max(340, viewW * 0.65);
            ctx.save();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(lx, GROUND_Y);
            ctx.lineTo(lx, GROUND_Y - 70);
            ctx.stroke();
            for (let i = 0; i < 3; i++) {
                ctx.strokeStyle = i % 2 === 0 ? "#ff5c8a" : "#ffffff";
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.arc(lx, GROUND_Y - 70, 26 - i * 7, 0, Math.PI * 1.4);
                ctx.stroke();
            }
            ctx.restore();
            drawRainbow(ctx, viewW * 0.25, viewH * 0.6, 80);
            // Gumdrop-kullar
            drawGroundProp(ctx, Math.max(400, viewW * 0.46), GROUND_Y, "gumdrop", "rgba(120,220,180,0.7)");
            drawGroundProp(ctx, Math.max(450, viewW * 0.52), GROUND_Y, "gumdrop", "rgba(255,150,200,0.7)");
            drawGroundProp(ctx, Math.max(500, viewW * 0.58), GROUND_Y, "gumdrop", "rgba(150,180,255,0.7)");
            // Fallande godisstrossel
            drawFallingStreaks(ctx, t, viewW, viewH, 20, "rgba(255,255,255,0.4)", 25, 6);
            break;
        }
        case "robot": {
            const fx = Math.max(340, viewW * 0.65);
            ctx.fillStyle = "rgba(20,20,25,0.85)";
            ctx.fillRect(fx - 70, GROUND_Y - 90, 140, 90);
            ctx.fillRect(fx - 50, GROUND_Y - 140, 18, 60);
            ctx.fillRect(fx + 30, GROUND_Y - 160, 18, 80);
            for (let i = 0; i < 3; i++) {
                const cycle = 8;
                const p = ((t * 0.5 + i * 2) % cycle) / cycle;
                ctx.save();
                ctx.globalAlpha = (1 - p) * 0.3;
                ctx.fillStyle = "rgba(120,120,120,0.7)";
                ctx.beginPath();
                ctx.arc(fx + 39, GROUND_Y - 160 - p * 90, 8 + p * 16, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            ctx.save();
            ctx.translate(fx, GROUND_Y - 45);
            ctx.rotate(t * 0.3);
            ctx.fillStyle = "rgba(255,191,63,0.5)";
            drawGearSpike(ctx, { x: -22, y: -22, w: 44, h: 44 });
            ctx.restore();
            // Flygande dronare med blinkande ljus
            for (let i = 0; i < 2; i++) {
                const spd = 20 + i * 10;
                const dx2 = ((t * spd + i * 300) % (viewW + 100)) - 50;
                const dy2 = viewH * (0.2 + i * 0.12);
                ctx.save();
                ctx.fillStyle = "rgba(80,80,90,0.8)";
                ctx.fillRect(dx2 - 8, dy2 - 3, 16, 6);
                const blink = Math.sin(t * 5 + i * 3) > 0;
                ctx.fillStyle = blink ? "rgba(255,60,60,0.9)" : "rgba(60,20,20,0.5)";
                ctx.beginPath();
                ctx.arc(dx2, dy2, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Elektriska gnistbagar pa fasaden
            const arcCycle = 3;
            const arcPhase = (t % arcCycle) / arcCycle;
            if (arcPhase < 0.15) {
                ctx.save();
                ctx.strokeStyle = "rgba(150,220,255,0.9)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(fx - 70, GROUND_Y - 70);
                ctx.lineTo(fx - 55, GROUND_Y - 60);
                ctx.lineTo(fx - 62, GROUND_Y - 50);
                ctx.lineTo(fx - 45, GROUND_Y - 40);
                ctx.stroke();
                ctx.restore();
            }
            break;
        }
        case "pirate": {
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.strokeStyle = "#dff4ff";
            ctx.lineWidth = 3;
            for (let i = 0; i < 3; i++) {
                const wy = GROUND_Y - 20 - i * 14;
                const wOffset = (t * (6 + i * 2)) % 60;
                ctx.beginPath();
                for (let x = -wOffset; x <= viewW; x += 60) {
                    ctx.moveTo(x, wy);
                    ctx.quadraticCurveTo(x + 30, wy - 8, x + 60, wy);
                }
                ctx.stroke();
            }
            ctx.restore();
            const sx = Math.max(340, viewW * 0.68);
            const sy = GROUND_Y - 35;
            ctx.fillStyle = "rgba(10,10,10,0.7)";
            ctx.beginPath();
            ctx.moveTo(sx - 40, sy);
            ctx.quadraticCurveTo(sx, sy + 12, sx + 40, sy);
            ctx.lineTo(sx + 30, sy - 12);
            ctx.lineTo(sx - 30, sy - 12);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(sx, sy - 12);
            ctx.lineTo(sx, sy - 60);
            ctx.lineTo(sx + 25, sy - 30);
            ctx.closePath();
            ctx.fill();
            // Masar som flyger
            for (let i = 0; i < 3; i++) {
                const spd = 18 + i * 7;
                const gx2 = ((t * spd + i * 260) % (viewW + 100)) - 50;
                const gy2 = viewH * 0.15 + i * 20;
                drawBird(ctx, gx2, gy2, 7, t, i * 4, "rgba(255,255,255,0.75)");
            }
            // Skattkista pa stranden
            drawGroundProp(ctx, Math.max(400, viewW * 0.45), GROUND_Y, "chest", "rgba(90,55,20,0.7)");
            // Avlagsen o med palm
            const islandX = viewW * 0.22;
            ctx.fillStyle = "rgba(180,160,100,0.5)";
            ctx.beginPath();
            ctx.ellipse(islandX, GROUND_Y - 3, 40, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(80,50,15,0.6)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(islandX, GROUND_Y - 5);
            ctx.lineTo(islandX + 5, GROUND_Y - 35);
            ctx.stroke();
            ctx.fillStyle = "rgba(50,110,40,0.6)";
            ctx.beginPath();
            ctx.ellipse(islandX - 8, GROUND_Y - 38, 10, 5, 0.3, 0, Math.PI * 2);
            ctx.ellipse(islandX + 14, GROUND_Y - 38, 10, 5, -0.3, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case "autumn": {
            drawJaggedSilhouette(ctx, GROUND_Y - 20, 70, 180, 220, "rgba(60,30,10,0.6)", 0.045);
            const ax = Math.max(340, viewW * 0.66);
            ctx.save();
            ctx.translate(ax, GROUND_Y);
            ctx.rotate(Math.sin(t * 0.35) * 0.03);
            ctx.strokeStyle = "rgba(50,30,15,0.8)";
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -90);
            ctx.stroke();
            ctx.fillStyle = "rgba(200,110,40,0.75)";
            ctx.beginPath();
            ctx.arc(0, -110, 50, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Ytterligare tva svajande trad i olika storlekar
            const extraTrees = [
                { x: Math.max(420, viewW * 0.5), h: 70, r: 38, color: "rgba(220,140,50,0.7)" },
                { x: Math.max(500, viewW * 0.58), h: 55, r: 30, color: "rgba(180,90,40,0.7)" },
            ];
            for (const tr of extraTrees) {
                ctx.save();
                ctx.translate(tr.x, GROUND_Y);
                ctx.rotate(Math.sin(t * 0.4 + tr.x) * 0.025);
                ctx.strokeStyle = "rgba(50,30,15,0.8)";
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -tr.h);
                ctx.stroke();
                ctx.fillStyle = tr.color;
                ctx.beginPath();
                ctx.arc(0, -tr.h - tr.r * 0.4, tr.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Pumpor och svampar pa marken
            drawGroundProp(ctx, Math.max(400, viewW * 0.46), GROUND_Y, "pumpkin", "#d9720f");
            drawGroundProp(ctx, Math.max(460, viewW * 0.53), GROUND_Y, "mushroom", "#c94a3a");
            drawGroundProp(ctx, Math.max(520, viewW * 0.6), GROUND_Y, "mushroom", "#e8dcc0");
            break;
        }
        case "savanna": {
            drawJaggedSilhouette(ctx, GROUND_Y - 10, 30, 70, 200, "rgba(60,45,15,0.5)", 0.05);
            // Stor lagt staende sol med varmedis
            ctx.save();
            ctx.shadowColor = "rgba(255,220,140,0.8)";
            ctx.shadowBlur = 30;
            ctx.fillStyle = "rgba(255,225,150,0.85)";
            ctx.beginPath();
            ctx.arc(viewW * 0.78, viewH * 0.22, 34, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Faglar i V-formation
            for (let i = 0; i < 5; i++) {
                const spd = 14;
                const lead = ((t * spd) % (viewW + 200)) - 100;
                const bx2 = lead - Math.abs(i - 2) * 22;
                const by2 = viewH * 0.16 + Math.abs(i - 2) * 12;
                drawBird(ctx, bx2, by2, 8, t, i, "rgba(40,30,15,0.7)");
            }
            // Akaciatrad med platt krona
            for (let k = 0; k < 2; k++) {
                const ax = Math.max(340, viewW * (0.55 + k * 0.2));
                ctx.save();
                ctx.strokeStyle = "rgba(50,35,15,0.7)";
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(ax, GROUND_Y);
                ctx.lineTo(ax, GROUND_Y - 55);
                ctx.stroke();
                ctx.fillStyle = "rgba(70,90,40,0.7)";
                ctx.beginPath();
                ctx.ellipse(ax, GROUND_Y - 62, 46, 14, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Giraffsilhuett
            const gx = viewW * 0.35;
            ctx.fillStyle = "rgba(50,35,15,0.55)";
            ctx.fillRect(gx, GROUND_Y - 70, 8, 70);
            ctx.beginPath();
            ctx.ellipse(gx + 12, GROUND_Y - 35, 20, 11, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(gx + 26, GROUND_Y - 45, 6, 45);
            ctx.fillRect(gx + 2, GROUND_Y - 78, 5, 14);
            break;
        }
        case "crystal": {
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 50, 140, 200, "rgba(30,10,60,0.6)", 0.045);
            // Jattekristaller som reser sig ur marken, glodande
            const cCols = ["#5ff2e0", "#a06fff", "#ff6fd0"];
            // Antalet skalar med skarmbredden - fast 5 st lamnade hogra halvan tom
            // pa breda skarmar.
            const nCrystals = Math.ceil(viewW / 160) + 1;
            for (let i = 0; i < nCrystals; i++) {
                const cx = i * 160 + 80 - ((distance * 0.06) % 160);
                if (cx < -60 || cx > viewW + 60)
                    continue;
                const h = 70 + (i % 3) * 55;
                const w = 16 + (i % 2) * 10;
                ctx.save();
                ctx.globalAlpha = 0.7;
                ctx.shadowColor = cCols[i % 3];
                ctx.shadowBlur = 18;
                ctx.fillStyle = cCols[i % 3];
                ctx.beginPath();
                ctx.moveTo(cx, GROUND_Y);
                ctx.lineTo(cx - w, GROUND_Y - h * 0.6);
                ctx.lineTo(cx, GROUND_Y - h);
                ctx.lineTo(cx + w, GROUND_Y - h * 0.6);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            drawShootingStar(ctx, t, 18, 2, "rgba(150,255,240,0.9)", viewH * 0.1, viewH * 0.4);
            break;
        }
        case "bog": {
            drawJaggedSilhouette(ctx, GROUND_Y - 10, 40, 90, 220, "rgba(15,25,10,0.6)", 0.04);
            // Doda knotiga trad
            for (let k = 0; k < 3; k++) {
                const tx = Math.max(320, viewW * (0.3 + k * 0.25));
                ctx.save();
                ctx.strokeStyle = "rgba(20,30,15,0.7)";
                ctx.lineWidth = 6 - k;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(tx, GROUND_Y);
                ctx.lineTo(tx + 8, GROUND_Y - 90);
                ctx.moveTo(tx + 8, GROUND_Y - 60);
                ctx.lineTo(tx + 30, GROUND_Y - 75);
                ctx.moveTo(tx + 8, GROUND_Y - 70);
                ctx.lineTo(tx - 16, GROUND_Y - 88);
                ctx.stroke();
                ctx.restore();
            }
            for (let i = 0; i < 2; i++) {
                drawHangingVine(ctx, Math.max(380, viewW * (0.4 + i * 0.15)), 0, 60, t, i * 3, "rgba(20,40,10,0.5)");
            }
            // Glodande irrblossmoln (antal efter skarmbredd)
            const nWisps = Math.ceil(viewW / 220) + 1;
            for (let i = 0; i < nWisps; i++) {
                drawLantern(ctx, i * 220 + 60 - ((t * 10) % 220), GROUND_Y - 30 - (i % 3) * 20, "rgba(150,255,120,0.9)", t, i * 2);
            }
            ctx.save();
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = "#7a9a6a";
            const fo = (t * 4) % 220;
            for (let x = -fo; x < viewW; x += 220) {
                ctx.beginPath();
                ctx.ellipse(x, GROUND_Y - 5, 100, 12, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            break;
        }
        case "bamboo": {
            // Tata bamburor i flera parallax-lager
            for (let layer = 0; layer < 2; layer++) {
                const col = layer === 0 ? "rgba(40,70,25,0.4)" : "rgba(60,100,35,0.6)";
                const spacing = 34 + layer * 8;
                const off = (distance * (0.03 + layer * 0.03)) % spacing;
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = 7 - layer * 2;
                for (let bx = -spacing; bx < viewW + spacing; bx += spacing) {
                    const x = bx - off + Math.sin(bx) * 4;
                    ctx.beginPath();
                    ctx.moveTo(x, GROUND_Y);
                    ctx.lineTo(x + Math.sin(t * 0.5 + bx) * 6, GROUND_Y - 150 - (bx % 3) * 20);
                    ctx.stroke();
                }
                ctx.restore();
            }
            for (let i = 0; i < 3; i++) {
                drawFlutterfly(ctx, ((t * (6 + i * 2) + i * 350) % (viewW + 100)) - 50, viewH * 0.4 + i * 30, 6, t, i * 4, "rgba(255,255,255,0.7)");
            }
            // Pandasilhuett vid en bambustam
            const px = viewW * 0.4;
            ctx.fillStyle = "rgba(240,240,240,0.5)";
            ctx.beginPath();
            ctx.arc(px, GROUND_Y - 18, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(20,20,20,0.5)";
            ctx.beginPath();
            ctx.arc(px - 10, GROUND_Y - 28, 5, 0, Math.PI * 2);
            ctx.arc(px + 10, GROUND_Y - 28, 5, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case "reef": {
            drawJaggedSilhouette(ctx, GROUND_Y - 5, 15, 45, 130, "rgba(255,150,180,0.4)", 0.06);
            // Korallformationer pa botten
            const coralCols = ["rgba(255,110,150,0.6)", "rgba(255,180,90,0.6)", "rgba(180,120,255,0.6)"];
            const nCorals = Math.ceil(viewW / 150) + 1; // tack hela bredden
            for (let i = 0; i < nCorals; i++) {
                const cx = i * 150 + 50 - ((distance * 0.05) % 150);
                ctx.save();
                ctx.strokeStyle = coralCols[i % 3];
                ctx.lineWidth = 6;
                ctx.lineCap = "round";
                for (let b = -1; b <= 1; b++) {
                    ctx.beginPath();
                    ctx.moveTo(cx, GROUND_Y);
                    ctx.quadraticCurveTo(cx + b * 18, GROUND_Y - 30, cx + b * 26, GROUND_Y - 55);
                    ctx.stroke();
                }
                ctx.restore();
            }
            for (let i = 0; i < 4; i++) {
                const spd = 14 + i * 5;
                const x = viewW + 70 - ((t * spd + i * 240) % (viewW + 280));
                drawFish(ctx, x, viewH * 0.28 + i * 45, 8 + (i % 2) * 3, [
                    "rgba(255,140,60,0.75)",
                    "rgba(120,200,255,0.75)",
                    "rgba(255,220,80,0.75)",
                    "rgba(255,120,200,0.75)",
                ][i], t, i * 2);
            }
            break;
        }
        case "steppe": {
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 40, 110, 240, "rgba(80,90,90,0.45)", 0.03);
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 30, 70, 200, "rgba(60,70,70,0.5)", 0.05);
            // Ullig mammut
            const mx = Math.max(360, viewW * 0.62);
            ctx.fillStyle = "rgba(70,55,40,0.65)";
            ctx.beginPath();
            ctx.ellipse(mx, GROUND_Y - 30, 40, 26, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(mx - 34, GROUND_Y - 34, 18, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(mx - 20, GROUND_Y - 20, 8, 20);
            ctx.fillRect(mx + 12, GROUND_Y - 20, 8, 20);
            // Snabel + bete
            ctx.strokeStyle = "rgba(70,55,40,0.65)";
            ctx.lineWidth = 7;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(mx - 48, GROUND_Y - 28);
            ctx.quadraticCurveTo(mx - 60, GROUND_Y - 12, mx - 52, GROUND_Y - 4);
            ctx.stroke();
            ctx.strokeStyle = "rgba(230,220,200,0.7)";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(mx - 46, GROUND_Y - 22);
            ctx.quadraticCurveTo(mx - 58, GROUND_Y - 6, mx - 40, GROUND_Y - 2);
            ctx.stroke();
            break;
        }
        case "volcanoisland": {
            drawJaggedSilhouette(ctx, GROUND_Y - 10, 20, 50, 200, "rgba(20,10,10,0.5)", 0.05);
            const vx = viewW * 0.7;
            ctx.fillStyle = "rgba(40,15,10,0.7)";
            ctx.beginPath();
            ctx.moveTo(vx - 60, GROUND_Y);
            ctx.lineTo(vx, GROUND_Y - 130);
            ctx.lineTo(vx + 60, GROUND_Y);
            ctx.closePath();
            ctx.fill();
            // Rok + lavafontan
            for (let i = 0; i < 4; i++) {
                const cyc = 12;
                const p = ((t * 0.5 + i * 3) % cyc) / cyc;
                ctx.save();
                ctx.globalAlpha = (1 - p) * 0.3;
                ctx.fillStyle = "rgba(80,70,70,0.8)";
                ctx.beginPath();
                ctx.arc(vx + Math.sin(i) * 10, GROUND_Y - 130 - p * 120, 10 + p * 24, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            ctx.save();
            ctx.shadowColor = "rgba(255,140,50,0.9)";
            ctx.shadowBlur = 24;
            ctx.fillStyle = "rgba(255,150,60,0.8)";
            ctx.beginPath();
            ctx.arc(vx, GROUND_Y - 128, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Palmer pa stranden
            for (let k = 0; k < 2; k++) {
                const px2 = viewW * (0.2 + k * 0.12);
                ctx.strokeStyle = "rgba(40,25,10,0.6)";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(px2, GROUND_Y);
                ctx.quadraticCurveTo(px2 + 8, GROUND_Y - 40, px2 + 4, GROUND_Y - 60);
                ctx.stroke();
                ctx.fillStyle = "rgba(40,90,40,0.6)";
                for (let f = -2; f <= 2; f++) {
                    ctx.beginPath();
                    ctx.ellipse(px2 + 4 + f * 8, GROUND_Y - 62, 16, 5, f * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;
        }
        case "canopy": {
            // Tak av lovverk upptill + solstralar
            ctx.save();
            ctx.fillStyle = "rgba(10,40,10,0.6)";
            ctx.fillRect(0, 0, viewW, 60);
            for (let x = 0; x < viewW; x += 50) {
                ctx.beginPath();
                ctx.arc(x, 60, 30, 0, Math.PI);
                ctx.fill();
            }
            ctx.restore();
            // Solstralar ner genom lovverket
            ctx.save();
            ctx.globalAlpha = 0.12;
            ctx.fillStyle = "#fff6c0";
            for (let i = 0; i < 4; i++) {
                const sx = (viewW / 4) * i + 60;
                ctx.beginPath();
                ctx.moveTo(sx, 40);
                ctx.lineTo(sx + 40, 40);
                ctx.lineTo(sx - 20, GROUND_Y);
                ctx.lineTo(sx - 80, GROUND_Y);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
            for (let i = 0; i < 3; i++) {
                drawHangingVine(ctx, viewW * (0.2 + i * 0.3), 55, 90, t, i * 2, "rgba(30,70,20,0.6)");
            }
            for (let i = 0; i < 3; i++) {
                drawFlutterfly(ctx, ((t * (7 + i * 2) + i * 320) % (viewW + 100)) - 50, viewH * 0.4 + i * 35, 7, t, i * 3, ["rgba(255,200,80,0.75)", "rgba(255,120,180,0.75)", "rgba(140,220,255,0.75)"][i]);
            }
            break;
        }
        case "saltflat": {
            drawJaggedSilhouette(ctx, GROUND_Y - 5, 10, 25, 260, "rgba(150,170,170,0.35)", 0.03);
            // Spegelblank yta med reflekterad sol
            ctx.save();
            ctx.shadowColor = "rgba(255,240,220,0.6)";
            ctx.shadowBlur = 25;
            ctx.fillStyle = "rgba(255,245,225,0.8)";
            ctx.beginPath();
            ctx.arc(viewW * 0.7, viewH * 0.22, 24, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = "rgba(255,245,225,0.8)";
            ctx.beginPath();
            ctx.ellipse(viewW * 0.7, GROUND_Y + 10, 18, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Salt-polygonmonster pa marken
            ctx.save();
            ctx.strokeStyle = "rgba(180,190,190,0.3)";
            ctx.lineWidth = 1;
            const po = (distance * 0.5) % 60;
            for (let x = -po; x < viewW; x += 60) {
                ctx.beginPath();
                ctx.moveTo(x, GROUND_Y + 20);
                ctx.lineTo(x + 30, GROUND_Y + 8);
                ctx.lineTo(x + 60, GROUND_Y + 20);
                ctx.stroke();
            }
            ctx.restore();
            drawDriftingClouds(ctx, t, "rgba(255,255,255,0.4)", 3, viewH * 0.18, 0.9, 6);
            break;
        }
        case "mangrove": {
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 50, 150, 200, "rgba(10,25,15,0.6)", 0.045);
            // Mangrovetrad med rotben ovan vattenlinjen
            for (let k = 0; k < 2; k++) {
                const mx = Math.max(340, viewW * (0.4 + k * 0.25));
                ctx.save();
                ctx.strokeStyle = "rgba(25,45,20,0.7)";
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.moveTo(mx, GROUND_Y - 70);
                ctx.lineTo(mx, GROUND_Y);
                ctx.stroke();
                ctx.lineWidth = 3;
                for (let r = -2; r <= 2; r++) {
                    if (r === 0)
                        continue;
                    ctx.beginPath();
                    ctx.moveTo(mx, GROUND_Y - 40);
                    ctx.quadraticCurveTo(mx + r * 14, GROUND_Y - 15, mx + r * 22, GROUND_Y);
                    ctx.stroke();
                }
                ctx.fillStyle = "rgba(30,70,25,0.6)";
                ctx.beginPath();
                ctx.arc(mx, GROUND_Y - 82, 30, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            for (let i = 0; i < 3; i++) {
                drawHangingVine(ctx, viewW * (0.2 + i * 0.3), 0, 70, t, i * 2, "rgba(20,40,15,0.6)");
            }
            break;
        }
        case "dragon": {
            drawJaggedSilhouette(ctx, GROUND_Y - 20, 60, 170, 210, "rgba(20,5,5,0.7)", 0.045);
            // Flygande drake med slagande vingar och eldstrale
            const dgx = ((t * 30) % (viewW + 300)) - 150;
            const dgy = viewH * 0.25 + Math.sin(t) * 20;
            ctx.save();
            ctx.fillStyle = "rgba(20,5,5,0.8)";
            ctx.beginPath();
            ctx.ellipse(dgx, dgy, 26, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            const wf = Math.sin(t * 5) * 0.6;
            ctx.beginPath();
            ctx.moveTo(dgx, dgy);
            ctx.quadraticCurveTo(dgx - 20, dgy - 30 - wf * 20, dgx - 40, dgy);
            ctx.quadraticCurveTo(dgx - 20, dgy + 6, dgx, dgy);
            ctx.fill();
            // Lang hals + huvud
            ctx.strokeStyle = "rgba(20,5,5,0.8)";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(dgx + 22, dgy - 2);
            ctx.lineTo(dgx + 42, dgy - 10);
            ctx.stroke();
            // Eldstrale
            if (Math.sin(t * 2) > 0.6) {
                ctx.save();
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = "rgba(255,140,40,0.8)";
                ctx.beginPath();
                ctx.moveTo(dgx + 44, dgy - 10);
                ctx.lineTo(dgx + 80, dgy - 16);
                ctx.lineTo(dgx + 80, dgy - 4);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            ctx.restore();
            drawShootingStar(ctx, t, 16, 1, "rgba(255,120,40,0.9)", viewH * 0.15, viewH * 0.4);
            break;
        }
        case "fairy": {
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 50, 140, 200, "rgba(40,20,60,0.5)", 0.045);
            drawRainbow(ctx, viewW * 0.7, viewH * 0.6, 70);
            // Lysande svampar och stora glodande sporer
            for (let k = 0; k < 3; k++) {
                const mx = viewW * (0.2 + k * 0.28);
                ctx.save();
                ctx.shadowColor = "rgba(255,180,255,0.8)";
                ctx.shadowBlur = 12;
                ctx.fillStyle = "rgba(200,120,255,0.7)";
                ctx.fillRect(mx - 3, GROUND_Y - 18, 6, 18);
                ctx.beginPath();
                ctx.ellipse(mx, GROUND_Y - 20, 14, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Svavande alvor (lysande prickar med sla)
            for (let i = 0; i < 6; i++) {
                const fx = ((t * 8 + i * 130) % (viewW + 60)) - 30;
                const fy = viewH * 0.4 + Math.sin(t * 2 + i) * 40;
                drawLantern(ctx, fx, fy, "rgba(255,230,150,0.9)", t, i * 3);
            }
            break;
        }
        case "troll": {
            drawJaggedSilhouette(ctx, GROUND_Y - 25, 110, 240, 260, "rgba(15,20,24,0.55)", 0.03);
            drawJaggedSilhouette(ctx, GROUND_Y - 25, 90, 220, 230, "rgba(20,25,28,0.7)", 0.045);
            // Stenbro over en klyfta
            const bx = viewW * 0.6;
            ctx.save();
            ctx.strokeStyle = "rgba(30,38,42,0.8)";
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.arc(bx, GROUND_Y + 30, 70, Math.PI * 1.15, Math.PI * 1.85);
            ctx.stroke();
            ctx.restore();
            // Sovande troll (rund sten med ogon)
            const trx = viewW * 0.3;
            ctx.fillStyle = "rgba(45,55,60,0.7)";
            ctx.beginPath();
            ctx.arc(trx, GROUND_Y - 20, 24, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(180,200,80,0.6)";
            ctx.beginPath();
            ctx.arc(trx - 8, GROUND_Y - 26, 3, 0, Math.PI * 2);
            ctx.arc(trx + 8, GROUND_Y - 26, 3, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case "unicorn": {
            drawJaggedSilhouette(ctx, GROUND_Y - 10, 20, 55, 220, "rgba(255,255,255,0.35)", 0.05);
            drawRainbow(ctx, viewW * 0.3, viewH * 0.55, 85);
            drawDriftingClouds(ctx, t, "rgba(255,245,255,0.5)", 3, viewH * 0.2, 1, 5);
            // Enhorning pa en kulle
            const ux = viewW * 0.68;
            ctx.save();
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.beginPath();
            ctx.ellipse(ux, GROUND_Y - 26, 22, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(ux - 20, GROUND_Y - 34, 8, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(ux - 14, GROUND_Y - 18, 5, 18);
            ctx.fillRect(ux + 12, GROUND_Y - 18, 5, 18);
            // Horn
            ctx.strokeStyle = "rgba(255,210,120,0.9)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(ux - 24, GROUND_Y - 42);
            ctx.lineTo(ux - 28, GROUND_Y - 56);
            ctx.stroke();
            // Man i regnbagsfarg
            ctx.strokeStyle = "rgba(255,150,220,0.7)";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(ux - 16, GROUND_Y - 38);
            ctx.quadraticCurveTo(ux - 4, GROUND_Y - 30, ux - 2, GROUND_Y - 20);
            ctx.stroke();
            ctx.restore();
            for (let i = 0; i < 2; i++) {
                drawFlutterfly(ctx, ((t * (6 + i * 2) + i * 300) % (viewW + 100)) - 50, viewH * 0.4 + i * 30, 6, t, i * 3, "rgba(255,200,230,0.8)");
            }
            break;
        }
        case "atlantis": {
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 60, 160, 210, "rgba(5,20,30,0.7)", 0.045);
            // Sjunkna ruiner: pelare i olika hojd (antal efter skarmbredd)
            const nPillars = Math.ceil(viewW / 150) + 1;
            for (let k = 0; k < nPillars; k++) {
                const cx = k * 150 + 60 - ((distance * 0.05) % 150);
                drawPillar(ctx, cx, GROUND_Y, 20, 60 + (k % 3) * 40, "rgba(30,80,90,0.55)", "rgba(40,100,110,0.6)");
            }
            // Ljusstralar uppifran vattenytan
            ctx.save();
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = "#aef0ff";
            for (let i = 0; i < 3; i++) {
                const sx = (viewW / 3) * i + ((t * 8) % viewW);
                ctx.beginPath();
                ctx.moveTo(sx, 0);
                ctx.lineTo(sx + 50, 0);
                ctx.lineTo(sx - 30, GROUND_Y);
                ctx.lineTo(sx - 90, GROUND_Y);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
            for (let i = 0; i < 3; i++) {
                const spd = 10 + i * 4;
                const x = viewW + 70 - ((t * spd + i * 260) % (viewW + 300));
                drawFish(ctx, x, viewH * 0.25 + i * 55, 8, "rgba(100,220,255,0.5)", t, i * 2);
            }
            break;
        }
        case "witch": {
            drawJaggedSilhouette(ctx, GROUND_Y - 20, 70, 190, 210, "rgba(20,10,25,0.7)", 0.045);
            // Full gron mane
            ctx.save();
            ctx.shadowColor = "rgba(150,255,120,0.7)";
            ctx.shadowBlur = 20;
            ctx.fillStyle = "rgba(200,255,170,0.6)";
            ctx.beginPath();
            ctx.arc(viewW * 0.78, viewH * 0.2, 24, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Flygande haxa pa kvast over manen
            const hx = ((t * 24) % (viewW + 200)) - 100;
            const hy = viewH * 0.22 + Math.sin(t * 1.5) * 12;
            ctx.save();
            ctx.strokeStyle = "rgba(20,10,25,0.85)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(hx - 18, hy);
            ctx.lineTo(hx + 18, hy - 4);
            ctx.stroke();
            ctx.fillStyle = "rgba(20,10,25,0.85)";
            ctx.beginPath();
            ctx.arc(hx, hy - 6, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(hx - 6, hy - 12);
            ctx.lineTo(hx + 6, hy - 12);
            ctx.lineTo(hx, hy - 24);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            for (let i = 0; i < 2; i++) {
                drawHangingVine(ctx, Math.max(380, viewW * (0.42 + i * 0.18)), 0, 65, t, i * 2, "rgba(30,15,35,0.6)");
            }
            break;
        }
        case "giant": {
            // Gigantiska stovel- och bordsben som forsvinner uppat
            for (let k = 0; k < 2; k++) {
                const lx = viewW * (0.35 + k * 0.4);
                ctx.fillStyle = "rgba(60,40,20,0.6)";
                ctx.fillRect(lx - 30, 0, 60, GROUND_Y);
                ctx.fillStyle = "rgba(75,52,28,0.6)";
                ctx.fillRect(lx - 30, 0, 12, GROUND_Y);
            }
            // Enormt bordsben mitt bak
            const gx = Math.max(360, viewW * 0.62);
            ctx.fillStyle = "rgba(50,34,16,0.5)";
            ctx.fillRect(gx - 10, 0, 20, GROUND_Y);
            // Jatteklot/leksak pa marken
            ctx.fillStyle = "rgba(200,60,60,0.5)";
            ctx.beginPath();
            ctx.arc(viewW * 0.2, GROUND_Y - 40, 40, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case "phoenix": {
            drawJaggedSilhouette(ctx, GROUND_Y - 20, 60, 160, 220, "rgba(60,15,10,0.6)", 0.045);
            // Stor fenix mitt i bild med glodande vingar
            const fx = viewW * 0.72;
            const fy = viewH * 0.28;
            const wf = Math.sin(t * 3) * 0.5;
            ctx.save();
            ctx.shadowColor = "rgba(255,140,50,0.9)";
            ctx.shadowBlur = 20;
            ctx.fillStyle = "rgba(255,160,60,0.7)";
            ctx.beginPath();
            ctx.ellipse(fx, fy, 12, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.quadraticCurveTo(fx - 50, fy - 30 - wf * 30, fx - 70, fy + 20);
            ctx.quadraticCurveTo(fx - 30, fy + 10, fx, fy);
            ctx.moveTo(fx, fy);
            ctx.quadraticCurveTo(fx + 50, fy - 30 - wf * 30, fx + 70, fy + 20);
            ctx.quadraticCurveTo(fx + 30, fy + 10, fx, fy);
            ctx.fill();
            // Stjart av eld
            ctx.beginPath();
            ctx.moveTo(fx, fy + 18);
            ctx.quadraticCurveTo(fx - 10, fy + 55, fx, fy + 75);
            ctx.quadraticCurveTo(fx + 10, fy + 55, fx, fy + 18);
            ctx.fill();
            ctx.restore();
            // Fallande glodande fjadrar
            drawFallingStreaks(ctx, t, viewW, viewH, 12, "rgba(255,160,70,0.5)", 20, 10);
            break;
        }
        case "moonbase": {
            // Stor jord som stiger over horisonten
            ctx.save();
            ctx.shadowColor = "rgba(80,140,220,0.5)";
            ctx.shadowBlur = 24;
            ctx.fillStyle = "rgba(60,110,180,0.7)";
            ctx.beginPath();
            ctx.arc(viewW * 0.75, viewH * 0.2, 34, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(80,160,110,0.6)";
            ctx.beginPath();
            ctx.arc(viewW * 0.75 - 10, viewH * 0.2 - 6, 10, 0, Math.PI * 2);
            ctx.arc(viewW * 0.75 + 12, viewH * 0.2 + 8, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Kupolbaser med antenner
            for (let k = 0; k < 2; k++) {
                const bx = viewW * (0.3 + k * 0.35);
                ctx.fillStyle = "rgba(150,160,175,0.6)";
                ctx.beginPath();
                ctx.arc(bx, GROUND_Y, 34, Math.PI, 0);
                ctx.fill();
                ctx.strokeStyle = "rgba(180,190,200,0.6)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(bx + 20, GROUND_Y - 22);
                ctx.lineTo(bx + 30, GROUND_Y - 45);
                ctx.stroke();
                ctx.fillStyle = "rgba(255,120,120,0.8)";
                ctx.beginPath();
                ctx.arc(bx + 30, GROUND_Y - 47, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            // Sma kratrar
            for (let i = 0; i < 4; i++) {
                ctx.fillStyle = "rgba(120,125,135,0.4)";
                ctx.beginPath();
                ctx.arc(viewW * (0.15 + i * 0.22), GROUND_Y - 6, 8 + i * 2, 0, Math.PI, false);
                ctx.fill();
            }
            break;
        }
        case "mars": {
            drawJaggedSilhouette(ctx, GROUND_Y - 10, 25, 60, 230, "rgba(80,25,15,0.5)", 0.04);
            // Tva manar
            ctx.save();
            ctx.fillStyle = "rgba(180,140,120,0.6)";
            ctx.beginPath();
            ctx.arc(viewW * 0.7, viewH * 0.16, 12, 0, Math.PI * 2);
            ctx.arc(viewW * 0.82, viewH * 0.24, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Landad rover
            const rx = viewW * 0.35;
            ctx.fillStyle = "rgba(200,190,180,0.6)";
            ctx.fillRect(rx - 16, GROUND_Y - 16, 32, 10);
            ctx.fillStyle = "rgba(60,50,45,0.7)";
            ctx.beginPath();
            ctx.arc(rx - 10, GROUND_Y - 4, 5, 0, Math.PI * 2);
            ctx.arc(rx + 10, GROUND_Y - 4, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(200,190,180,0.6)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(rx, GROUND_Y - 16);
            ctx.lineTo(rx + 8, GROUND_Y - 30);
            ctx.stroke();
            // Dammvirvel
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = "#c86a4a";
            const dwx = ((t * 20) % (viewW + 100)) - 50;
            ctx.beginPath();
            ctx.ellipse(dwx, GROUND_Y - 30, 14, 40, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;
        }
        case "cyber": {
            // Rutnat + neonstadssilhuett + regnande datastrommar
            ctx.save();
            ctx.strokeStyle = "rgba(0,255,200,0.12)";
            ctx.lineWidth = 1;
            const go = (distance * 0.3) % 40;
            for (let x = -go; x < viewW; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, GROUND_Y * 0.5);
                ctx.lineTo(x, GROUND_Y);
                ctx.stroke();
            }
            for (let y = GROUND_Y * 0.5; y < GROUND_Y; y += 20) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(viewW, y);
                ctx.stroke();
            }
            ctx.restore();
            drawTowerRow(ctx, GROUND_Y, "rgba(5,25,25,0.85)", 0.05, 40);
            // Neonkonturer pa nagra torn
            ctx.save();
            ctx.strokeStyle = "rgba(0,255,204,0.4)";
            ctx.lineWidth = 1.5;
            const scroll3 = distance * 0.05;
            const so = scroll3 % 90;
            const colBase3 = Math.floor(scroll3 / 90) * 90; // stabil form vid wrap
            for (let bx = -90; bx < viewW; bx += 90) {
                const x = bx - so;
                const h = 60 + Math.abs(Math.sin((bx + colBase3) * 0.03)) * 120;
                ctx.strokeRect(x, GROUND_Y - h, 40, h);
            }
            ctx.restore();
            drawFallingStreaks(ctx, t, viewW, viewH, 28, "rgba(0,255,200,0.25)", 45, 20);
            drawShootingStar(ctx, t, 14, 0, "rgba(0,255,200,0.9)", viewH * 0.1, viewH * 0.5);
            break;
        }
        case "time": {
            // Flera svavande urverk i olika storlek + drivande romerska siffror
            const clocks = [
                { x: 0.75, y: 0.25, r: 44 },
                { x: 0.35, y: 0.18, r: 26 },
                { x: 0.55, y: 0.4, r: 18 },
            ];
            for (const c of clocks) {
                const cx = viewW * c.x, cy = viewH * c.y, r = c.r;
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.strokeStyle = "rgba(255,224,160,0.9)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();
                for (let m = 0; m < 12; m++) {
                    const a = (Math.PI * 2 * m) / 12;
                    ctx.beginPath();
                    ctx.moveTo(cx + Math.cos(a) * r * 0.85, cy + Math.sin(a) * r * 0.85);
                    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(t * 2) * r * 0.6, cy + Math.sin(t * 2) * r * 0.6);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(t * 0.3) * r * 0.85, cy + Math.sin(t * 0.3) * r * 0.85);
                ctx.stroke();
                ctx.restore();
            }
            // (Det snurrande kugghjulet vid marken ar borttaget: det drog blicken
            // fran riktiga hinder och kunde sjalv misstas for ett.)
            break;
        }
        case "ufo": {
            // Flera ufon, ett med dragande ljusstrale mot marken
            for (let k = 0; k < 2; k++) {
                const ux = k === 0 ? viewW * 0.3 + Math.sin(t) * 30 : ((t * 30) % (viewW + 200)) - 100;
                const uy = viewH * (0.3 + k * 0.15);
                if (k === 0) {
                    ctx.save();
                    ctx.globalAlpha = 0.12;
                    ctx.fillStyle = "#7aff9a";
                    ctx.beginPath();
                    ctx.moveTo(ux - 12, uy);
                    ctx.lineTo(ux + 12, uy);
                    ctx.lineTo(ux + 40, GROUND_Y);
                    ctx.lineTo(ux - 40, GROUND_Y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
                ctx.save();
                ctx.fillStyle = "rgba(120,130,100,0.7)";
                ctx.beginPath();
                ctx.ellipse(ux, uy, 40, 12, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "rgba(150,255,170,0.6)";
                ctx.beginPath();
                ctx.arc(ux, uy - 7, 14, Math.PI, 0);
                ctx.fill();
                // Blinkande lampor under
                for (let i = -2; i <= 2; i++) {
                    ctx.globalAlpha = 0.4 + 0.4 * (0.5 + Math.sin(t * 4 + i) * 0.5);
                    ctx.fillStyle = "rgba(180,255,120,0.9)";
                    ctx.beginPath();
                    ctx.arc(ux + i * 12, uy + 4, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
            // Sadescirkel-monster pa marken
            ctx.save();
            ctx.strokeStyle = "rgba(120,255,150,0.3)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(viewW * 0.5, GROUND_Y - 4, 60, 12, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
            break;
        }
        case "junk": {
            // Drivande vrakdelar + ett stort trasigt rymdskepp
            const sx = viewW * 0.65;
            ctx.save();
            ctx.fillStyle = "rgba(80,75,65,0.6)";
            ctx.beginPath();
            ctx.ellipse(sx, viewH * 0.28, 60, 20, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(50,46,40,0.6)";
            ctx.fillRect(sx + 30, viewH * 0.28 - 6, 40, 12);
            ctx.restore();
            for (let i = 0; i < 6; i++) {
                const spd = 8 + i * 3;
                const ax = viewW + 40 - ((t * spd + i * 160) % (viewW + 220));
                const ay = viewH * (0.12 + (i % 4) * 0.1);
                ctx.save();
                ctx.translate(ax, ay);
                ctx.rotate(t * (0.5 + i * 0.2));
                ctx.fillStyle = "rgba(120,110,95,0.6)";
                ctx.fillRect(-5 - i, -3, 10 + i * 2, 6);
                ctx.restore();
            }
            break;
        }
        case "whalegrave": {
            drawJaggedSilhouette(ctx, GROUND_Y - 10, 30, 70, 220, "rgba(10,20,30,0.6)", 0.04);
            // Stort valskelett: ryggrad + revben som en katedral
            const wx = Math.max(360, viewW * 0.55);
            ctx.save();
            ctx.strokeStyle = "rgba(170,170,155,0.5)";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(wx - 90, GROUND_Y - 10);
            ctx.quadraticCurveTo(wx, GROUND_Y - 70, wx + 110, GROUND_Y - 20);
            ctx.stroke();
            ctx.lineWidth = 3;
            for (let i = 0; i < 8; i++) {
                const rx = wx - 80 + i * 24;
                const rh = 30 + Math.sin(i * 0.5) * 30;
                ctx.beginPath();
                ctx.moveTo(rx, GROUND_Y);
                ctx.quadraticCurveTo(rx + 6, GROUND_Y - rh, rx + 14, GROUND_Y);
                ctx.stroke();
            }
            // Skalle
            ctx.fillStyle = "rgba(170,170,155,0.45)";
            ctx.beginPath();
            ctx.ellipse(wx - 95, GROUND_Y - 14, 24, 14, 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Enstaka bubblor uppat
            for (let i = 0; i < 3; i++) {
                const bx = i * 200 + 60 - ((t * 6) % 200);
                const by = GROUND_Y - ((t * 20 + i * 80) % GROUND_Y);
                ctx.save();
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = "#9ac8e6";
                ctx.beginPath();
                ctx.arc(bx, by, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            break;
        }
        case "mermaid": {
            // Snackskalspalats med torn
            const px = viewW * 0.62;
            ctx.save();
            ctx.fillStyle = "rgba(255,200,235,0.5)";
            for (let k = -1; k <= 1; k++) {
                const tx = px + k * 55;
                const th = 90 - Math.abs(k) * 25;
                ctx.beginPath();
                ctx.moveTo(tx - 18, GROUND_Y);
                ctx.quadraticCurveTo(tx - 12, GROUND_Y - th, tx, GROUND_Y - th - 14);
                ctx.quadraticCurveTo(tx + 12, GROUND_Y - th, tx + 18, GROUND_Y);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
            // Ljusstralar
            ctx.save();
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = "#bff0ff";
            for (let i = 0; i < 3; i++) {
                const sx = (viewW / 3) * i + ((t * 6) % viewW);
                ctx.beginPath();
                ctx.moveTo(sx, 0);
                ctx.lineTo(sx + 40, 0);
                ctx.lineTo(sx - 30, GROUND_Y);
                ctx.lineTo(sx - 80, GROUND_Y);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
            for (let i = 0; i < 3; i++) {
                const spd = 12 + i * 4;
                const x = viewW + 60 - ((t * spd + i * 250) % (viewW + 280));
                drawFish(ctx, x, viewH * 0.3 + i * 50, 8, "rgba(255,190,230,0.6)", t, i * 2);
            }
            break;
        }
        case "egypt": {
            // Tre pyramider i djup + sfinx + het sol
            ctx.save();
            ctx.shadowColor = "rgba(255,230,160,0.8)";
            ctx.shadowBlur = 24;
            ctx.fillStyle = "rgba(255,235,180,0.85)";
            ctx.beginPath();
            ctx.arc(viewW * 0.5, viewH * 0.2, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            const pyrs = [
                { x: 0.65, s: 90, c: "rgba(90,55,20,0.7)" },
                { x: 0.78, s: 60, c: "rgba(75,45,15,0.6)" },
                { x: 0.4, s: 70, c: "rgba(80,50,18,0.65)" },
            ];
            for (const p of pyrs) {
                const px = viewW * p.x;
                ctx.fillStyle = p.c;
                ctx.beginPath();
                ctx.moveTo(px - p.s * 0.7, GROUND_Y);
                ctx.lineTo(px, GROUND_Y - p.s);
                ctx.lineTo(px + p.s * 0.7, GROUND_Y);
                ctx.closePath();
                ctx.fill();
                // solbelyst sida
                ctx.fillStyle = "rgba(255,230,170,0.15)";
                ctx.beginPath();
                ctx.moveTo(px, GROUND_Y - p.s);
                ctx.lineTo(px + p.s * 0.7, GROUND_Y);
                ctx.lineTo(px, GROUND_Y);
                ctx.closePath();
                ctx.fill();
            }
            // Sfinx
            const sfx = viewW * 0.2;
            ctx.fillStyle = "rgba(90,60,25,0.6)";
            ctx.fillRect(sfx - 30, GROUND_Y - 24, 60, 24);
            ctx.fillRect(sfx + 20, GROUND_Y - 44, 20, 24);
            break;
        }
        case "sakura": {
            // Flera korsbarstrad + pagod + fallande kronblad
            for (let k = 0; k < 2; k++) {
                const tx2 = viewW * (0.45 + k * 0.28);
                ctx.save();
                ctx.translate(tx2, GROUND_Y);
                ctx.rotate(Math.sin(t * 0.3 + k) * 0.02);
                ctx.strokeStyle = "rgba(60,35,30,0.8)";
                ctx.lineWidth = 8 - k * 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -80 + k * 15);
                ctx.stroke();
                ctx.fillStyle = "rgba(255,190,215,0.75)";
                ctx.beginPath();
                ctx.arc(0, -100 + k * 15, 45 - k * 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Pagod
            const pgx = viewW * 0.2;
            ctx.fillStyle = "rgba(140,40,50,0.5)";
            for (let r = 0; r < 3; r++) {
                const w = 46 - r * 12;
                ctx.fillRect(pgx - w / 2, GROUND_Y - 30 - r * 26, w, 16);
                ctx.beginPath();
                ctx.moveTo(pgx - w / 2 - 6, GROUND_Y - 30 - r * 26);
                ctx.lineTo(pgx, GROUND_Y - 40 - r * 26);
                ctx.lineTo(pgx + w / 2 + 6, GROUND_Y - 30 - r * 26);
                ctx.closePath();
                ctx.fill();
            }
            // Fallande kronblad
            for (let i = 0; i < 14; i++) {
                const seed = i * 90;
                const x = ((seed * 2.3) % viewW) + Math.sin(t + i) * 20;
                const y = ((t * 15 + seed) % (viewH + 40)) - 20;
                ctx.save();
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = "rgba(255,190,215,0.9)";
                ctx.beginPath();
                ctx.ellipse(x, y, 4, 2.5, i, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            break;
        }
        case "rome": {
            // Colosseum-bage + pelarrad
            const rx = Math.max(360, viewW * 0.62);
            ctx.fillStyle = "rgba(200,170,120,0.6)";
            ctx.fillRect(rx - 80, GROUND_Y - 90, 160, 90);
            ctx.fillStyle = "rgba(90,50,15,0.55)";
            for (let row = 0; row < 2; row++) {
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.arc(rx - 64 + i * 32, GROUND_Y - 30 - row * 34, 12, Math.PI, 0);
                    ctx.fill();
                    ctx.fillRect(rx - 76 + i * 32, GROUND_Y - 30 - row * 34, 4, 30);
                }
            }
            // Fristaende pelare framfor
            drawPillar(ctx, viewW * 0.25, GROUND_Y, 18, 80, "rgba(220,200,160,0.6)", "rgba(230,210,170,0.6)");
            drawPillar(ctx, viewW * 0.33, GROUND_Y, 18, 64, "rgba(215,195,155,0.55)", "rgba(225,205,165,0.55)");
            break;
        }
        case "medieval": {
            // Borg med flera torn + vajande flaggor
            const cx2 = viewW * 0.6;
            ctx.fillStyle = "rgba(90,80,60,0.65)";
            ctx.fillRect(cx2 - 60, GROUND_Y - 90, 120, 90);
            for (let k = -1; k <= 1; k += 2) {
                ctx.fillRect(cx2 + k * 60 - 10, GROUND_Y - 120, 20, 120);
                // tinnar
                for (let i = 0; i < 3; i++)
                    ctx.fillRect(cx2 + k * 60 - 10 + i * 8, GROUND_Y - 128, 5, 8);
            }
            // tinnar pa mittdelen
            for (let i = 0; i < 7; i++)
                ctx.fillRect(cx2 - 56 + i * 16, GROUND_Y - 98, 8, 8);
            drawWavingBanner(ctx, cx2 - 60, GROUND_Y - 120, 22, 14, "rgba(200,60,60,0.6)", t, 0);
            drawWavingBanner(ctx, cx2 + 60, GROUND_Y - 120, 22, 14, "rgba(60,90,200,0.6)", t, 2);
            // Marknadstalt framfor
            ctx.fillStyle = "rgba(180,80,60,0.5)";
            ctx.beginPath();
            ctx.moveTo(viewW * 0.22 - 30, GROUND_Y);
            ctx.lineTo(viewW * 0.22, GROUND_Y - 34);
            ctx.lineTo(viewW * 0.22 + 30, GROUND_Y);
            ctx.closePath();
            ctx.fill();
            break;
        }
        case "aztec": {
            // Stegpyramid + djungel runt + eldskal
            const ax = viewW * 0.62;
            ctx.fillStyle = "rgba(60,80,35,0.7)";
            for (let i = 0; i < 5; i++) {
                const w = 130 - i * 22;
                ctx.fillRect(ax - w / 2, GROUND_Y - 22 - i * 24, w, 24);
            }
            // trappa
            ctx.fillStyle = "rgba(40,55,20,0.6)";
            ctx.fillRect(ax - 8, GROUND_Y - 120, 16, 120);
            // eldskalar overst
            ctx.save();
            ctx.shadowColor = "rgba(255,140,40,0.9)";
            ctx.shadowBlur = 12;
            ctx.fillStyle = "rgba(255,150,50,0.8)";
            ctx.beginPath();
            ctx.arc(ax - 30, GROUND_Y - 124, 4 + Math.sin(t * 4) * 2, 0, Math.PI * 2);
            ctx.arc(ax + 30, GROUND_Y - 124, 4 + Math.cos(t * 4) * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            drawSwayingTree(ctx, viewW * 0.2, GROUND_Y, 50, 30, "rgba(40,30,15,0.6)", "rgba(30,70,25,0.6)", t, 1);
            break;
        }
        case "westtown": {
            // Rad av saloon-fasader + kaktusar + tumbleweed
            const facades = [
                { x: 0.55, w: 90, h: 70 },
                { x: 0.7, w: 70, h: 90 },
                { x: 0.82, w: 60, h: 60 },
            ];
            for (const f of facades) {
                const fx = viewW * f.x;
                ctx.fillStyle = "rgba(80,50,25,0.65)";
                ctx.fillRect(fx - f.w / 2, GROUND_Y - f.h, f.w, f.h);
                // falskt hogt tak
                ctx.beginPath();
                ctx.moveTo(fx - f.w / 2 - 6, GROUND_Y - f.h);
                ctx.lineTo(fx, GROUND_Y - f.h - 16);
                ctx.lineTo(fx + f.w / 2 + 6, GROUND_Y - f.h);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "rgba(120,90,50,0.5)";
                ctx.fillRect(fx - f.w / 2, GROUND_Y - f.h * 0.4, f.w, 4);
            }
            // Kaktus
            ctx.fillStyle = "rgba(50,90,40,0.6)";
            const kx = viewW * 0.22;
            ctx.fillRect(kx - 4, GROUND_Y - 40, 8, 40);
            ctx.fillRect(kx - 16, GROUND_Y - 30, 8, 16);
            ctx.fillRect(kx + 8, GROUND_Y - 36, 8, 18);
            // Tumbleweed
            const twx = viewW - ((t * 45) % (viewW + 60)) - 30;
            ctx.save();
            ctx.translate(twx, GROUND_Y - 10);
            ctx.rotate(t * 5);
            ctx.strokeStyle = "rgba(120,90,40,0.6)";
            ctx.lineWidth = 2;
            for (let a = 0; a < 6; a++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9);
                ctx.stroke();
            }
            ctx.restore();
            break;
        }
        case "citynight": {
            // Tva parallax-lager av skyskrapor med lysande fonster + fullmane
            ctx.save();
            ctx.fillStyle = "rgba(220,220,210,0.5)";
            ctx.beginPath();
            ctx.arc(viewW * 0.8, viewH * 0.18, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            drawTowerRow(ctx, GROUND_Y, "rgba(15,12,20,0.7)", 0.025, 100);
            const spacing2 = 140;
            const scroll2 = distance * 0.05;
            const offset2 = scroll2 % spacing2;
            // Seedas med varldskolumnen sa husen inte byter form/fonster vid wrap
            const colBase2 = Math.floor(scroll2 / spacing2) * spacing2;
            for (let bx3 = -spacing2; bx3 < viewW + spacing2; bx3 += spacing2) {
                const x = bx3 - offset2;
                const wcol = bx3 + colBase2;
                const h = 80 + Math.abs(Math.sin(wcol * 0.02)) * 130;
                ctx.fillStyle = "rgba(20,15,10,0.85)";
                ctx.fillRect(x, GROUND_Y - h, spacing2 * 0.6, h);
                ctx.fillStyle = "rgba(255,200,110,0.6)";
                let row = 0;
                for (let wy = GROUND_Y - h + 10; wy < GROUND_Y - 10; wy += 16) {
                    let col = 0;
                    for (let wx2 = x + 6; wx2 < x + spacing2 * 0.6 - 6; wx2 += 14) {
                        if (Math.sin(wcol * 0.7 + row * 2.1 + col * 1.3) > 0.3)
                            ctx.fillRect(wx2, wy, 6, 8);
                        col++;
                    }
                    row++;
                }
            }
            break;
        }
        case "carnival": {
            // Pariserhjul + tivolital + lyktslingor
            const fx2 = viewW * 0.68, fy2 = viewH * 0.38, fr = 50;
            ctx.save();
            ctx.translate(fx2, fy2);
            ctx.strokeStyle = "rgba(255,224,102,0.7)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, fr, 0, Math.PI * 2);
            ctx.stroke();
            ctx.save();
            ctx.rotate(t * 0.15);
            for (let i = 0; i < 8; i++) {
                const a = ((Math.PI * 2) / 8) * i;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(a) * fr, Math.sin(a) * fr);
                ctx.stroke();
                // gondoler
                ctx.fillStyle = ["#ff5a5a", "#5ab4ff", "#ffe066", "#6fce7a"][i % 4];
                ctx.beginPath();
                ctx.arc(Math.cos(a) * fr, Math.sin(a) * fr, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            ctx.restore();
            // Stod
            ctx.strokeStyle = "rgba(120,110,90,0.5)";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(fx2 - 20, GROUND_Y);
            ctx.lineTo(fx2, fy2);
            ctx.lineTo(fx2 + 20, GROUND_Y);
            ctx.stroke();
            // Tivolital
            const tx = viewW * 0.25;
            for (let k = -1; k <= 1; k += 2) {
                ctx.fillStyle = k < 0 ? "rgba(230,80,90,0.55)" : "rgba(240,240,240,0.5)";
                ctx.beginPath();
                ctx.moveTo(tx - 40, GROUND_Y);
                ctx.lineTo(tx, GROUND_Y - 40);
                ctx.lineTo(tx + 40, GROUND_Y);
                ctx.closePath();
                if (k < 0) {
                    ctx.save();
                    ctx.clip();
                    for (let s = -40; s < 40; s += 16) {
                        ctx.fillRect(tx + s, GROUND_Y - 40, 8, 40);
                    }
                    ctx.restore();
                }
                else
                    ctx.fill();
            }
            // Lyktslingor upptill
            ctx.save();
            for (let i = 0; i < 12; i++) {
                const lx = i * 110 + 40 - ((distance * 0.03) % 110);
                drawLantern(ctx, lx, 30 + Math.sin(i) * 8, ["rgba(255,90,90,0.9)", "rgba(90,180,255,0.9)", "rgba(255,224,102,0.9)"][i % 3], t, i);
            }
            ctx.restore();
            break;
        }
        case "circus": {
            // Stort randigt cirkustalt med flaggor + akrobat pa lina
            const cx3 = viewW * 0.6;
            ctx.save();
            ctx.fillStyle = "rgba(220,220,220,0.6)";
            ctx.beginPath();
            ctx.moveTo(cx3 - 90, GROUND_Y);
            ctx.quadraticCurveTo(cx3, GROUND_Y - 120, cx3 + 90, GROUND_Y);
            ctx.closePath();
            ctx.clip();
            for (let s = -90; s < 90; s += 24) {
                ctx.fillStyle =
                    Math.floor((s + 90) / 24) % 2 === 0 ? "rgba(200,60,70,0.6)" : "rgba(240,240,240,0.6)";
                ctx.fillRect(cx3 + s, GROUND_Y - 130, 24, 130);
            }
            ctx.restore();
            drawWavingBanner(ctx, cx3, GROUND_Y - 122, 18, 10, "rgba(255,224,102,0.8)", t, 0);
            // Sidotorn
            for (let k = -1; k <= 1; k += 2) {
                ctx.fillStyle = "rgba(200,60,70,0.5)";
                ctx.beginPath();
                ctx.moveTo(cx3 + k * 90 - 20, GROUND_Y);
                ctx.lineTo(cx3 + k * 90, GROUND_Y - 60);
                ctx.lineTo(cx3 + k * 90 + 20, GROUND_Y);
                ctx.closePath();
                ctx.fill();
            }
            // Lindansare langt fram
            ctx.strokeStyle = "rgba(0,0,0,0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(viewW * 0.1, viewH * 0.3);
            ctx.lineTo(viewW * 0.45, viewH * 0.3);
            ctx.stroke();
            const ax = viewW * (0.1 + ((t * 0.05) % 0.35));
            ctx.fillStyle = "rgba(30,30,40,0.6)";
            ctx.beginPath();
            ctx.arc(ax, viewH * 0.3 - 8, 5, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case "library": {
            // Vaggar av bokhyllor bakom + svavande bocker + stege
            const shelfCols = [
                "rgba(120,50,40,0.5)",
                "rgba(50,80,110,0.5)",
                "rgba(90,110,50,0.5)",
                "rgba(130,100,40,0.5)",
            ];
            const shelfScroll = distance * 0.05;
            const so = shelfScroll % 26;
            const shelfBase = Math.floor(shelfScroll / 26) * 26; // stabila bokfarger vid wrap
            for (let bx = -26; bx < viewW; bx += 26) {
                const x = bx - so;
                const wcol = bx + shelfBase;
                for (let row = 0; row < 4; row++) {
                    ctx.fillStyle = shelfCols[((Math.floor(wcol / 26) % 4) + 4 + row) % 4];
                    const bh = 60 + ((((wcol + row) % 3) + 3) % 3) * 12;
                    ctx.fillRect(x, GROUND_Y - 40 - row * 62 - bh + 60, 20, bh);
                }
            }
            // Horisontella hyllplan
            ctx.fillStyle = "rgba(50,30,15,0.5)";
            for (let row = 0; row < 4; row++)
                ctx.fillRect(0, GROUND_Y - 40 - row * 62, viewW, 5);
            // Svavande bocker
            for (let i = 0; i < 4; i++) {
                const bx = ((t * (10 + i * 3) + i * 200) % (viewW + 60)) - 30;
                const by = viewH * 0.3 + Math.sin(t + i) * 20;
                ctx.save();
                ctx.translate(bx, by);
                ctx.rotate(Math.sin(t + i) * 0.2);
                ctx.fillStyle = shelfCols[i % 4].replace("0.5", "0.8");
                ctx.fillRect(-8, -6, 16, 12);
                ctx.strokeStyle = "rgba(255,240,200,0.6)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, -6);
                ctx.lineTo(0, 6);
                ctx.stroke();
                ctx.restore();
            }
            break;
        }
        case "toyroom": {
            // Byggklossar, snurra, studsboll och en nallesilhuett
            const colors2 = ["#ff5a5a", "#5ab4ff", "#ffe066", "#6fce7a", "#ff8ad0"];
            for (let i = 0; i < 6; i++) {
                ctx.fillStyle = colors2[i % 5];
                const bx = viewW * 0.5 + i * 30;
                ctx.fillRect(bx, GROUND_Y - 26 - (i % 3) * 26, 24, 26);
                ctx.strokeStyle = "rgba(0,0,0,0.15)";
                ctx.lineWidth = 1;
                ctx.strokeRect(bx, GROUND_Y - 26 - (i % 3) * 26, 24, 26);
            }
            // Snurra
            ctx.save();
            ctx.translate(viewW * 0.25, GROUND_Y - 16);
            ctx.rotate(t * 6);
            ctx.fillStyle = "rgba(255,90,140,0.7)";
            ctx.beginPath();
            ctx.moveTo(0, -16);
            ctx.lineTo(12, 6);
            ctx.lineTo(-12, 6);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            // Studsande boll
            const ballx = viewW * 0.4;
            const bally = GROUND_Y - Math.abs(Math.sin(t * 3)) * 90 - 10;
            ctx.fillStyle = "rgba(90,180,255,0.8)";
            ctx.beginPath();
            ctx.arc(ballx, bally, 12, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case "storm": {
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 60, 160, 220, "rgba(10,15,25,0.7)", 0.045);
            // Morka valvande moln
            drawDriftingClouds(ctx, t, "rgba(30,35,50,0.6)", 4, viewH * 0.15, 1.3, 8);
            const flashCycle = 5;
            const fp = (t % flashCycle) / flashCycle;
            if (fp < 0.06) {
                ctx.save();
                ctx.globalAlpha = (1 - fp / 0.06) * 0.45;
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, viewW, viewH);
                ctx.restore();
                // Blixt-zigzag
                ctx.save();
                ctx.strokeStyle = "rgba(255,255,220,0.9)";
                ctx.lineWidth = 2;
                const lx = viewW * (0.3 + (Math.floor(t / flashCycle) % 3) * 0.2);
                ctx.beginPath();
                ctx.moveTo(lx, viewH * 0.15);
                ctx.lineTo(lx - 15, viewH * 0.3);
                ctx.lineTo(lx + 8, viewH * 0.35);
                ctx.lineTo(lx - 12, viewH * 0.55);
                ctx.stroke();
                ctx.restore();
            }
            drawFallingStreaks(ctx, t, viewW, viewH, 40, "rgba(200,220,255,0.4)", 70, 24);
            break;
        }
        case "tornado": {
            // Stor virvlande tromb + kringflygande skrap
            const tx3 = viewW * 0.6;
            ctx.save();
            ctx.fillStyle = "rgba(80,75,55,0.4)";
            ctx.beginPath();
            ctx.moveTo(tx3 - 12, GROUND_Y);
            ctx.quadraticCurveTo(tx3 - 60 + Math.sin(t) * 10, viewH * 0.4, tx3 - 70, 0);
            ctx.lineTo(tx3 + 70, 0);
            ctx.quadraticCurveTo(tx3 + 60 + Math.sin(t) * 10, viewH * 0.4, tx3 + 12, GROUND_Y);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "rgba(120,110,80,0.4)";
            ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
                const yy = GROUND_Y - i * (GROUND_Y / 8);
                const w = 12 + (GROUND_Y - yy) * 0.2;
                ctx.beginPath();
                ctx.ellipse(tx3 + Math.sin(t * 3 + i) * 8, yy, w, 6, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
            // Kringflygande skrap
            for (let i = 0; i < 5; i++) {
                const a = t * 3 + i * 1.3;
                const dx = tx3 + Math.cos(a) * (40 + i * 6);
                const dy = viewH * 0.4 + Math.sin(a) * 60 - i * 20;
                ctx.save();
                ctx.translate(dx, dy);
                ctx.rotate(a);
                ctx.fillStyle = "rgba(90,70,40,0.6)";
                ctx.fillRect(-5, -3, 10, 6);
                ctx.restore();
            }
            break;
        }
        case "fog": {
            // Flera dimlager + spokiga tradsilhuetter som skymtar
            for (let k = 0; k < 3; k++) {
                const tx = viewW * (0.25 + k * 0.28);
                ctx.save();
                ctx.globalAlpha = 0.3;
                drawSwayingTree(ctx, tx, GROUND_Y, 60 + k * 10, 32, "rgba(40,50,48,0.8)", "rgba(50,62,58,0.8)", t, k);
                ctx.restore();
            }
            for (let layer = 0; layer < 3; layer++) {
                ctx.save();
                ctx.globalAlpha = 0.18;
                ctx.fillStyle = "#c8d4d4";
                const fo2 = (t * (3 + layer * 2)) % 240;
                for (let x = -fo2; x < viewW; x += 240) {
                    ctx.beginPath();
                    ctx.ellipse(x, GROUND_Y - 15 - layer * 40, 130, 22, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
            break;
        }
        case "pizzeria": {
            // Pizzeria-fasad med neonskylt + rykande skorsten + flygande pizza
            const px2 = viewW * 0.6;
            ctx.fillStyle = "rgba(150,90,40,0.6)";
            ctx.fillRect(px2 - 60, GROUND_Y - 80, 120, 80);
            // Randig markis
            for (let s = -60; s < 60; s += 20) {
                ctx.fillStyle =
                    Math.floor((s + 60) / 20) % 2 === 0 ? "rgba(200,50,50,0.6)" : "rgba(240,240,240,0.6)";
                ctx.fillRect(px2 + s, GROUND_Y - 50, 20, 14);
            }
            // Neonskylt
            ctx.save();
            ctx.shadowColor = "rgba(255,90,90,0.9)";
            ctx.shadowBlur = 10;
            ctx.strokeStyle = "rgba(255,120,120,0.9)";
            ctx.lineWidth = 3;
            ctx.strokeRect(px2 - 26, GROUND_Y - 74, 52, 18);
            ctx.restore();
            // Rykande skorsten
            for (let i = 0; i < 3; i++) {
                const cyc = (t * 0.5 + i * 2.5) % 9;
                const p3 = cyc / 9;
                ctx.save();
                ctx.globalAlpha = (1 - p3) * 0.3;
                ctx.fillStyle = "rgba(255,255,255,0.6)";
                ctx.beginPath();
                ctx.arc(px2 + 40, GROUND_Y - 85 - p3 * 90, 6 + p3 * 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Flygande pizza-skiva
            const pzx = ((t * 40) % (viewW + 80)) - 40;
            ctx.save();
            ctx.translate(pzx, viewH * 0.25);
            ctx.rotate(t * 3);
            ctx.fillStyle = "rgba(240,200,120,0.8)";
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(220,60,40,0.8)";
            ctx.beginPath();
            ctx.arc(-4, -3, 2, 0, Math.PI * 2);
            ctx.arc(4, 2, 2, 0, Math.PI * 2);
            ctx.arc(0, 5, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;
        }
        case "orchard": {
            // Rad av frukttrad + fallande blad + korg med frukt
            for (let i = 0; i < 3; i++) {
                const ox = viewW * (0.45 + i * 0.18);
                ctx.save();
                ctx.translate(ox, GROUND_Y);
                ctx.rotate(Math.sin(t * 0.4 + i) * 0.015);
                ctx.strokeStyle = "rgba(80,50,20,0.8)";
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -70);
                ctx.stroke();
                ctx.fillStyle = "rgba(120,180,60,0.75)";
                ctx.beginPath();
                ctx.arc(0, -95, 40, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "rgba(230,50,50,0.85)";
                for (let f = 0; f < 5; f++) {
                    const fa = f * 1.3;
                    ctx.beginPath();
                    ctx.arc(Math.cos(fa) * 22, -95 + Math.sin(fa) * 18, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
            // Fallande blad
            for (let i = 0; i < 10; i++) {
                const seed = i * 80;
                const x = ((seed * 2.1) % viewW) + Math.sin(t + i) * 18;
                const y = ((t * 14 + seed) % (viewH + 40)) - 20;
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "rgba(200,120,50,0.9)";
                ctx.beginPath();
                ctx.ellipse(x, y, 4, 2, i, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            break;
        }
        case "icecream": {
            // Glasstrutar och en stor glassmaskin + strossel
            const ix2 = viewW * 0.6;
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.fillRect(ix2 - 45, GROUND_Y - 80, 90, 80);
            // Tre virvlade glassklickar pa taket
            const flav = ["rgba(255,150,200,0.7)", "rgba(150,220,255,0.7)", "rgba(180,255,180,0.7)"];
            for (let k = -1; k <= 1; k++) {
                ctx.fillStyle = flav[k + 1];
                ctx.beginPath();
                ctx.arc(ix2 + k * 26, GROUND_Y - 86, 14, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(ix2 + k * 26, GROUND_Y - 74);
                ctx.lineTo(ix2 + k * 26 - 10, GROUND_Y - 90);
                ctx.lineTo(ix2 + k * 26 + 10, GROUND_Y - 90);
                ctx.closePath();
                ctx.fill();
            }
            // Stralkastare-strossel
            drawFallingStreaks(ctx, t, viewW, viewH, 22, "rgba(255,160,200,0.5)", 22, 6);
            break;
        }
        case "spring": {
            // Blomsteräng, fjarilar, regnbage och drivande moln
            drawDriftingClouds(ctx, t, "rgba(255,255,255,0.5)", 3, viewH * 0.2, 1, 5);
            drawRainbow(ctx, viewW * 0.72, viewH * 0.55, 80);
            const fcols = [
                "rgba(255,150,190,0.75)",
                "rgba(255,230,110,0.75)",
                "rgba(190,150,255,0.75)",
                "rgba(255,255,255,0.75)",
            ];
            for (let i = 0; i < 6; i++) {
                const fx = viewW * (0.15 + i * 0.13);
                drawGroundProp(ctx, fx, GROUND_Y, "flower", fcols[i % 4]);
            }
            for (let i = 0; i < 3; i++) {
                drawFlutterfly(ctx, ((t * (7 + i * 2) + i * 300) % (viewW + 100)) - 50, viewH * 0.42 + i * 25, 7, t, i * 3, ["rgba(255,140,190,0.8)", "rgba(140,210,255,0.8)", "rgba(255,220,120,0.8)"][i]);
            }
            break;
        }
        case "beach": {
            // Palmer, sol, segelbat pa vagorna, sandslott
            ctx.save();
            ctx.shadowColor = "rgba(255,240,180,0.7)";
            ctx.shadowBlur = 24;
            ctx.fillStyle = "rgba(255,245,200,0.9)";
            ctx.beginPath();
            ctx.arc(viewW * 0.8, viewH * 0.2, 28, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            for (let k = 0; k < 2; k++) {
                const px3 = viewW * (0.18 + k * 0.1);
                ctx.strokeStyle = "rgba(90,60,25,0.6)";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(px3, GROUND_Y);
                ctx.quadraticCurveTo(px3 + 10, GROUND_Y - 40, px3 + 6, GROUND_Y - 70);
                ctx.stroke();
                ctx.fillStyle = "rgba(60,130,50,0.6)";
                for (let f = -2; f <= 2; f++) {
                    ctx.beginPath();
                    ctx.ellipse(px3 + 6 + f * 8, GROUND_Y - 72, 16, 6, f * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            // Segelbat
            const bx = ((t * 14) % (viewW + 100)) - 50;
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.beginPath();
            ctx.moveTo(bx, viewH * 0.42);
            ctx.lineTo(bx, viewH * 0.32);
            ctx.lineTo(bx + 18, viewH * 0.42);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "rgba(120,70,40,0.7)";
            ctx.fillRect(bx - 12, viewH * 0.42, 30, 5);
            // Sandslott
            ctx.fillStyle = "rgba(220,190,130,0.7)";
            const scx = viewW * 0.4;
            ctx.fillRect(scx - 20, GROUND_Y - 20, 40, 20);
            ctx.fillRect(scx - 24, GROUND_Y - 28, 8, 8);
            ctx.fillRect(scx + 16, GROUND_Y - 28, 8, 8);
            // Vagor
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            const wo = (t * 8) % 60;
            ctx.beginPath();
            for (let x = -wo; x <= viewW; x += 60) {
                ctx.moveTo(x, GROUND_Y - 8);
                ctx.quadraticCurveTo(x + 30, GROUND_Y - 14, x + 60, GROUND_Y - 8);
            }
            ctx.stroke();
            ctx.restore();
            break;
        }
        case "newyear": {
            // Stadssiluett + fyrverkerier + fallande gnistor
            drawTowerRow(ctx, GROUND_Y, "rgba(20,15,35,0.7)", 0.03, 20);
            drawFirework(ctx, viewW * 0.3, viewH * 0.25, t, 5, 0, "rgba(255,120,190,0.95)");
            drawFirework(ctx, viewW * 0.6, viewH * 0.2, t, 5, 2.2, "rgba(120,220,255,0.95)");
            drawFirework(ctx, viewW * 0.8, viewH * 0.3, t, 5, 3.8, "rgba(255,230,120,0.95)");
            drawFirework(ctx, viewW * 0.45, viewH * 0.15, t, 5, 1.2, "rgba(150,255,180,0.95)");
            drawFallingStreaks(ctx, t, viewW, viewH, 20, "rgba(255,220,150,0.5)", 18, 8);
            break;
        }
        case "artgallery": {
            // Vaggmalningar/tavlor i ramar pa vaggen + spotlights
            const colors3 = ["#ff5a5a", "#5ab4ff", "#ffe066", "#6fce7a", "#a06fff"];
            const paintScroll = distance * 0.05;
            const fo = paintScroll % 160;
            // Tavlans motiv foljer sin varldskolumn sa den inte byter utseende
            // varje gang offseten slar runt.
            const paintBase = Math.floor(paintScroll / 160);
            for (let bx = -160; bx < viewW + 160; bx += 160) {
                const x = bx - fo;
                const idx = ((((bx / 160 + paintBase) % 5) + 5) % 5) | 0;
                ctx.fillStyle = "rgba(40,30,20,0.5)";
                ctx.fillRect(x, GROUND_Y - 130, 90, 90);
                ctx.fillStyle = colors3[idx];
                ctx.save();
                ctx.globalAlpha = 0.5;
                if (idx % 2 === 0) {
                    ctx.beginPath();
                    ctx.arc(x + 45, GROUND_Y - 85, 26, 0, Math.PI * 2);
                    ctx.fill();
                }
                else {
                    ctx.fillRect(x + 20, GROUND_Y - 115, 50, 60);
                }
                ctx.restore();
                // Spotlight
                ctx.save();
                ctx.globalAlpha = 0.08;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.moveTo(x + 45, GROUND_Y - 140);
                ctx.lineTo(x + 10, GROUND_Y - 40);
                ctx.lineTo(x + 80, GROUND_Y - 40);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            break;
        }
        case "disco": {
            // Discokula med roterande ljusstralar + rutig dansgolv-glow
            const dx3 = viewW * 0.5, dy3 = viewH * 0.22, dr = 26;
            // Strålar
            for (let i = 0; i < 6; i++) {
                const a = t * 0.8 + ((Math.PI * 2) / 6) * i;
                ctx.save();
                ctx.globalAlpha = 0.09;
                ctx.fillStyle = ["#ff2fb0", "#00ffcc", "#ffe066", "#5ab4ff", "#ff5a5a", "#a06fff"][i];
                ctx.beginPath();
                ctx.moveTo(dx3, dy3);
                ctx.lineTo(dx3 + Math.cos(a) * 500, dy3 + Math.sin(a) * 500 + 200);
                ctx.lineTo(dx3 + Math.cos(a + 0.15) * 500, dy3 + Math.sin(a + 0.15) * 500 + 200);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            // Kula
            ctx.save();
            ctx.translate(dx3, dy3);
            ctx.rotate(t * 0.5);
            ctx.fillStyle = "rgba(200,200,215,0.7)";
            ctx.beginPath();
            ctx.arc(0, 0, dr, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            for (let ry = -dr; ry < dr; ry += 6)
                for (let rx = -dr; rx < dr; rx += 6) {
                    if (rx * rx + ry * ry < dr * dr && (Math.floor(rx / 6) + Math.floor(ry / 6)) % 2 === 0)
                        ctx.fillRect(rx, ry, 5, 5);
                }
            ctx.restore();
            // Blinkande dansgolvsrutor
            ctx.save();
            ctx.globalAlpha = 0.12;
            for (let gx = 0; gx < viewW; gx += 50) {
                ctx.fillStyle = Math.sin(gx * 0.1 + t * 3) > 0 ? "#ff2fb0" : "#00ffcc";
                ctx.fillRect(gx, GROUND_Y - 6, 46, 6);
            }
            ctx.restore();
            break;
        }
        case "shadow": {
            // Enfargat: lager av svarta silhuetter mot vitt ljus + ensam siluettfigur
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 100, 240, 260, "rgba(0,0,0,0.4)", 0.02);
            drawJaggedSilhouette(ctx, GROUND_Y - 15, 60, 170, 210, "rgba(0,0,0,0.7)", 0.05);
            // Doda trad i siluett
            for (let k = 0; k < 3; k++) {
                const tx = viewW * (0.25 + k * 0.28);
                ctx.save();
                ctx.strokeStyle = "rgba(0,0,0,0.85)";
                ctx.lineWidth = 5 - k;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(tx, GROUND_Y);
                ctx.lineTo(tx + 5, GROUND_Y - 80);
                ctx.moveTo(tx + 5, GROUND_Y - 55);
                ctx.lineTo(tx + 26, GROUND_Y - 70);
                ctx.moveTo(tx + 5, GROUND_Y - 62);
                ctx.lineTo(tx - 16, GROUND_Y - 78);
                ctx.stroke();
                ctx.restore();
            }
            drawShootingStar(ctx, t, 15, 2, "rgba(255,255,255,0.95)", viewH * 0.1, viewH * 0.4);
            break;
        }
        case "dream": {
            // Svavande oar, drivande moln, sovande mane och stjarnstoft
            drawDriftingClouds(ctx, t, "rgba(255,255,255,0.4)", 4, viewH * 0.25, 1.1, 4);
            for (let k = 0; k < 3; k++) {
                drawFloatingIsland(ctx, viewW * (0.25 + k * 0.28), viewH * (0.5 + (k % 2) * 0.1), 70 - k * 12, "rgba(180,160,255,0.5)", "rgba(90,70,150,0.5)", t + k);
            }
            // Sovande mane
            const cx4 = viewW * 0.72, cy4 = viewH * 0.22;
            ctx.save();
            ctx.shadowColor = "rgba(255,240,200,0.6)";
            ctx.shadowBlur = 20;
            ctx.fillStyle = "rgba(255,245,210,0.7)";
            ctx.beginPath();
            ctx.arc(cx4, cy4, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            ctx.strokeStyle = "rgba(120,90,150,0.6)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx4 - 6, cy4 - 2, 5, 0.2, Math.PI - 0.2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx4 + 8, cy4 - 2, 5, 0.2, Math.PI - 0.2);
            ctx.stroke();
            // Stjarnstoft-stig
            for (let i = 0; i < 20; i++) {
                const sx = ((i * 90 + t * 20) % (viewW + 40)) - 20;
                const sy = viewH * 0.4 + Math.sin(i + t) * 40;
                ctx.save();
                ctx.globalAlpha = 0.3 + 0.4 * (0.5 + Math.sin(t * 3 + i) * 0.5);
                ctx.fillStyle = "rgba(255,255,220,0.9)";
                ctx.beginPath();
                ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            break;
        }
    }
}
