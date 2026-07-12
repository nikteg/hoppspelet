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
        x: Math.random() * (canvas.width || window.innerWidth),
        y: Math.random() * (canvas.height || window.innerHeight),
        size: 1 + Math.random() * 2.5,
        speed: 0.3 + Math.random() * 1.3,
        drift: (Math.random() - 0.5) * 0.6,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function resizeCanvas() {
    const prevGroundY = GROUND_Y;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    GROUND_Y = canvas.height - 80;
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
