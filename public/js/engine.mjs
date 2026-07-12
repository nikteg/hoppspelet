"use strict";

  // ---------- Litet minispel-ramverk ----------
  // En enkel "engine" med game loop, entiteter och kollisionshjälp.
  const Engine = {
    canvas: null,
    ctx: null,
    onUpdate: null,
    onDraw: null,
    lastTime: 0,
    accumulator: 0,
    // Hur lang den senaste bildrutan var relativt ett 60 Hz-steg (0.5 pa en
    // 120 Hz-skarm). Anvands av rena rit-animationer (t.ex. bakgrundspartiklar
    // som ska rora sig aven pa startskarmen) sa de gar i samma takt overallt.
    frameScale: 1,
    // Fysiken ar tunad i "per frame"-varden for 60 fps. Darfor kors updates i
    // fasta 60 Hz-steg oavsett skarmens uppdateringsfrekvens (120+ Hz-skarmar
    // fick annars dubbel spelhastighet). Ritning sker fortfarande varje frame.
    STEP_MS: 1000 / 60,

    init(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      window.addEventListener("keydown", (e) => {
        if (e.code === "Space") e.preventDefault();
        if (this.onKeyDown) this.onKeyDown(e.code);
      });
    },

    start(update, draw) {
      this.onUpdate = update;
      this.onDraw = draw;
      this.loop = this.loop.bind(this); // bind en gang i stallet for varje frame
      requestAnimationFrame(this.loop);
    },

    // Satts nar spelet inte ska ticka (rotera-skarmen pa mobil i portratt-
    // lage). Ritningen fortsatter sa vyn inte fryser, men tiden star stilla.
    paused: false,

    loop(time) {
      if (!this.lastTime) this.lastTime = time;
      if (this.paused) {
        this.lastTime = time;
        this.accumulator = 0;
        this.frameScale = 0;
        this.onDraw();
        requestAnimationFrame(this.loop);
        return;
      }
      let elapsed = time - this.lastTime;
      this.lastTime = time;
      // Efter t.ex. en flikvaxling kan elapsed vara enormt - hoppa inte ikapp,
      // det skulle ge en storm av updates (och orattvis dod).
      if (elapsed > 250) elapsed = 250;
      this.frameScale = elapsed / this.STEP_MS;
      this.accumulator += elapsed;
      while (this.accumulator >= this.STEP_MS) {
        this.onUpdate();
        this.accumulator -= this.STEP_MS;
      }
      this.onDraw();
      requestAnimationFrame(this.loop);
    }
  };

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  }
