"use strict";

  function currentThemeIndex() {
    if (debugThemeOverride !== null) return debugThemeOverride;
    return (levelOffset + Math.floor(getScore() / 1000)) % THEMES.length;
  }

  let appliedThemeIndex = -1;
  let themeAnnounce = 0; // frames kvar att visa temats namn

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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    GROUND_Y = canvas.height - 80;
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
    themeAnnounce = 0;
    debugThemeOverride = null; // sa att en ny omgang alltid byter niva efter poang (1000, 2000, ...)
    levelOffset = pendingLevelOffset; // starta pa den niva man senast dog pa
  }
