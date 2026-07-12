"use strict";

  function currentThemeIndex() {
    if (debugThemeOverride !== null) return debugThemeOverride;
    return (levelOffset + Math.floor(getScore() / 1000)) % THEMES.length;
  }

  let appliedThemeIndex = -1;
  let themeAnnounceUntil = 0; // tidpunkt (ms) da temanamnet slutar visas

  let ambientParticles = [];
  function initParticles() {
    ambientParticles = [];
    for (let i = 0; i < 45; i++) {
      ambientParticles.push({
        x: Math.random() * (viewW || window.innerWidth),
        y: Math.random() * (viewH || window.innerHeight),
        size: 1 + Math.random() * 2.5,
        speed: 0.3 + Math.random() * 1.3,
        drift: (Math.random() - 0.5) * 0.6,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function resizeCanvas() {
    const prevGroundY = GROUND_Y;
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    // Backing store i fysiska pixlar, logiken i CSS-pixlar. Utan DPR-skalning
    // renderas spelet i tredjedels upplosning pa t.ex. iPhone (DPR 3) och
    // blir suddigt. Cap pa 2 - skillnaden 2->3 syns knappt men kostar ~2x
    // fill-rate. CSS:en (width/height 100%) skalar ner till skarmstorlek.
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(viewW * DPR);
    canvas.height = Math.round(viewH * DPR);
    // Resize nollstaller canvas-tillstandet, sa transformen satts om har.
    Engine.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // Markremsan ar 80px pa stora skarmar men krymper pa laga (mobil i
    // liggande lage) sa den inte ater upp spelytan.
    GROUND_Y = viewH - Math.min(80, Math.max(40, Math.round(viewH * 0.12)));
    // Safe area-insets (notch etc.) - CSS-variablerna satts fran env() i
    // styles.css; canvasritad HUD kan inte lasa env() direkt.
    const rootStyle = getComputedStyle(document.documentElement);
    safeLeft = parseFloat(rootStyle.getPropertyValue("--sai-left")) || 0;
    safeTop = parseFloat(rootStyle.getPropertyValue("--sai-top")) || 0;
    // iPhone ger samma inset pa BADA sidor i liggande lage, sa utan att veta
    // at vilket hall mobilen ar vriden indenteras aven sidan utan notch.
    // window.orientation lever kvar pa iOS: 90 = notch till vanster,
    // -90 = notch till hoger. data-notch later CSS:en gora samma avvagning
    // for knapparna till hoger.
    let notch = "unknown";
    if (/iPhone/.test(navigator.userAgent)) {
      let angle = null;
      if (typeof window.orientation === "number") angle = window.orientation;
      else if (screen.orientation && typeof screen.orientation.angle === "number") angle = screen.orientation.angle;
      if (angle === 90) notch = "left";
      else if (angle === -90 || angle === 270) notch = "right";
    }
    document.documentElement.dataset.notch = notch;
    if (notch === "right") safeLeft = 0; // HUD:en sitter till vanster om notchen ar till hoger
    // Levande objekt har koordinater raknade fran den gamla markytan. Flytta
    // med dem vid resize, annars svavar spikar i luften och takblockens lucka
    // andrar storlek (kunde bli opasserbar). Takblock hanger fran taket, sa
    // dar ar det hojden (avstandet ner till luckan) som foljer marken.
    const dy = GROUND_Y - prevGroundY;
    if (dy !== 0 && prevGroundY !== 0) {
      for (const obs of obstacles) {
        if (obs.type === "ceiling") {
          obs.h += dy;
        } else {
          obs.y += dy;
        }
      }
      for (const c of coins) c.y += dy;
      for (const ft of floatingTexts) ft.y += dy;
      if (state === "playing") player.y += dy;
    }
    if (state !== "playing") {
      player.y = GROUND_Y - player.h;
    }
    initParticles();
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function resetGame() {
    player.y = GROUND_Y - PLAYER_SIZE;
    player.vy = 0;
    player.onGround = true;
    player.rotation = 0;
    obstacles = [];
    coins = [];
    floatingTexts = [];
    coinScore = 0;
    coinSpawnTimer = 0;
    coinNextSpawnAt = 40 + Math.random() * 40;
    speed = 6;
    distance = 0;
    spawnTimer = 0;
    nextSpawnAt = 60 + Math.random() * 40;
    appliedThemeIndex = -1;
    themeAnnounceUntil = 0;
    // Har man valt en niva med pil-knapparna startar omgangen dar - sa att
    // man kan prova en specifik niva. Annars startas pa nivan man senast dog
    // pa. Overriden slapps sedan sa att nivan fortsatter bytas per 1000 poang.
    if (debugThemeOverride !== null) {
      levelOffset = debugThemeOverride;
    } else {
      levelOffset = pendingLevelOffset;
    }
    debugThemeOverride = null;
  }
