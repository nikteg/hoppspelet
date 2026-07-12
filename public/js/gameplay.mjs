"use strict";

  function jump() {
    if (player.onGround) {
      player.vy = JUMP_FORCE;
      player.onGround = false;
      playJumpSound();
    }
  }

  function die() {
    if (state === "gameover") return;
    // Kom ihag vilken niva man dog pa sa nasta omgang startar dar (fast med 0 poang).
    // Appliceras forst vid omstart (resetGame) sa gameover-skarmen visar ratt tema.
    pendingLevelOffset = currentThemeIndex();
    state = "gameover";
    best = Math.max(best, getScore());
    try { localStorage.setItem("hoppspelet_best", String(best)); } catch (e) {}
    playDeathSound();
  }
  function spawnObstacle() {
    // Slumpa typ: spik (hoppa över), plattform (hoppa upp på) eller takblock (måste gå under)
    const r = Math.random();
    if (r < 0.55) {
      // Faror (spik / kottatande vaxt) har alltid samma storlek
      const w = 34;
      const h = 44;
      obstacles.push({ type: "spike", x: canvas.width + 20, y: GROUND_Y - h, w: w, h: h });
    } else if (r < 0.8) {
      // Plattformar far fortfarande variera (de ar inte faror)
      const w = 90 + Math.random() * 90;
      const platformHeight = 55 + Math.random() * 55;
      const topY = GROUND_Y - platformHeight;
      obstacles.push({ type: "platform", x: canvas.width + 20, y: topY, w: w, h: GROUND_Y - topY });
    } else {
      // Takblock (fara) har alltid samma storlek och hojd over marken
      const w = 100;
      const bottomY = GROUND_Y - PLAYER_SIZE - 38;
      obstacles.push({ type: "ceiling", x: canvas.width + 20, y: 0, w: w, h: bottomY });
    }
  }

  function hasObstacleNear(x1, x2) {
    for (const obs of obstacles) {
      if (obs.x < x2 + 30 && obs.x + obs.w > x1 - 30) return true;
    }
    return false;
  }

  function spawnCoins() {
    const arcCount = 5;
    const spacing = 60;
    const startX = canvas.width + 40;
    const endX = startX + spacing * (arcCount - 1);
    if (hasObstacleNear(startX, endX)) return;

    const baseY = GROUND_Y - PLAYER_SIZE - 20 - Math.random() * 30;
    const arcHeight = 50;
    for (let i = 0; i < arcCount; i++) {
      const x = startX + i * spacing;
      const y = baseY - Math.sin((Math.PI * i) / (arcCount - 1)) * arcHeight;
      coins.push({ x: x, y: y, r: 17, phase: Math.random() * Math.PI * 2, collected: false });
    }
  }

  function handleAction() {
    startMusic(); // startar musiken vid forsta anvandarinteraktion (browsers kraver en gest)
    if (state === "ready") {
      state = "playing";
      resetGame();
    } else if (state === "playing") {
      jump();
    } else if (state === "gameover") {
      state = "playing";
      resetGame();
    }
  }
