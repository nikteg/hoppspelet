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
        // Banankroppen ritas som ett langt, smalt bojt streck sa den inte blir en rund "boll"
        ctx.strokeStyle = bananaGrad;
        ctx.lineWidth = r * 0.45;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-r * 1.1, r * 0.55);
        ctx.quadraticCurveTo(0, -r * 1.35, r * 1.1, -r * 0.45);
        ctx.stroke();
        // Morkare ridge-linje langs mitten for lite djup
        ctx.strokeStyle = "rgba(150,100,10,0.55)";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-r * 0.95, r * 0.4);
        ctx.quadraticCurveTo(0, -r * 1.0, r * 0.95, -r * 0.3);
        ctx.stroke();
        // Bruna tippar i bada andar
        ctx.fillStyle = "#6b4a1f";
        ctx.beginPath();
        ctx.arc(-r * 1.1, r * 0.55, r * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(r * 1.1, -r * 0.45, r * 0.16, 0, Math.PI * 2);
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
        // Virveltratt av staplade bagar
        ctx.save();
        ctx.shadowColor = "rgba(230,225,170,0.8)";
        ctx.shadowBlur = 8;
        ctx.strokeStyle = "#d9d089";
        ctx.lineCap = "round";
        for (let k = 0; k < 4; k++) {
          ctx.lineWidth = r * (0.26 - k * 0.05);
          const w = r * (0.9 - k * 0.22);
          const y = -r * 0.7 + k * r * 0.45;
          ctx.beginPath();
          ctx.moveTo(-w, y);
          ctx.quadraticCurveTo(0, y + r * 0.2, w, y);
          ctx.stroke();
        }
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
    }
  }

  function drawAsteroidChunk(ctx, obs) {
    ctx.beginPath();
    ctx.moveTo(obs.x, obs.y + obs.h * 0.6);
    ctx.lineTo(obs.x + obs.w * 0.25, obs.y + obs.h * 0.1);
    ctx.lineTo(obs.x + obs.w * 0.6, obs.y);
    ctx.lineTo(obs.x + obs.w, obs.y + obs.h * 0.35);
    ctx.lineTo(obs.x + obs.w * 0.85, obs.y + obs.h);
    ctx.lineTo(obs.x + obs.w * 0.2, obs.y + obs.h);
    ctx.closePath();
    ctx.fill();
  }

  function drawCactus(ctx, obs) {
    const cx = obs.x + obs.w / 2;
    const stemW = obs.w * 0.4;
    ctx.fillRect(cx - stemW / 2, obs.y, stemW, obs.h);
    const armW = obs.w * 0.28;
    ctx.fillRect(obs.x, obs.y + obs.h * 0.35, armW, obs.h * 0.45);
    ctx.fillRect(obs.x + obs.w - armW, obs.y + obs.h * 0.2, armW, obs.h * 0.45);
  }

  function drawCandyCane(ctx, obs) {
    const cx = obs.x + obs.w / 2;
    const w = obs.w * 0.5;
    const hookY = obs.y + obs.h * 0.35;

    // Vit stav med bojd hake upptill
    ctx.save();
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(cx, obs.y + obs.h);
    ctx.lineTo(cx, hookY);
    ctx.arc(cx - w * 0.5, hookY, w * 0.5, 0, -Math.PI, true);
    ctx.stroke();
    ctx.restore();

    // Roda diagonala ranSder ovanpa staven
    ctx.save();
    ctx.strokeStyle = "#e0325c";
    ctx.lineWidth = w * 0.28;
    ctx.lineCap = "round";
    for (let i = 0; i < 4; i++) {
      const yy = obs.y + obs.h * 0.42 + i * ((obs.h * 0.58) / 4);
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.42, yy + w * 0.3);
      ctx.lineTo(cx + w * 0.42, yy - w * 0.3);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawGearSpike(ctx, obs) {
    const cx = obs.x + obs.w / 2, cy = obs.y + obs.h / 2, r = Math.min(obs.w, obs.h) / 2;
    const teeth = 8;
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
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
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
    // Rostigt skeppsankare (piratema)
    const cx = obs.x + obs.w / 2;
    const top = obs.y;
    const bot = obs.y + obs.h;
    ctx.save();
    ctx.strokeStyle = "#3a3a3a";
    ctx.lineWidth = obs.w * 0.16;
    ctx.lineCap = "round";
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
    ctx.fillStyle = "#3a3a3a";
    for (const s of [-1, 1]) {
      const fx = cx + s * obs.w * 0.42;
      const fy = bot - obs.h * 0.3;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + s * obs.w * 0.16, fy - obs.h * 0.1);
      ctx.lineTo(fx, fy - obs.h * 0.16);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawObelisk(ctx, obs, theme) {
    // Obelisk med guldtopp och hieroglyfstreck (egypten)
    const cx = obs.x + obs.w / 2;
    ctx.save();
    ctx.fillStyle = theme.spike;
    ctx.beginPath();
    ctx.moveTo(cx - obs.w * 0.32, obs.y + obs.h);
    ctx.lineTo(cx - obs.w * 0.2, obs.y + obs.h * 0.25);
    ctx.lineTo(cx, obs.y);
    ctx.lineTo(cx + obs.w * 0.2, obs.y + obs.h * 0.25);
    ctx.lineTo(cx + obs.w * 0.32, obs.y + obs.h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffd85a";
    ctx.beginPath();
    ctx.moveTo(cx, obs.y);
    ctx.lineTo(cx + obs.w * 0.14, obs.y + obs.h * 0.18);
    ctx.lineTo(cx - obs.w * 0.14, obs.y + obs.h * 0.18);
    ctx.closePath();
    ctx.fill();
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
    // Avbruten antik kolonn (rom)
    const x = obs.x + obs.w * 0.15;
    const w = obs.w * 0.7;
    ctx.save();
    ctx.fillStyle = theme.platform;
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
    ctx.strokeStyle = "rgba(60,40,15,0.35)";
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x + (w / 4) * i, obs.y + obs.h * 0.35);
      ctx.lineTo(x + (w / 4) * i, obs.y + obs.h);
      ctx.stroke();
    }
    ctx.fillStyle = theme.platformTop;
    ctx.fillRect(x - 4, obs.y + obs.h - 7, w + 8, 7);
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
          drawCandyCane(ctx, obs);
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
