"use strict";

  Engine.onKeyDown = function (code) {
    if (code === "Space") handleAction();
  };

  canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    handleAction();
  }, { passive: false });

  // ---------- Knapp-koppling ----------
  // mousedown med preventDefault hindrar knapparna fran att ta emot fokus, sa att
  // MELLANSLAG for att hoppa fortsatter fungera som vanligt efter ett klick.
  // Touch hanteras separat och direkt i touchstart eftersom preventDefault dar
  // stoppar webblasaren fran att nagonsin skicka den efterföljande click-handelsen
  // (annars gjorde knapparna ingenting pa iPad).
  // Returnerar elementet (eller null om det saknas i HTML:en - da hoppas
  // knappen bara over i stallet for att krascha resten av inputkopplingen).
  function wireButton(id, action) {
    const btn = document.getElementById(id);
    if (!btn) return null;
    btn.addEventListener("mousedown", function (e) { e.preventDefault(); });
    btn.addEventListener("touchstart", function (e) {
      e.preventDefault();
      action();
    }, { passive: false });
    btn.addEventListener("click", function () {
      action();
      btn.blur();
    });
    return btn;
  }

  // ---------- Felsökningsknappar (temabyte + omladdning) ----------
  function debugGoToTheme(delta) {
    const cur = currentThemeIndex();
    debugThemeOverride = ((cur + delta) % THEMES.length + THEMES.length) % THEMES.length;
  }

  wireButton("debugPrevTheme", function () { debugGoToTheme(-1); });
  wireButton("debugNextTheme", function () { debugGoToTheme(1); });

  // ---------- Pausa i portrattlage pa mobil ----------
  // Samma media query som visar #rotateHint i styles.css. Spelet pausas sa
  // att man inte hinner do bakom rotera-overlagret.
  const portraitBlock = window.matchMedia("(orientation: portrait) and (pointer: coarse)");
  function applyOrientationPause() {
    Engine.paused = portraitBlock.matches;
  }
  if (portraitBlock.addEventListener) {
    portraitBlock.addEventListener("change", applyOrientationPause);
  }
  applyOrientationPause();

  // ---------- Startsidans Spela-knapp ----------
  // handleAction gommer startsidan och startar rundan direkt (state "ready").
  wireButton("playBtn", handleAction);

  // ---------- Mute-knapp for musiken ----------
  function toggleMusic() {
    startMusic();       // sakerstall att musiken ar igang (och ljudet upplast av gesten)
    setMusicOn(!musicOn);
  }
  const muteBtn = wireButton("musicMute", toggleMusic);
  if (muteBtn) muteBtn.textContent = musicOn ? "🔊" : "🔇";
