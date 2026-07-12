/* Genererar startsidans skärmbilder (public/assets/screens/screen1-3.jpg).
 *
 * Användning:
 *   1. Ställ webbläsarfönstret på ca 800x450 (t.ex. devtools responsive mode)
 *      - bildstorleken blir samma som spelytans storlek.
 *   2. Öppna spelet (dubbelklicka public/index.html eller den hostade sidan).
 *   3. Klistra in HELA den här filen i devtools-konsolen och tryck Enter.
 *      Webbläsaren frågar ev. om den får ladda ner flera filer - tillåt.
 *   4. Flytta de nedladdade screen1.jpg/screen2.jpg/screen3.jpg till
 *      public/assets/screens/ och ladda om sidan (skriptet lämnar spelet i
 *      ett iscensatt läge).
 *
 * Vill du byta motiv: ändra i SHOTS nedan. Koordinaterna är relativa
 * canvasbredden så scenerna funkar i olika fönsterstorlekar.
 */
(async function captureScreens() {
  "use strict";
  if (typeof THEMES === "undefined" || typeof canvas === "undefined") {
    console.error("Kör detta i spelets flik (öppna public/index.html först).");
    return;
  }

  const JPEG_QUALITY = 0.82;

  // Iscensätt ett stillsamt "playing"-läge: inga nya spawns, spelaren på
  // marken och poängräknaren tickande - ser ut som mitt i en runda.
  function setBase(themeKey) {
    debugThemeOverride = THEMES.findIndex((t) => t.key === themeKey);
    state = "playing";
    speed = 6;
    spawnTimer = 0;
    nextSpawnAt = 1e9;
    coinSpawnTimer = 0;
    coinNextSpawnAt = 1e9;
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.onGround = true;
    player.rotation = 0;
    obstacles = [];
    coins = [];
  }

  const spike = (fx) => ({ x: canvas.width * fx, y: GROUND_Y - 44, w: 34, h: 44, type: "spike" });

  function coinArc(fromFx, n, spacing, above, amp) {
    for (let i = 0; i < n; i++) {
      coins.push({
        x: canvas.width * fromFx + i * spacing,
        y: GROUND_Y - above - Math.sin((i / (n - 1)) * Math.PI) * amp,
        r: 13,
        phase: i
      });
    }
  }

  const SHOTS = [
    {
      file: "screen1.jpg",
      stage: () => {
        setBase("lava");
        obstacles.push(spike(0.55), spike(0.88));
        coinArc(0.58, 5, 46, 140, 60);
      }
    },
    {
      file: "screen2.jpg",
      stage: () => {
        setBase("unicorn");
        obstacles.push(spike(0.5));
        obstacles.push({ x: canvas.width * 0.7, y: GROUND_Y - 111, w: 140, h: 90, type: "platform" });
        for (let i = 0; i < 4; i++) {
          coins.push({ x: canvas.width * 0.7 + 24 + i * 32, y: GROUND_Y - 139, r: 13, phase: i * 2 });
        }
      }
    },
    {
      file: "screen3.jpg",
      stage: () => {
        setBase("citynight");
        player.y = GROUND_Y - player.h - 70; // mitt i ett hopp
        player.vy = 1;
        player.onGround = false;
        player.rotation = 0.6;
        obstacles.push(spike(0.45), spike(0.8));
        coinArc(0.48, 5, 44, 150, 50);
      }
    }
  ];

  const frame = () => new Promise((r) => requestAnimationFrame(r));

  async function grab(shot) {
    shot.stage();
    await frame();
    themeAnnounceUntil = 0; // temaannonsen ska inte synas på bilden
    await frame();
    await frame();

    // Canvasen är transparent där CSS-bakgrunden syns - återskapa temats
    // radialgradient och rita spelet ovanpå.
    const th = THEMES[currentThemeIndex()];
    const out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    const g = out.getContext("2d");
    const stops = [...th.bg.matchAll(/(#[0-9a-fA-F]{6})\s+(\d+)%/g)];
    const at = th.bg.match(/at\s+50%\s+(\d+)%/);
    const cy = out.height * (at ? +at[1] / 100 : 0.5);
    const grad = g.createRadialGradient(out.width / 2, cy, 0, out.width / 2, cy, Math.max(out.width, out.height));
    for (const s of stops) grad.addColorStop(+s[2] / 100, s[1]);
    g.fillStyle = grad;
    g.fillRect(0, 0, out.width, out.height);
    g.drawImage(canvas, 0, 0);

    const a = document.createElement("a");
    a.href = out.toDataURL("image/jpeg", JPEG_QUALITY);
    a.download = shot.file;
    a.click();
  }

  const landing = document.getElementById("landing");
  if (landing) landing.style.display = "none";

  for (const shot of SHOTS) {
    await grab(shot);
    await new Promise((r) => setTimeout(r, 400)); // ge nedladdningen andrum
  }
  console.log("Klart! Flytta filerna till public/assets/screens/ och ladda om sidan.");
})();
