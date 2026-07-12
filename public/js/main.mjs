"use strict";

  function drawUI(ctx, theme) {
    ctx.save();
    ctx.fillStyle = "#f5f0e6";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("Poäng: " + getScore(), 16, 30);
    ctx.font = "14px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("Bästa: " + best, 16, 50);
    ctx.font = "13px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(theme.name, 16, 70);
    ctx.restore();

    if (state === "ready") {
      overlayText(ctx, "Tryck MELLANSLAG eller skärmen för att starta");
    } else if (state === "gameover") {
      overlayText(ctx, "Du dog! Poäng: " + getScore() + " — Mellanslag/skärm för att starta om");
    }

    // Tidsbaserad (inte frame-raknad) sa annonsen visas lika lange pa alla skarmar
    const announceLeft = themeAnnounceUntil - performance.now();
    if (announceLeft > 0) {
      const alpha = Math.min(1, announceLeft / 500);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, canvas.height / 2 - 60, canvas.width, 90);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 34px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(theme.name + "!", canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
  }

  function overlayText(ctx, text) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  }

  function draw() {
    const ctx = Engine.ctx;
    const themeIndex = currentThemeIndex();
    const theme = THEMES[themeIndex];

    if (appliedThemeIndex !== themeIndex) {
      appliedThemeIndex = themeIndex;
      canvas.style.background = theme.bg;
      if (state === "playing") {
        themeAnnounceUntil = performance.now() + 2500;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = performance.now() / 250;
    drawAmbientParticles(ctx, theme, t);
    drawScenery(ctx, theme, t);
    drawGround(ctx, theme);
    for (const obs of obstacles) drawObstacle(ctx, obs, theme);
    for (const c of coins) drawCoin(ctx, c, theme, t);
    drawPlayer(ctx);
    drawFloatingTexts(ctx);
    drawUI(ctx, theme);

    // Loggan visas bara pa startskarmen
    const showLogo = state === "ready";
    if (showLogo !== logoVisible) {
      logoVisible = showLogo;
      logoEl.classList.toggle("hidden", !showLogo);
    }
  }

  const logoEl = document.getElementById("logo");
  let logoVisible = true;

  resetGame();
  Engine.start(update, draw);
