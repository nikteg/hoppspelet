"use strict";
// Fartkapp: hindrar bade omojlig svarighetsgrad och "tunnling" - vid extrem
// fart kan ett smalt hinder annars passera rakt genom spelarens hitbox
// mellan tva uppdateringar utan att kollisionen upptacks.
const MAX_SPEED = 22;
function update() {
    if (state !== "playing")
        return;
    // Öka svårighetsgrad sakta med tiden
    if (speed < MAX_SPEED)
        speed += 0.0015;
    distance += speed;
    // Gravitation + kollision mot plattformar (kan hoppas upp på, är annars solida)
    const prevBottom = player.y + player.h;
    player.vy += GRAVITY;
    const tentativeY = player.y + player.vy;
    const tentativeBottom = tentativeY + player.h;
    let floor = GROUND_Y;
    let crashed = false;
    // Samma marginal som dodliga hinder far (nedan), sa att en pixelsnudd
    // mot plattformens framkant inte dodar - kanns orattvist annars.
    const sideMargin = 6;
    for (const obs of obstacles) {
        if (obs.type !== "platform")
            continue;
        const overlapsX = player.x + player.w > obs.x && player.x < obs.x + obs.w;
        if (!overlapsX)
            continue;
        if (prevBottom <= obs.y + 1 && tentativeBottom >= obs.y) {
            // Landar ovanpå plattformen
            if (obs.y < floor)
                floor = obs.y;
        }
        else if (tentativeBottom > obs.y + sideMargin &&
            player.y + sideMargin < obs.y + obs.h &&
            player.x + player.w - sideMargin > obs.x &&
            player.x + sideMargin < obs.x + obs.w) {
            // Sprang in i plattformens sida/undersida
            crashed = true;
        }
    }
    if (crashed) {
        die();
        return;
    }
    player.y = tentativeY;
    if (player.y + player.h >= floor) {
        player.y = floor - player.h;
        player.vy = 0;
        player.onGround = true;
    }
    else {
        player.onGround = false;
    }
    // Rotera figuren lite i hoppet för känsla
    if (!player.onGround) {
        player.rotation += 0.12;
    }
    else {
        player.rotation = 0;
    }
    // Flytta hinder
    for (const obs of obstacles) {
        obs.x -= speed;
    }
    obstacles = obstacles.filter((o) => o.x + o.w > -10);
    // Spawna nya hinder
    spawnTimer++;
    if (spawnTimer >= nextSpawnAt) {
        spawnObstacle();
        spawnTimer = 0;
        nextSpawnAt = 55 + Math.random() * 50 - Math.min(speed, 20);
        if (nextSpawnAt < 35)
            nextSpawnAt = 35;
    }
    // Flytta och samla in mynt (ger extrapoäng, är aldrig farliga)
    for (const c of coins) {
        c.x -= speed;
    }
    for (const c of coins) {
        if (c.collected)
            continue;
        const dx = player.x + player.w / 2 - c.x;
        const dy = player.y + player.h / 2 - c.y;
        if (Math.sqrt(dx * dx + dy * dy) < c.r + player.w * 0.4) {
            c.collected = true;
            coinScore += 10;
            playCoinSound();
            floatingTexts.push({
                x: player.x + player.w / 2,
                y: player.y - 6,
                text: "+10",
                life: 45,
                maxLife: 45,
            });
        }
    }
    coins = coins.filter((c) => !c.collected && c.x > -30);
    // Poängtext som flyter uppåt vid figuren och tonar bort
    for (const ft of floatingTexts) {
        ft.y -= 1.3;
        ft.x -= speed * 0.3;
        ft.life--;
    }
    floatingTexts = floatingTexts.filter((ft) => ft.life > 0);
    coinSpawnTimer++;
    if (coinSpawnTimer >= coinNextSpawnAt) {
        spawnCoins();
        coinSpawnTimer = 0;
        coinNextSpawnAt = 70 + Math.random() * 80;
    }
    // Kollisionskoll mot dödliga hinder (spikar och takblock). Lite marginal för rättvis känsla.
    const margin = 6;
    const playerBox = {
        x: player.x + margin,
        y: player.y + margin,
        w: player.w - margin * 2,
        h: player.h - margin * 2,
    };
    for (const obs of obstacles) {
        if (obs.type === "platform")
            continue;
        if (rectsOverlap(playerBox, obs)) {
            die();
        }
    }
}
