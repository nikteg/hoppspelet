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

  function drawCoin(ctx, coin, theme, t) {
    const spin = Math.max(0.15, Math.abs(Math.cos(t * 3 + coin.phase)));
    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.scale(spin, 1);
    switch (theme.key) {
      case "ocean":
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.7)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(150,220,210,0.55)";
        ctx.beginPath();
        ctx.ellipse(0, coin.r * 0.3, coin.r * 1.3, coin.r * 0.6, 0, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = "#eafdf6";
        ctx.beginPath();
        ctx.arc(0, 0, coin.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      case "jungle": {
        ctx.save();
        ctx.shadowColor = "rgba(255,220,80,0.8)";
        ctx.shadowBlur = 10;
        const r = coin.r;
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
        ctx.moveTo(0, -coin.r);
        ctx.lineTo(coin.r * 0.7, 0);
        ctx.lineTo(0, coin.r);
        ctx.lineTo(-coin.r * 0.7, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      case "space":
        ctx.save();
        ctx.shadowColor = "rgba(255,255,200,0.9)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#fff6c8";
        drawStarShape(ctx, 0, 0, coin.r, coin.r * 0.45);
        ctx.fill();
        ctx.restore();
        break;
      case "desert":
        ctx.save();
        ctx.shadowColor = "rgba(255,220,120,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#e8c26a";
        ctx.beginPath();
        ctx.moveTo(0, -coin.r);
        ctx.lineTo(coin.r * 0.9, coin.r * 0.7);
        ctx.lineTo(-coin.r * 0.9, coin.r * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(140,90,20,0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -coin.r);
        ctx.lineTo(0, coin.r * 0.7);
        ctx.stroke();
        ctx.restore();
        break;
      case "sky":
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-coin.r * 0.4, coin.r * 0.15, coin.r * 0.55, 0, Math.PI * 2);
        ctx.arc(coin.r * 0.3, coin.r * 0.1, coin.r * 0.65, 0, Math.PI * 2);
        ctx.arc(0, -coin.r * 0.3, coin.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      case "neon":
        ctx.save();
        ctx.shadowColor = "rgba(0,255,255,0.9)";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#0ff0fc";
        ctx.beginPath();
        ctx.moveTo(0, -coin.r);
        ctx.lineTo(coin.r * 0.75, 0);
        ctx.lineTo(0, coin.r);
        ctx.lineTo(-coin.r * 0.75, 0);
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
        ctx.arc(0, -coin.r * 0.2, coin.r * 0.75, Math.PI, 0, false);
        ctx.lineTo(coin.r * 0.75, coin.r * 0.6);
        ctx.lineTo(coin.r * 0.35, coin.r * 0.3);
        ctx.lineTo(0, coin.r * 0.6);
        ctx.lineTo(-coin.r * 0.35, coin.r * 0.3);
        ctx.lineTo(-coin.r * 0.75, coin.r * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#1a1a22";
        ctx.beginPath();
        ctx.arc(-coin.r * 0.25, -coin.r * 0.2, coin.r * 0.12, 0, Math.PI * 2);
        ctx.arc(coin.r * 0.25, -coin.r * 0.2, coin.r * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      case "viking":
        ctx.save();
        ctx.shadowColor = "rgba(200,230,255,0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#8a95a0";
        ctx.beginPath();
        ctx.ellipse(0, 0, coin.r * 0.85, coin.r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e8eef2";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -coin.r * 0.6);
        ctx.lineTo(0, coin.r * 0.6);
        ctx.moveTo(-coin.r * 0.4, -coin.r * 0.3);
        ctx.lineTo(coin.r * 0.4, coin.r * 0.3);
        ctx.stroke();
        ctx.restore();
        break;
      case "dino":
        ctx.save();
        ctx.shadowColor = "rgba(200,255,140,0.8)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#e9dfae";
        ctx.beginPath();
        ctx.ellipse(0, 0, coin.r * 0.75, coin.r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(120,150,60,0.6)";
        ctx.beginPath();
        ctx.ellipse(-coin.r * 0.2, -coin.r * 0.3, coin.r * 0.12, coin.r * 0.18, 0.3, 0, Math.PI * 2);
        ctx.ellipse(coin.r * 0.25, coin.r * 0.1, coin.r * 0.1, coin.r * 0.15, -0.2, 0, Math.PI * 2);
        ctx.ellipse(-coin.r * 0.1, coin.r * 0.4, coin.r * 0.1, coin.r * 0.14, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      case "candy":
        ctx.save();
        ctx.shadowColor = "rgba(255,150,200,0.9)";
        ctx.shadowBlur = 10;
        for (let i = 0; i < 3; i++) {
          ctx.strokeStyle = i % 2 === 0 ? "#e0325c" : "#ffffff";
          ctx.lineWidth = coin.r * 0.4;
          ctx.beginPath();
          ctx.arc(0, 0, coin.r * (1 - i * 0.32), 0, Math.PI * 1.5);
          ctx.stroke();
        }
        ctx.restore();
        break;
      case "robot":
        ctx.save();
        ctx.shadowColor = "rgba(255,190,60,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#e8b840";
        drawGearSpike(ctx, { x: -coin.r, y: -coin.r, w: coin.r * 2, h: coin.r * 2 });
        ctx.restore();
        break;
      case "autumn":
        ctx.save();
        ctx.shadowColor = "rgba(230,150,60,0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#8a5a2a";
        ctx.beginPath();
        ctx.ellipse(0, -coin.r * 0.55, coin.r * 0.6, coin.r * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#c98a4a";
        ctx.beginPath();
        ctx.ellipse(0, coin.r * 0.15, coin.r * 0.6, coin.r * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      default: {
        ctx.save();
        ctx.shadowColor = "rgba(255,210,80,0.9)";
        ctx.shadowBlur = 12;
        const g = ctx.createRadialGradient(0, 0, 1, 0, 0, coin.r);
        g.addColorStop(0, "#fff6c8");
        g.addColorStop(0.5, "#ffd54a");
        g.addColorStop(1, "#c98b1f");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, coin.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
    }
    ctx.restore();
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
