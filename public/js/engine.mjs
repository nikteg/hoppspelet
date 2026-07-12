"use strict";

  // ---------- Litet minispel-ramverk ----------
  // En enkel "engine" med game loop, entiteter och kollisionshjälp.
  const Engine = {
    canvas: null,
    ctx: null,
    keys: {},
    entities: [],
    onUpdate: null,
    onDraw: null,
    lastTime: 0,
    accumulator: 0,
    // Fysiken ar tunad i "per frame"-varden for 60 fps. Darfor kors updates i
    // fasta 60 Hz-steg oavsett skarmens uppdateringsfrekvens (120+ Hz-skarmar
    // fick annars dubbel spelhastighet). Ritning sker fortfarande varje frame.
    STEP_MS: 1000 / 60,

    init(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      window.addEventListener("keydown", (e) => {
        this.keys[e.code] = true;
        if (e.code === "Space") e.preventDefault();
        if (this.onKeyDown) this.onKeyDown(e.code);
      });
      window.addEventListener("keyup", (e) => {
        this.keys[e.code] = false;
      });
    },

    start(update, draw) {
      this.onUpdate = update;
      this.onDraw = draw;
      requestAnimationFrame(this.loop.bind(this));
    },

    loop(time) {
      if (!this.lastTime) this.lastTime = time;
      let elapsed = time - this.lastTime;
      this.lastTime = time;
      // Efter t.ex. en flikvaxling kan elapsed vara enormt - hoppa inte ikapp,
      // det skulle ge en storm av updates (och orattvis dod).
      if (elapsed > 250) elapsed = 250;
      this.accumulator += elapsed;
      while (this.accumulator >= this.STEP_MS) {
        this.onUpdate();
        this.accumulator -= this.STEP_MS;
      }
      this.onDraw();
      requestAnimationFrame(this.loop.bind(this));
    }
  };

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  }
