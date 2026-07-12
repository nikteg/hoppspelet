"use strict";

  Engine.onKeyDown = function (code) {
    if (code === "Space") handleAction();
  };

  canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    handleAction();
  }, { passive: false });

  // ---------- Felsökningsknapp (+1000 poäng) ----------
  // mousedown med preventDefault hindrar knapparna fran att ta emot fokus, sa att
  // MELLANSLAG for att hoppa fortsatter fungera som vanligt efter ett klick.
  // Touch hanteras separat och direkt i touchstart eftersom preventDefault dar
  // stoppar webblasaren fran att nagonsin skicka den efterföljande click-handelsen
  // (annars gjorde knapparna ingenting pa iPad).
  function debugGoToTheme(delta) {
    const cur = currentThemeIndex();
    debugThemeOverride = ((cur + delta) % THEMES.length + THEMES.length) % THEMES.length;
  }

  const prevThemeBtn = document.getElementById("debugPrevTheme");
  prevThemeBtn.addEventListener("mousedown", function (e) { e.preventDefault(); });
  prevThemeBtn.addEventListener("touchstart", function (e) {
    e.preventDefault();
    debugGoToTheme(-1);
  }, { passive: false });
  prevThemeBtn.addEventListener("click", function () {
    debugGoToTheme(-1);
    prevThemeBtn.blur();
  });

  const nextThemeBtn = document.getElementById("debugNextTheme");
  nextThemeBtn.addEventListener("mousedown", function (e) { e.preventDefault(); });
  nextThemeBtn.addEventListener("touchstart", function (e) {
    e.preventDefault();
    debugGoToTheme(1);
  }, { passive: false });
  nextThemeBtn.addEventListener("click", function () {
    debugGoToTheme(1);
    nextThemeBtn.blur();
  });

  const reloadBtn = document.getElementById("debugReload");
  reloadBtn.addEventListener("mousedown", function (e) { e.preventDefault(); });
  reloadBtn.addEventListener("touchstart", function (e) {
    e.preventDefault();
    window.location.reload();
  }, { passive: false });
  reloadBtn.addEventListener("click", function () {
    window.location.reload();
  });

  // ---------- Mute-knapp for musiken ----------
  const muteBtn = document.getElementById("musicMute");
  muteBtn.textContent = musicOn ? "🔊" : "🔇";
  function toggleMusic() {
    startMusic();       // sakerstall att musiken ar igang (och ljudet upplast av gesten)
    setMusicOn(!musicOn);
  }
  muteBtn.addEventListener("mousedown", function (e) { e.preventDefault(); });
  muteBtn.addEventListener("touchstart", function (e) {
    e.preventDefault();
    toggleMusic();
  }, { passive: false });
  muteBtn.addEventListener("click", function () {
    toggleMusic();
    muteBtn.blur();
  });
