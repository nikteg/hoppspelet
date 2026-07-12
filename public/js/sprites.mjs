"use strict";

  function drawStarShape(ctx, cx, cy, outerR, innerR) {
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

  // Mynten forrenderas till en offscreen-canvas per tema (motiven ar statiska
  // - snurret ar bara en x-skalning vid ritning). Da betalar vi shadowBlur och
  // gradienter EN gang per tema i stallet for per mynt och frame, och kan
  // darfor kosta pa oss detaljerade motiv.
  const coinSpriteCache = new Map();

  function getCoinSprite(theme, r) {
    const key = theme.key + ":" + r;
    let sprite = coinSpriteCache.get(key);
    if (!sprite) {
      sprite = document.createElement("canvas");
      const size = Math.ceil(r * 5); // plats for glow och former utanfor radien
      sprite.width = size;
      sprite.height = size;
      const octx = sprite.getContext("2d");
      octx.translate(size / 2, size / 2);
      drawCoinDesign(octx, r, theme);
      coinSpriteCache.set(key, sprite);
    }
    return sprite;
  }

  function drawCoin(ctx, coin, theme, t) {
    const spin = Math.max(0.15, Math.abs(Math.cos(t * 3 + coin.phase)));
    const sprite = getCoinSprite(theme, coin.r);
    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.scale(spin, 1);
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
    ctx.restore();
  }

  // Ritar sjalva myntmotivet centrerat kring (0,0). Kors ENDAST mot
  // offscreen-canvasen i getCoinSprite, sa composite-tricks (t.ex.
  // destination-out for manskaran) ar sakra har.
  function drawCoinDesign(ctx, r, theme) {
    switch (theme.key) {
      case "ocean":
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.7)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(150,220,210,0.55)";
        ctx.beginPath();
        ctx.ellipse(0, r * 0.3, r * 1.3, r * 0.6, 0, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = "#eafdf6";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      case "jungle": {
        ctx.save();
        ctx.shadowColor = "rgba(255,220,80,0.8)";
        ctx.shadowBlur = 10;
        const bananaGrad = ctx.createLinearGradient(-r, -r, r, r);
        bananaGrad.addColorStop(0, "#fff2a8");
        bananaGrad.addColorStop(0.5, "#ffd93d");
        bananaGrad.addColorStop(1, "#e2a92b");
        // Skarformad kropp: ytterbage + flackare innerbage - tjock pa mitten
        // och avsmalnande mot tipparna, som en riktig banan.
        ctx.fillStyle = bananaGrad;
        ctx.beginPath();
        ctx.moveTo(-r * 1.15, r * 0.55);
        ctx.quadraticCurveTo(0, -r * 1.55, r * 1.1, -r * 0.5);
        ctx.lineTo(r * 1.0, -r * 0.32);
        ctx.quadraticCurveTo(0, -r * 0.35, -r * 1.02, r * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(140,90,10,0.8)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // Ridge-linje langs mitten for lite djup
        ctx.strokeStyle = "rgba(150,100,10,0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-r * 0.9, r * 0.32);
        ctx.quadraticCurveTo(0, -r * 0.95, r * 0.9, -r * 0.36);
        ctx.stroke();
        // Ljus glans langs ovansidan
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = r * 0.12;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-r * 0.45, -r * 0.35);
        ctx.quadraticCurveTo(-r * 0.05, -r * 0.75, r * 0.45, -r * 0.65);
        ctx.stroke();
        // Stjalk i ena anden, brun tipp i andra
        ctx.strokeStyle = "#6b4a1f";
        ctx.lineWidth = r * 0.16;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-r * 1.08, r * 0.46);
        ctx.lineTo(-r * 1.28, r * 0.6);
        ctx.stroke();
        ctx.fillStyle = "#6b4a1f";
        ctx.beginPath();
        ctx.arc(r * 1.08, -r * 0.5, r * 0.13, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "ice":
        ctx.save();
        ctx.shadowColor = "rgba(150,220,255,0.9)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#cdefff";
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.7, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r * 0.7, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      case "space":
        ctx.save();
        ctx.shadowColor = "rgba(255,255,200,0.9)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#fff6c8";
        drawStarShape(ctx, 0, 0, r, r * 0.45);
        ctx.fill();
        ctx.restore();
        break;
      case "desert":
        ctx.save();
        ctx.shadowColor = "rgba(255,220,120,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#e8c26a";
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.9, r * 0.7);
        ctx.lineTo(-r * 0.9, r * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(140,90,20,0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(0, r * 0.7);
        ctx.stroke();
        ctx.restore();
        break;
      case "sky":
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-r * 0.4, r * 0.15, r * 0.55, 0, Math.PI * 2);
        ctx.arc(r * 0.3, r * 0.1, r * 0.65, 0, Math.PI * 2);
        ctx.arc(0, -r * 0.3, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      case "neon":
        ctx.save();
        ctx.shadowColor = "rgba(0,255,255,0.9)";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#0ff0fc";
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.75, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r * 0.75, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#ff2fb0";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        break;
      case "haunted":
        ctx.save();
        ctx.shadowColor = "rgba(140,255,170,0.9)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "rgba(210,255,220,0.85)";
        ctx.beginPath();
        ctx.arc(0, -r * 0.2, r * 0.75, Math.PI, 0, false);
        ctx.lineTo(r * 0.75, r * 0.6);
        ctx.lineTo(r * 0.35, r * 0.3);
        ctx.lineTo(0, r * 0.6);
        ctx.lineTo(-r * 0.35, r * 0.3);
        ctx.lineTo(-r * 0.75, r * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#1a1a22";
        ctx.beginPath();
        ctx.arc(-r * 0.25, -r * 0.2, r * 0.12, 0, Math.PI * 2);
        ctx.arc(r * 0.25, -r * 0.2, r * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      case "viking":
        ctx.save();
        ctx.shadowColor = "rgba(200,230,255,0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#8a95a0";
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.85, r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e8eef2";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.6);
        ctx.lineTo(0, r * 0.6);
        ctx.moveTo(-r * 0.4, -r * 0.3);
        ctx.lineTo(r * 0.4, r * 0.3);
        ctx.stroke();
        ctx.restore();
        break;
      case "dino":
        ctx.save();
        ctx.shadowColor = "rgba(200,255,140,0.8)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#e9dfae";
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.75, r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(120,150,60,0.6)";
        ctx.beginPath();
        ctx.ellipse(-r * 0.2, -r * 0.3, r * 0.12, r * 0.18, 0.3, 0, Math.PI * 2);
        ctx.ellipse(r * 0.25, r * 0.1, r * 0.1, r * 0.15, -0.2, 0, Math.PI * 2);
        ctx.ellipse(-r * 0.1, r * 0.4, r * 0.1, r * 0.14, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      case "candy":
        ctx.save();
        ctx.shadowColor = "rgba(255,150,200,0.9)";
        ctx.shadowBlur = 10;
        for (let i = 0; i < 3; i++) {
          ctx.strokeStyle = i % 2 === 0 ? "#e0325c" : "#ffffff";
          ctx.lineWidth = r * 0.4;
          ctx.beginPath();
          ctx.arc(0, 0, r * (1 - i * 0.32), 0, Math.PI * 1.5);
          ctx.stroke();
        }
        ctx.restore();
        break;
      case "robot":
        ctx.save();
        ctx.shadowColor = "rgba(255,190,60,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#e8b840";
        drawGearSpike(ctx, { x: -r, y: -r, w: r * 2, h: r * 2 });
        ctx.restore();
        break;
      case "autumn":
        ctx.save();
        ctx.shadowColor = "rgba(230,150,60,0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#8a5a2a";
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.55, r * 0.6, r * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#c98a4a";
        ctx.beginPath();
        ctx.ellipse(0, r * 0.15, r * 0.6, r * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      case "lava":
      case "volcanoisland": {
        // Glodande magmaklump med mork, sprucken skorpa
        ctx.save();
        ctx.shadowColor = "rgba(255,140,40,0.9)";
        ctx.shadowBlur = 14;
        const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
        g.addColorStop(0, "#fff1b8");
        g.addColorStop(0.55, theme.key === "lava" ? "#ff9a3a" : "#ff8a4a");
        g.addColorStop(1, "#7a2410");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(40,10,5,0.7)";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-r * 0.5, -r * 0.3); ctx.lineTo(-r * 0.05, -r * 0.05); ctx.lineTo(-r * 0.3, r * 0.45);
        ctx.moveTo(r * 0.15, -r * 0.55); ctx.lineTo(r * 0.3, 0); ctx.lineTo(r * 0.6, r * 0.2);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "pirate":
      case "atlantis": {
        // Dublon - blank hos piraterna, argad/patinerad i det sjunkna Atlantis
        const gold = theme.key === "pirate";
        ctx.save();
        ctx.shadowColor = gold ? "rgba(255,210,80,0.9)" : "rgba(90,220,230,0.8)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = gold ? "#d9a92f" : "#3fae9a";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = gold ? "#8a641a" : "#1f6a5a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.42); ctx.lineTo(0, r * 0.42);
        ctx.moveTo(-r * 0.42, 0); ctx.lineTo(r * 0.42, 0);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "savanna":
      case "aztec": {
        // Solskiva med stralar; aztek-varianten far ett praglat ansikte
        const az = theme.key === "aztec";
        ctx.save();
        ctx.shadowColor = "rgba(255,220,90,0.9)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = az ? "#ffd85a" : "#ffc44a";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a - 0.18) * r * 0.62, Math.sin(a - 0.18) * r * 0.62);
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          ctx.lineTo(Math.cos(a + 0.18) * r * 0.62, Math.sin(a + 0.18) * r * 0.62);
          ctx.closePath();
          ctx.fill();
        }
        if (az) {
          ctx.fillStyle = "rgba(90,50,10,0.8)";
          ctx.beginPath();
          ctx.arc(-r * 0.18, -r * 0.1, r * 0.08, 0, Math.PI * 2);
          ctx.arc(r * 0.18, -r * 0.1, r * 0.08, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(-r * 0.14, r * 0.14, r * 0.28, r * 0.08);
        }
        ctx.restore();
        break;
      }
      case "crystal":
      case "fairy": {
        // Slipad adelsten med vita facettlinjer
        const col = theme.key === "crystal" ? "#5ff2e0" : "#ffe08a";
        ctx.save();
        ctx.shadowColor = col;
        ctx.shadowBlur = 14;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(0, -r); ctx.lineTo(r * 0.6, -r * 0.2); ctx.lineTo(r * 0.35, r);
        ctx.lineTo(-r * 0.35, r); ctx.lineTo(-r * 0.6, -r * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -r); ctx.lineTo(-r * 0.15, r * 0.2);
        ctx.moveTo(r * 0.6, -r * 0.2); ctx.lineTo(-r * 0.15, r * 0.2);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "bog":
      case "mangrove":
      case "fog": {
        // Irrbloss - sjalvlysande klot med liten svans
        const col = theme.key === "fog" ? "rgba(220,235,225,0.95)" : "rgba(170,255,140,0.95)";
        ctx.save();
        ctx.shadowColor = col;
        ctx.shadowBlur = 16;
        const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 0.9);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(0.5, col);
        g.addColorStop(1, "rgba(140,200,140,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.ellipse(r * 0.3, r * 0.55, r * 0.16, r * 0.32, 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "bamboo":
      case "canopy": {
        // Blad med mittnerv
        ctx.save();
        ctx.shadowColor = "rgba(200,255,150,0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = theme.key === "bamboo" ? "#a9d98a" : "#8aca5a";
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(r * 0.9, -r * 0.2, 0, r);
        ctx.quadraticCurveTo(-r * 0.9, -r * 0.2, 0, -r);
        ctx.fill();
        ctx.strokeStyle = "rgba(40,90,20,0.7)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.85); ctx.lineTo(0, r * 0.85);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "reef":
      case "mermaid": {
        // Snacka med rafflor
        ctx.save();
        ctx.shadowColor = "rgba(255,200,225,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = theme.key === "reef" ? "#ff9ab8" : "#ffb8e0";
        ctx.beginPath();
        ctx.arc(0, -r * 0.1, r * 0.8, Math.PI, 0);
        ctx.lineTo(0, r * 0.85);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 1.3;
        for (let k = -2; k <= 2; k++) {
          ctx.beginPath();
          ctx.moveTo(0, r * 0.8);
          ctx.lineTo(k * r * 0.35, -r * 0.5);
          ctx.stroke();
        }
        ctx.restore();
        break;
      }
      case "steppe": {
        // Barnstenklump med urtidsinsekt
        ctx.save();
        ctx.shadowColor = "rgba(255,190,90,0.8)";
        ctx.shadowBlur = 10;
        const g = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 1, 0, 0, r * 0.85);
        g.addColorStop(0, "#ffd98a");
        g.addColorStop(1, "#b86a1f");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(60,30,10,0.75)";
        ctx.beginPath();
        ctx.ellipse(0, r * 0.05, r * 0.16, r * 0.24, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "saltflat": {
        // Vita saltkristaller i tva facetter
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#ffffff";
        ctx.save();
        ctx.rotate(-0.2);
        ctx.fillRect(-r * 0.5, -r * 0.7, r * 0.7, r * 1.3);
        ctx.restore();
        ctx.save();
        ctx.rotate(0.35);
        ctx.fillStyle = "#e4efec";
        ctx.fillRect(-r * 0.15, -r * 0.55, r * 0.55, r * 1.1);
        ctx.restore();
        ctx.restore();
        break;
      }
      case "dragon": {
        // Eldslaga med het karna
        ctx.save();
        ctx.shadowColor = "rgba(255,110,40,0.9)";
        ctx.shadowBlur = 14;
        const g = ctx.createLinearGradient(0, r, 0, -r);
        g.addColorStop(0, "#ff5a2a");
        g.addColorStop(1, "#ffd94a");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, r * 0.9);
        ctx.quadraticCurveTo(-r * 0.9, r * 0.1, 0, -r);
        ctx.quadraticCurveTo(r * 0.5, -r * 0.1, r * 0.35, r * 0.3);
        ctx.quadraticCurveTo(r * 0.6, r * 0.55, 0, r * 0.9);
        ctx.fill();
        ctx.fillStyle = "#fff2b0";
        ctx.beginPath();
        ctx.ellipse(0, r * 0.35, r * 0.22, r * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "phoenix": {
        // Glodande fenixfjader
        ctx.save();
        ctx.rotate(0.5);
        ctx.shadowColor = "rgba(255,170,60,0.9)";
        ctx.shadowBlur = 12;
        const g = ctx.createLinearGradient(0, -r, 0, r);
        g.addColorStop(0, "#ffcf6a");
        g.addColorStop(1, "#ff6a3a");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(r * 0.7, -r * 0.2, 0, r);
        ctx.quadraticCurveTo(-r * 0.7, -r * 0.2, 0, -r);
        ctx.fill();
        ctx.strokeStyle = "rgba(120,40,10,0.7)";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.85); ctx.lineTo(0, r * 0.9);
        for (let k = 1; k <= 3; k++) {
          const yy = -r * 0.55 + k * r * 0.35;
          ctx.moveTo(0, yy); ctx.lineTo(-r * 0.4, yy + r * 0.18);
          ctx.moveTo(0, yy); ctx.lineTo(r * 0.4, yy + r * 0.18);
        }
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "troll": {
        // Runsten
        ctx.save();
        ctx.shadowColor = "rgba(180,220,220,0.7)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#8a9aa0";
        ctx.beginPath();
        ctx.moveTo(-r * 0.6, r * 0.8); ctx.lineTo(-r * 0.7, -r * 0.4); ctx.lineTo(0, -r * 0.9);
        ctx.lineTo(r * 0.65, -r * 0.35); ctx.lineTo(r * 0.6, r * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#2c3a40";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.5); ctx.lineTo(0, r * 0.45);
        ctx.moveTo(0, -r * 0.15); ctx.lineTo(r * 0.3, -r * 0.45);
        ctx.moveTo(0, r * 0.05); ctx.lineTo(r * 0.3, -r * 0.25);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "unicorn": {
        // Vit stjarna med rosa inre kontur och pastellglow
        ctx.save();
        ctx.shadowColor = "rgba(255,190,230,0.95)";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#ffffff";
        drawStarShape(ctx, 0, 0, r, r * 0.45);
        ctx.fill();
        ctx.strokeStyle = "#ff9ad0";
        ctx.lineWidth = 1.6;
        drawStarShape(ctx, 0, 0, r * 0.6, r * 0.27);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "witch": {
        // Trolldrycksflaska med bubbla
        ctx.save();
        ctx.shadowColor = "rgba(140,230,90,0.9)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "rgba(60,180,80,0.9)";
        ctx.beginPath();
        ctx.arc(0, r * 0.25, r * 0.62, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(90,150,110,0.9)";
        ctx.fillRect(-r * 0.16, -r * 0.85, r * 0.32, r * 0.55);
        ctx.fillStyle = "#d9c9a0";
        ctx.fillRect(-r * 0.22, -r * 0.98, r * 0.44, r * 0.2);
        ctx.fillStyle = "rgba(220,255,190,0.8)";
        ctx.beginPath();
        ctx.arc(-r * 0.2, r * 0.1, r * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "giant":
      case "mars": {
        // Kantig klump - guldnugget hos jatten, rod malmsten pa Mars
        const gold = theme.key === "giant";
        ctx.save();
        ctx.shadowColor = gold ? "rgba(255,220,120,0.9)" : "rgba(255,150,90,0.8)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = gold ? "#e8b33a" : "#c05a2e";
        ctx.beginPath();
        ctx.moveTo(-r * 0.8, r * 0.4); ctx.lineTo(-r * 0.5, -r * 0.5); ctx.lineTo(r * 0.15, -r * 0.8);
        ctx.lineTo(r * 0.8, -r * 0.2); ctx.lineTo(r * 0.6, r * 0.55); ctx.lineTo(-r * 0.2, r * 0.75);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = gold ? "#fff0b0" : "rgba(60,20,10,0.5)";
        ctx.beginPath();
        ctx.arc(-r * 0.15, -r * 0.15, r * 0.16, 0, Math.PI * 2);
        ctx.arc(r * 0.3, r * 0.15, r * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "moonbase": {
        // Fullmane med kratrar
        ctx.save();
        ctx.shadowColor = "rgba(220,230,255,0.8)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#dfe4ee";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(120,130,150,0.6)";
        ctx.beginPath();
        ctx.arc(-r * 0.25, -r * 0.15, r * 0.2, 0, Math.PI * 2);
        ctx.arc(r * 0.25, r * 0.3, r * 0.14, 0, Math.PI * 2);
        ctx.arc(r * 0.2, -r * 0.4, r * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "cyber": {
        // Kretskortschip med ben och lysande karna
        ctx.save();
        ctx.shadowColor = "rgba(0,255,200,0.9)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#0a2a2a";
        ctx.fillRect(-r * 0.6, -r * 0.6, r * 1.2, r * 1.2);
        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 1.6;
        ctx.strokeRect(-r * 0.6, -r * 0.6, r * 1.2, r * 1.2);
        ctx.beginPath();
        for (let k = -1; k <= 1; k++) {
          ctx.moveTo(k * r * 0.35, -r * 0.6); ctx.lineTo(k * r * 0.35, -r * 0.95);
          ctx.moveTo(k * r * 0.35, r * 0.6); ctx.lineTo(k * r * 0.35, r * 0.95);
        }
        ctx.stroke();
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(-r * 0.2, -r * 0.2, r * 0.4, r * 0.4);
        ctx.restore();
        break;
      }
      case "time": {
        // Timglas med rinnande sand
        ctx.save();
        ctx.shadowColor = "rgba(255,220,150,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#8a6a3a";
        ctx.fillRect(-r * 0.7, -r * 0.95, r * 1.4, r * 0.2);
        ctx.fillRect(-r * 0.7, r * 0.75, r * 1.4, r * 0.2);
        ctx.fillStyle = "rgba(255,240,200,0.35)";
        ctx.beginPath();
        ctx.moveTo(-r * 0.55, -r * 0.75); ctx.lineTo(r * 0.55, -r * 0.75); ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.moveTo(-r * 0.55, r * 0.75); ctx.lineTo(r * 0.55, r * 0.75); ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#ffd98a";
        ctx.beginPath();
        ctx.moveTo(-r * 0.3, -r * 0.75); ctx.lineTo(r * 0.3, -r * 0.75); ctx.lineTo(0, -r * 0.15);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-r * 0.4, r * 0.75); ctx.lineTo(r * 0.4, r * 0.75); ctx.lineTo(0, r * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      }
      case "ufo": {
        // Litet tefat med kupol och lampor
        ctx.save();
        ctx.shadowColor = "rgba(140,255,160,0.9)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "rgba(150,255,180,0.85)";
        ctx.beginPath();
        ctx.arc(0, -r * 0.15, r * 0.45, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "#9aa8b0";
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.95, r * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#7aff9a";
        for (let k = -1; k <= 1; k++) {
          ctx.beginPath();
          ctx.arc(k * r * 0.5, r * 0.08, r * 0.09, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        break;
      }
      case "junk": {
        // Sexkantig mutter
        ctx.save();
        ctx.shadowColor = "rgba(240,210,170,0.7)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#a99a80";
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = Math.PI / 6 + (i * Math.PI) / 3;
          const x = Math.cos(a) * r * 0.85, y = Math.sin(a) * r * 0.85;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(20,18,14,0.85)";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "whalegrave": {
        // Korslagt ben
        ctx.save();
        ctx.rotate(-0.6);
        ctx.shadowColor = "rgba(200,230,255,0.6)";
        ctx.shadowBlur = 8;
        ctx.strokeStyle = "#e8e4d4";
        ctx.lineWidth = r * 0.32;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.55); ctx.lineTo(0, r * 0.55);
        ctx.stroke();
        ctx.fillStyle = "#e8e4d4";
        for (const e of [-1, 1]) {
          for (const s of [-1, 1]) {
            ctx.beginPath();
            ctx.arc(s * r * 0.22, e * r * 0.62, r * 0.22, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
        break;
      }
      case "egypt": {
        // Ankh i guld
        ctx.save();
        ctx.shadowColor = "rgba(255,220,120,0.9)";
        ctx.shadowBlur = 10;
        ctx.strokeStyle = "#ffd85a";
        ctx.lineWidth = r * 0.22;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.5, r * 0.3, r * 0.38, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.1); ctx.lineTo(0, r * 0.9);
        ctx.moveTo(-r * 0.55, r * 0.05); ctx.lineTo(r * 0.55, r * 0.05);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "sakura":
      case "spring": {
        // Blomma med fem kronblad
        const petal = theme.key === "sakura" ? "#ffb0c8" : "#fff6e8";
        const center = theme.key === "sakura" ? "#ff7a9a" : "#ffd94a";
        ctx.save();
        ctx.shadowColor = "rgba(255,220,235,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = petal;
        for (let i = 0; i < 5; i++) {
          const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          ctx.beginPath();
          ctx.ellipse(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, r * 0.4, r * 0.28, a, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = center;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "rome": {
        // Denar med lagerkrans
        ctx.save();
        ctx.shadowColor = "rgba(240,230,210,0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#d9d2c0";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#6a8a4a";
        for (const s of [-1, 1]) {
          for (let k = 0; k < 4; k++) {
            const a = Math.PI / 2 - s * (0.4 + k * 0.36);
            ctx.beginPath();
            ctx.ellipse(Math.cos(a) * r * 0.58, Math.sin(a) * r * 0.58, r * 0.16, r * 0.09, a + Math.PI / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
        break;
      }
      case "medieval": {
        // Riddarskold med kors
        ctx.save();
        ctx.shadowColor = "rgba(230,220,190,0.7)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#b83a3a";
        ctx.beginPath();
        ctx.moveTo(-r * 0.7, -r * 0.7); ctx.lineTo(r * 0.7, -r * 0.7); ctx.lineTo(r * 0.7, r * 0.1);
        ctx.quadraticCurveTo(r * 0.7, r * 0.6, 0, r * 0.95);
        ctx.quadraticCurveTo(-r * 0.7, r * 0.6, -r * 0.7, r * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#f0e8d0";
        ctx.lineWidth = r * 0.16;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.55); ctx.lineTo(0, r * 0.7);
        ctx.moveTo(-r * 0.55, -r * 0.15); ctx.lineTo(r * 0.55, -r * 0.15);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "westtown": {
        // Sheriffstjarna
        ctx.save();
        ctx.shadowColor = "rgba(255,210,130,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#d9a25a";
        drawStarShape(ctx, 0, 0, r, r * 0.5);
        ctx.fill();
        ctx.strokeStyle = "#7a4a20";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "citynight": {
        // Varmt gatlyktesken med ljusflare
        ctx.save();
        ctx.shadowColor = "rgba(255,200,110,0.95)";
        ctx.shadowBlur = 16;
        const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 0.8);
        g.addColorStop(0, "#fff6d8");
        g.addColorStop(1, "#ffb84a");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,230,170,0.8)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -r); ctx.lineTo(0, r);
        ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "carnival": {
        // Rosa ballong med glans och snore
        ctx.save();
        ctx.shadowColor = "rgba(255,150,230,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#ff5ac0";
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.15, r * 0.65, r * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.ellipse(-r * 0.25, -r * 0.4, r * 0.16, r * 0.24, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(0, r * 0.65);
        ctx.quadraticCurveTo(r * 0.2, r * 0.85, 0, r * 1.05);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "circus":
      case "beach": {
        // Randig boll (rod/vit pa cirkusen, flerfargars badboll pa stranden)
        const cols = theme.key === "circus"
          ? ["#e0325c", "#ffffff"]
          : ["#ff5a5a", "#ffe24a", "#5ab4ff", "#ffffff"];
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = 10;
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = cols[i % cols.length];
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, r * 0.85, (Math.PI * 2 * i) / 6, (Math.PI * 2 * (i + 1)) / 6);
          ctx.closePath();
          ctx.fill();
        }
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "library": {
        // Bok med guldtitel
        ctx.save();
        ctx.rotate(-0.15);
        ctx.shadowColor = "rgba(230,210,160,0.7)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#7a3428";
        ctx.fillRect(-r * 0.7, -r * 0.9, r * 1.4, r * 1.8);
        ctx.fillStyle = "#a04a38";
        ctx.fillRect(-r * 0.7, -r * 0.9, r * 0.3, r * 1.8);
        ctx.strokeStyle = "#ffd98a";
        ctx.lineWidth = 1.4;
        ctx.strokeRect(-r * 0.25, -r * 0.6, r * 0.75, r * 0.5);
        ctx.beginPath();
        ctx.moveTo(-r * 0.2, r * 0.3); ctx.lineTo(r * 0.45, r * 0.3);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "toyroom": {
        // Tarning
        ctx.save();
        ctx.rotate(0.2);
        ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#ffffff";
        const s = r * 0.72;
        ctx.fillRect(-s, -s, s * 2, s * 2);
        ctx.fillStyle = "#e0325c";
        for (const p of [[-0.45, -0.45], [0.45, -0.45], [0, 0], [-0.45, 0.45], [0.45, 0.45]]) {
          ctx.beginPath();
          ctx.arc(p[0] * s * 1.2, p[1] * s * 1.2, r * 0.11, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        break;
      }
      case "storm": {
        // Blixt
        ctx.save();
        ctx.shadowColor = "rgba(255,230,120,0.95)";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#ffe066";
        ctx.beginPath();
        ctx.moveTo(r * 0.25, -r); ctx.lineTo(-r * 0.4, r * 0.15); ctx.lineTo(-r * 0.02, r * 0.15);
        ctx.lineTo(-r * 0.25, r); ctx.lineTo(r * 0.45, -r * 0.1); ctx.lineTo(r * 0.05, -r * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      }
      case "tornado": {
        // Fylld virveltratt med vindband och kringflygande skrap
        ctx.save();
        ctx.shadowColor = "rgba(230,225,170,0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#e8e0b0";
        ctx.strokeStyle = "#3a3520";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-r * 0.95, -r * 0.85);
        ctx.quadraticCurveTo(0, -r * 1.15, r * 0.95, -r * 0.85);
        ctx.quadraticCurveTo(r * 0.55, -r * 0.25, r * 0.3, r * 0.15);
        ctx.quadraticCurveTo(r * 0.18, r * 0.6, r * 0.05, r * 1.0);
        ctx.quadraticCurveTo(-r * 0.12, r * 0.5, -r * 0.28, r * 0.1);
        ctx.quadraticCurveTo(-r * 0.6, -r * 0.3, -r * 0.95, -r * 0.85);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Vindband tvars over tratten
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(90,82,40,0.55)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-r * 0.62, -r * 0.5);
        ctx.quadraticCurveTo(0, -r * 0.3, r * 0.6, -r * 0.52);
        ctx.moveTo(-r * 0.32, 0);
        ctx.quadraticCurveTo(0, r * 0.14, r * 0.32, -r * 0.02);
        ctx.moveTo(-r * 0.14, r * 0.5);
        ctx.quadraticCurveTo(0, r * 0.6, r * 0.15, r * 0.48);
        ctx.stroke();
        // Skrap som virvlar runt
        ctx.fillStyle = "#6a4a20";
        ctx.save();
        ctx.translate(-r * 1.05, -r * 0.15);
        ctx.rotate(0.5);
        ctx.fillRect(-r * 0.18, -r * 0.07, r * 0.36, r * 0.14);
        ctx.restore();
        ctx.beginPath();
        ctx.arc(r * 0.85, -r * 0.1, r * 0.09, 0, Math.PI * 2);
        ctx.arc(r * 0.6, r * 0.55, r * 0.07, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "pizzeria": {
        // Pizzaslice med salami
        ctx.save();
        ctx.rotate(0.3);
        ctx.shadowColor = "rgba(255,180,90,0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#f2c268";
        ctx.beginPath();
        ctx.moveTo(0, r);
        ctx.lineTo(-r * 0.62, -r * 0.62);
        ctx.quadraticCurveTo(0, -r * 0.95, r * 0.62, -r * 0.62);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#c9622a";
        ctx.lineWidth = r * 0.18;
        ctx.beginPath();
        ctx.moveTo(-r * 0.62, -r * 0.62);
        ctx.quadraticCurveTo(0, -r * 0.95, r * 0.62, -r * 0.62);
        ctx.stroke();
        ctx.fillStyle = "#c0392b";
        for (const p of [[-0.15, -0.35], [0.2, -0.1], [-0.05, 0.3]]) {
          ctx.beginPath();
          ctx.arc(p[0] * r, p[1] * r, r * 0.13, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        break;
      }
      case "orchard": {
        // Rott apple med blad
        ctx.save();
        ctx.shadowColor = "rgba(255,140,140,0.8)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#e0483a";
        ctx.beginPath();
        ctx.arc(-r * 0.25, r * 0.1, r * 0.55, 0, Math.PI * 2);
        ctx.arc(r * 0.25, r * 0.1, r * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#6a4a28";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.35); ctx.lineTo(0, -r * 0.8);
        ctx.stroke();
        ctx.fillStyle = "#5a8a2a";
        ctx.beginPath();
        ctx.ellipse(r * 0.25, -r * 0.7, r * 0.28, r * 0.14, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "icecream": {
        // Glasstrut med jordgubbskula
        ctx.save();
        ctx.shadowColor = "rgba(255,200,225,0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#e8b56a";
        ctx.beginPath();
        ctx.moveTo(-r * 0.5, -r * 0.05); ctx.lineTo(r * 0.5, -r * 0.05); ctx.lineTo(0, r);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(120,70,20,0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-r * 0.3, r * 0.25); ctx.lineTo(r * 0.1, -r * 0.02);
        ctx.moveTo(-r * 0.05, r * 0.6); ctx.lineTo(r * 0.32, r * 0.12);
        ctx.stroke();
        ctx.fillStyle = "#ffb0d0";
        ctx.beginPath();
        ctx.arc(0, -r * 0.4, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff0f8";
        ctx.beginPath();
        ctx.arc(-r * 0.15, -r * 0.55, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "newyear": {
        // Tomtebloss-stjarna med rosa gnistor
        ctx.save();
        ctx.shadowColor = "rgba(255,220,120,0.95)";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#ffe066";
        drawStarShape(ctx, 0, 0, r * 0.7, r * 0.32);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,150,180,0.9)";
        ctx.lineWidth = 1.4;
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8 + 0.4;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75);
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          ctx.stroke();
        }
        ctx.restore();
        break;
      }
      case "artgallery": {
        // Malarpalett med fargklickar
        ctx.save();
        ctx.shadowColor = "rgba(200,100,255,0.7)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#c9a072";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.arc(r * 0.35, r * 0.3, r * 0.2, 0, Math.PI * 2);
        ctx.fill();
        const dabs = [["#ff5a5a", -0.4, -0.35], ["#5ab4ff", 0.05, -0.5], ["#ffe066", 0.45, -0.15], ["#6fce7a", -0.5, 0.15]];
        for (const d of dabs) {
          ctx.fillStyle = d[0];
          ctx.beginPath();
          ctx.arc(d[1] * r, d[2] * r, r * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        break;
      }
      case "disco": {
        // Discokula med speglande rutor
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.95)";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#cfd6e0";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
        ctx.clip();
        ctx.strokeStyle = "rgba(60,70,90,0.6)";
        ctx.lineWidth = 1;
        for (let k = -2; k <= 2; k++) {
          ctx.beginPath();
          ctx.moveTo(k * r * 0.32, -r * 0.8); ctx.lineTo(k * r * 0.32, r * 0.8);
          ctx.moveTo(-r * 0.8, k * r * 0.32); ctx.lineTo(r * 0.8, k * r * 0.32);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fillRect(-r * 0.32, -r * 0.32, r * 0.3, r * 0.3);
        ctx.fillRect(r * 0.05, r * 0.05, r * 0.25, r * 0.25);
        ctx.restore();
        ctx.restore();
        break;
      }
      case "shadow": {
        // Morkt mynt med skarp vit kontur - passar den svartvita varlden
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.95)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "dream": {
        // Manskara med liten stjarna (destination-out ar sakert har -
        // designen ritas alltid mot sin egen offscreen-canvas)
        ctx.save();
        ctx.shadowColor = "rgba(255,240,255,0.9)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#fff0d8";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(r * 0.35, -r * 0.2, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#fff0d8";
        drawStarShape(ctx, r * 0.45, -r * 0.35, r * 0.22, r * 0.1);
        ctx.fill();
        ctx.restore();
        break;
      }
      default: {
        ctx.save();
        ctx.shadowColor = "rgba(255,210,80,0.9)";
        ctx.shadowBlur = 12;
        const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
        g.addColorStop(0, "#fff6c8");
        g.addColorStop(0.5, "#ffd54a");
        g.addColorStop(1, "#c98b1f");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
    }
  }

  function drawPlayer(ctx) {
    ctx.save();
    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
    ctx.rotate(player.rotation);
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(-player.w / 2, -player.h / 2, player.w, player.h);

    // ögon
    ctx.fillStyle = "#1b1f2a";
    ctx.fillRect(4, -8, 5, 5);
    ctx.fillRect(-player.w / 2 + 6, -8, 5, 5);

    // arga ögonbryn (vinklade linjer ovanför ögonen)
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

  function drawFloatingTexts(ctx) {
    for (const ft of floatingTexts) {
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

  function drawSeaUrchin(ctx, obs) {
    const cx = obs.x + obs.w / 2, cy = obs.y + obs.h / 2, r = Math.min(obs.w, obs.h) / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    const spikes = 10;
    for (let i = 0; i < spikes; i++) {
      const a = (Math.PI * 2 / spikes) * i;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5);
      ctx.lineTo(cx + Math.cos(a) * r * 1.2, cy + Math.sin(a) * r * 1.2);
      ctx.stroke();
    }
  }

  function drawVenusTrap(ctx, obs) {
    const cx = obs.x + obs.w / 2;
    const groundY = obs.y + obs.h;
    const headY = obs.y + obs.h * 0.42;   // dar de gapande kaftarna sitter
    const lobeR = obs.w * 0.52;
    const gape = 0.42;                      // hur mycket munnen gapar (radianer fran mittlinjen)
    // Latt "andning"/tuggning sa vaxten kanns levande
    const chew = Math.sin(performance.now() / 220 + obs.x * 0.05) * 0.12;
    const openAngle = gape + Math.max(0, chew);

    // ---- Stjalk med ett par blad ----
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

    // ---- Tva gapande kaftlober ----
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

    // Liten glodande "lockbete"-droppe i mitten av munnen
    ctx.fillStyle = "rgba(255,240,150,0.8)";
    ctx.beginPath();
    ctx.arc(cx, headY - lobeR * 0.35, obs.w * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawIcicleCluster(ctx, obs) {
    // Morkbla kontur - istapparna ar nastan vita, precis som isens mark
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

  function drawAsteroidChunk(ctx, obs) {
    // Ljus kontur + kratrar - stenen ar nastan lika mork som rymdmarken
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

  function drawCactus(ctx, obs) {
    // Saguarokaktus: rundade armar (tjocka streck med runda andar), ribbor,
    // taggar och en blomma pa toppen. Mork kontur ger tydlighet mot sanden.
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
    for (const [col, extra] of [["#142a0c", 3.5], ["#3f7d32", 0]]) {
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
    // Taggar
    ctx.strokeStyle = "#ffdf9b";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (const [tx, ty] of [[-0.18, 0.2], [0.18, 0.3], [-0.18, 0.45], [0.18, 0.62], [-0.18, 0.72]]) {
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

  function drawLollipop(ctx, obs) {
    // Stor snurrklubba pa pinne (candy)
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
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawGearSpike(ctx, obs) {
    // Kugghjul med varmgul kant och navring - stalgratt smalter annars in
    // i fabrikens morka mark.
    const cx = obs.x + obs.w / 2, cy = obs.y + obs.h / 2, r = Math.min(obs.w, obs.h) / 2;
    const teeth = 8;
    ctx.save();
    ctx.strokeStyle = "#ffc94a";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a1 = (Math.PI * 2 / teeth) * i;
      const a2 = a1 + (Math.PI * 2 / teeth) * 0.5;
      const x1 = cx + Math.cos(a1) * r, y1 = cy + Math.sin(a1) * r;
      const x2 = cx + Math.cos(a2) * r * 0.65, y2 = cy + Math.sin(a2) * r * 0.65;
      if (i === 0) ctx.moveTo(x1, y1); else ctx.lineTo(x1, y1);
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

  function drawFlameSpike(ctx, obs, theme) {
    // Fladdrande eldpelare (drak-/fenix-/vulkanteman)
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

  function drawCrystalSpike(ctx, obs, theme) {
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

  function drawAnchor(ctx, obs) {
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

  function drawObelisk(ctx, obs, theme) {
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
    ctx.moveTo(cx - obs.w * 0.08, obs.y + obs.h * 0.35); ctx.lineTo(cx + obs.w * 0.08, obs.y + obs.h * 0.35);
    ctx.moveTo(cx, obs.y + obs.h * 0.45); ctx.lineTo(cx, obs.y + obs.h * 0.6);
    ctx.moveTo(cx - obs.w * 0.08, obs.y + obs.h * 0.7); ctx.lineTo(cx + obs.w * 0.08, obs.y + obs.h * 0.7);
    ctx.stroke();
    ctx.restore();
  }

  function drawBrokenColumn(ctx, obs, theme) {
    // Avbruten antik kolonn (rom). Mork kontur + skuggad sida - utan dem
    // smalter den ljusa stenen ihop med Colosseums ljusa mark/bakgrund.
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

  function drawObstacle(ctx, obs, theme) {
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
    } else if (obs.type === "ceiling") {
      ctx.fillStyle = theme.ceiling;
      ctx.fillRect(obs.x, 0, obs.w, obs.h);
      // hängande formationer längs underkanten (stalaktiter/istappar/vinrankor/klippor)
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
    } else {
      // Gemensamma matt for farodesignerna. Varje tema har sin egen fara och
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
          for (const [ox, hh] of [[0.2, 0.6], [0.5, 1], [0.8, 0.55]]) {
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
          // Boklyfta klor ur marken
          ctx.save();
          ctx.fillStyle = "#efe3c0";
          ctx.strokeStyle = "#2a1c08";
          ctx.lineWidth = 1.6;
          for (const [ox, hh] of [[0.22, 0.65], [0.52, 1], [0.82, 0.55]]) {
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
          for (const [ox, hh] of [[0.22, 0.68], [0.52, 1], [0.82, 0.58]]) {
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
          for (const [px, py] of [[-13, 3], [-1, 0], [14, 7]]) {
            ctx.beginPath();
            ctx.arc(scx + px, sy + py, 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
          break;
        }
        case "steppe": {
          // Mammutbetar ur marken
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
          for (const [ox, hh, tilt] of [[0.24, 0.6, -0.16], [0.54, 1, 0.04], [0.82, 0.5, 0.2]]) {
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
          for (const [x1, cxo, x2, hh] of [[0.1, 0.25, 0.55, 1], [0.5, 0.72, 0.95, 0.62]]) {
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
          // Trollklubba med dubbar
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
          for (const [ox, hh] of [[0.22, 0.6], [0.52, 1], [0.8, 0.5]]) {
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
          for (const [f1, f2, off] of [[0, 0.33, 3], [0.36, 0.66, -4], [0.69, 1, 2]]) {
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
          for (const [x1, cxo, tx, hh, lw] of [[0.15, 0.2, 0.75, 1, 5], [0.6, 0.72, 1.0, 0.55, 4]]) {
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
          for (const [bxp, byp] of [[scx + 3, sy + 4], [scx - 13, sgy - sh * 0.56]]) {
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
          // Taggig pinata-stjarna pa pinne
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
            [2, "#4a7a3a", sh * 0.22, -0.08]
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
          for (const [px, py] of [[-jl, jl * 0.6], [jl, -jl * 0.6], [jl, jl * 0.6], [-jl, -jl * 0.6], [0, jl * 0.8], [0, -jl * 1.2]]) {
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
          // Vålnadssten med dimslinga
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
          for (const [wx, wy] of [[-sw * 0.42, -sh * 0.75], [sw * 0.3, -sh * 0.95]]) {
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
            for (const [dx, dy] of [[0.3, 0.12], [0.38, 0.02]]) {
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
          for (const [ox, hh, tilt] of [[0.22, 0.62, -0.18], [0.52, 1, 0.05], [0.8, 0.5, 0.22]]) {
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
          // Skugghand som griper ur marken
          ctx.save();
          ctx.lineCap = "round";
          const fingers = [[-0.5, 0.42], [-0.25, 0.62], [0, 0.8], [0.25, 0.58], [0.5, 0.38]];
          // vit kontur forst, svart ovanpa
          for (const [col, lw] of [["#ffffff", 6.5], ["#000000", 3.5]]) {
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
