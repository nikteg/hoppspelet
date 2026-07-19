/**
 * Extracts coin designs into individual src/coins/*.ts files.
 * Replaces key=="..." checks with explicit parameters.
 * Updates world files to import from coins/.
 */
const fs = require("fs");
const path = require("path");

const WORLDS_DIR = "src/worlds";
const COINS_DIR = "src/coins";
fs.mkdirSync(COINS_DIR, { recursive: true });

const worlds = {};
for (const fn of fs
  .readdirSync(WORLDS_DIR)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "_shared.ts")) {
  worlds[fn.replace(".ts", "")] = fs.readFileSync(path.join(WORLDS_DIR, fn), "utf8");
}

// ── Shared coin parameter mapping ──
const sharedParams = {
  lava: {
    name: "magma",
    fn: "drawMagmaCoin",
    params: "midColor: string",
    bodyPrefix: "const midColor",
    args: (key) => `"${key === "lava" ? "#ff9a3a" : "#ff8a4a"}"`,
  },
  pirate: {
    name: "doubloon",
    fn: "drawDoubloonCoin",
    params: "golden: boolean",
    bodyPrefix: "const gold = golden",
    args: (key) => `${key === "pirate"}`,
  },
  savanna: {
    name: "sundisk",
    fn: "drawSunDiskCoin",
    params: "embossed: boolean",
    bodyPrefix: "const az = embossed",
    args: (key) => `${key === "aztec"}`,
  },
  crystal: {
    name: "gemstone",
    fn: "drawGemstoneCoin",
    params: "color: string",
    bodyPrefix: "const col = color",
    args: (key) => `"${key === "crystal" ? "#5ff2e0" : "#ffe08a"}"`,
  },
  bog: {
    name: "wisp",
    fn: "drawWispCoin",
    params: "color: string",
    bodyPrefix: "const col = color",
    args: (key) => `"${key === "fog" ? "rgba(220,235,225,0.95)" : "rgba(170,255,140,0.95)"}"`,
  },
  bamboo: {
    name: "leaf",
    fn: "drawLeafCoin",
    params: "color: string",
    bodyPrefix: "ctx.fillStyle = color",
    args: (key) => `"${key === "bamboo" ? "#a9d98a" : "#8aca5a"}"`,
  },
  reef: {
    name: "shell",
    fn: "drawShellCoin",
    params: "color: string",
    bodyPrefix: "ctx.fillStyle = color",
    args: (key) => `"${key === "reef" ? "#ff9ab8" : "#ffb8e0"}"`,
  },
  giant: {
    name: "nugget",
    fn: "drawNuggetCoin",
    params: "golden: boolean",
    bodyPrefix: "const gold = golden",
    args: (key) => `${key === "giant"}`,
  },
  sakura: {
    name: "flower5",
    fn: "drawFivePetalCoin",
    params: "petalColor: string, centerColor: string",
    bodyPrefix: "const petal = petalColor; const center = centerColor",
    args: (key) =>
      `"${key === "sakura" ? "#ffb0c8" : "#fff6e8"}", "${key === "sakura" ? "#ff7a9a" : "#ffd94a"}"`,
  },
  circus: {
    name: "stripedball",
    fn: "drawStripedBallCoin",
    params: "colors: string[]",
    bodyPrefix: "const cols = colors",
    args: (key) =>
      `[${key === "circus" ? '"#e0325c", "#ffffff"' : '"#ff5a5a", "#ffe24a", "#5ab4ff", "#ffffff"'} ]`,
  },
};

// ── Step 1: Create shared coin files ──
const sharedSrc = fs.readFileSync(path.join(WORLDS_DIR, "_shared.ts"), "utf8");

for (const [oldKey, { name, fn, params }] of Object.entries(sharedParams)) {
  // Extract the function body from _shared.ts
  const fnRegex = new RegExp(
    `export function sharedCoin_${oldKey}\\(ctx: Ctx, r: number, key: string\\) \\{([\\s\\S]*?)\\n\\}`,
    "m",
  );
  const match = sharedSrc.match(fnRegex);
  if (!match) {
    console.log(`WARN: could not extract sharedCoin_${oldKey}`);
    continue;
  }

  let body = match[1];
  // Replace key === "..." checks with params
  body = body.replace(/key === "lava"/g, 'midColor === "#ff9a3a"');
  body = body.replace(/key === "pirate"/g, "golden");
  body = body.replace(/key === "aztec"/g, "embossed");
  body = body.replace(/key === "crystal"/g, 'color === "#5ff2e0"');
  body = body.replace(/key === "fog"/g, 'color === "rgba(220,235,225,0.95)"');
  body = body.replace(/key === "bamboo"/g, 'color === "#a9d98a"');
  body = body.replace(/key === "reef"/g, 'color === "#ff9ab8"');
  body = body.replace(/key === "giant"/g, "golden");
  body = body.replace(/key === "sakura"/g, 'petalColor === "#ffb0c8"');
  body = body.replace(/key === "circus"/g, "colors.length === 2");
  // Remove any remaining key references
  body = body.replace(/key/g, "_unused");

  const coinSrc = `// Coin: ${name}
import type { Ctx } from "../types.js";

export function ${fn}(ctx: Ctx, r: number, ${params}) {
${body}}
`;
  fs.writeFileSync(path.join(COINS_DIR, `${name}.ts`), coinSrc);
  console.log(`Created coins/${name}.ts`);
}

// ── Step 2: Extract unique coin designs from world files ──
// Unique coin names by world key
const uniqueCoinNames = {
  ocean: { name: "pearl", fn: "drawPearlCoin" },
  jungle: { name: "banana", fn: "drawBananaCoin" },
  ice: { name: "diamond", fn: "drawDiamondCoin" },
  space: { name: "star", fn: "drawStarCoin" },
  desert: { name: "pyramid", fn: "drawPyramidCoin" },
  sky: { name: "cloud", fn: "drawCloudCoin" },
  neon: { name: "neoncoin", fn: "drawNeonCoin" },
  haunted: { name: "ghost", fn: "drawGhostCoin" },
  viking: { name: "rune", fn: "drawRuneCoin" },
  dino: { name: "fossil", fn: "drawFossilCoin" },
  candy: { name: "candycoin", fn: "drawCandyCoin" },
  robot: { name: "gearcoin", fn: "drawGearCoin" },
  autumn: { name: "acorn", fn: "drawAcornCoin" },
  steppe: { name: "amber", fn: "drawAmberCoin" },
  saltflat: { name: "saltcrystal", fn: "drawSaltCrystalCoin" },
  dragon: { name: "flame", fn: "drawFlameCoin" },
  phoenix: { name: "feather", fn: "drawFeatherCoin" },
  troll: { name: "runestone", fn: "drawRunestoneCoin" },
  unicorn: { name: "unicornstar", fn: "drawUnicornStarCoin" },
  witch: { name: "potion", fn: "drawPotionCoin" },
  moonbase: { name: "moon", fn: "drawMoonCoin" },
  cyber: { name: "chip", fn: "drawChipCoin" },
  time: { name: "hourglass", fn: "drawHourglassCoin" },
  ufo: { name: "saucer", fn: "drawSaucerCoin" },
  junk: { name: "nut", fn: "drawNutCoin" },
  whalegrave: { name: "bone", fn: "drawBoneCoin" },
  egypt: { name: "ankh", fn: "drawAnkhCoin" },
  rome: { name: "denarius", fn: "drawDenariusCoin" },
  medieval: { name: "shield", fn: "drawShieldCoin" },
  westtown: { name: "sheriffstar", fn: "drawSheriffStarCoin" },
  citynight: { name: "lamp", fn: "drawLampCoin" },
  carnival: { name: "balloon", fn: "drawBalloonCoin" },
  library: { name: "book", fn: "drawBookCoin" },
  toyroom: { name: "diecoin", fn: "drawDieCoin" },
  storm: { name: "lightning", fn: "drawLightningCoin" },
  tornado: { name: "tornado", fn: "drawTornadoCoin" },
  pizzeria: { name: "pizzaslice", fn: "drawPizzaSliceCoin" },
  orchard: { name: "apple", fn: "drawAppleCoin" },
  icecream: { name: "icecreamcoin", fn: "drawIceCreamCoin" },
  newyear: { name: "sparkler", fn: "drawSparklerCoin" },
  artgallery: { name: "palette", fn: "drawPaletteCoin" },
  disco: { name: "discoball", fn: "drawDiscoBallCoin" },
  shadow: { name: "shadowcoin", fn: "drawShadowCoin" },
  dream: { name: "crescent", fn: "drawCrescentCoin" },
};

// Default gold coin
uniqueCoinNames._default = { name: "gold", fn: "drawGoldCoin" };

for (const [worldKey, { name, fn }] of Object.entries(uniqueCoinNames)) {
  const src =
    worldKey === "_default"
      ? fs.readFileSync(path.join(WORLDS_DIR, "_shared.ts"), "utf8")
      : worlds[worldKey];

  if (!src) {
    console.log(`WARN: no source for ${worldKey}`);
    continue;
  }

  // Extract the drawCoinDesign function
  const fnRegex =
    worldKey === "_default"
      ? /export function sharedCoin_default[\s\S]*?\{([\s\S]*?)\n\}/
      : /export function drawCoinDesign\(ctx: Ctx, r: number\) \{([\s\S]*?)\n\}/;
  const match = src.match(fnRegex);
  if (!match) {
    console.log(`WARN: could not extract coin from ${worldKey}`);
    continue;
  }

  const body = match[1].trim();

  const coinSrc = `// Coin: ${name}
import type { Ctx } from "../types.js";
${body.includes("drawStarShape") || body.includes("drawGearSpike") ? 'import { drawStarShape, drawGearSpike } from "../sprites.js";\n' : ""}
export function ${fn}(ctx: Ctx, r: number) {
${body}
}
`;
  fs.writeFileSync(path.join(COINS_DIR, `${name}.ts`), coinSrc);
  console.log(`Created coins/${name}.ts`);
}

// ── Step 3: Update world files ──
const sharedWorlds = {
  lava: { coin: "magma", fn: "drawMagmaCoin", args: '"#ff9a3a"' },
  volcanoisland: { coin: "magma", fn: "drawMagmaCoin", args: '"#ff8a4a"' },
  pirate: { coin: "doubloon", fn: "drawDoubloonCoin", args: "true" },
  atlantis: { coin: "doubloon", fn: "drawDoubloonCoin", args: "false" },
  savanna: { coin: "sundisk", fn: "drawSunDiskCoin", args: "false" },
  aztec: { coin: "sundisk", fn: "drawSunDiskCoin", args: "true" },
  crystal: { coin: "gemstone", fn: "drawGemstoneCoin", args: '"#5ff2e0"' },
  fairy: { coin: "gemstone", fn: "drawGemstoneCoin", args: '"#ffe08a"' },
  bog: { coin: "wisp", fn: "drawWispCoin", args: '"rgba(170,255,140,0.95)"' },
  mangrove: { coin: "wisp", fn: "drawWispCoin", args: '"rgba(170,255,140,0.95)"' },
  fog: { coin: "wisp", fn: "drawWispCoin", args: '"rgba(220,235,225,0.95)"' },
  bamboo: { coin: "leaf", fn: "drawLeafCoin", args: '"#a9d98a"' },
  canopy: { coin: "leaf", fn: "drawLeafCoin", args: '"#8aca5a"' },
  reef: { coin: "shell", fn: "drawShellCoin", args: '"#ff9ab8"' },
  mermaid: { coin: "shell", fn: "drawShellCoin", args: '"#ffb8e0"' },
  giant: { coin: "nugget", fn: "drawNuggetCoin", args: "true" },
  mars: { coin: "nugget", fn: "drawNuggetCoin", args: "false" },
  sakura: { coin: "flower5", fn: "drawFivePetalCoin", args: '"#ffb0c8", "#ff7a9a"' },
  spring: { coin: "flower5", fn: "drawFivePetalCoin", args: '"#fff6e8", "#ffd94a"' },
  circus: { coin: "stripedball", fn: "drawStripedBallCoin", args: '["#e0325c", "#ffffff"]' },
  beach: {
    coin: "stripedball",
    fn: "drawStripedBallCoin",
    args: '["#ff5a5a", "#ffe24a", "#5ab4ff", "#ffffff"]',
  },
};

for (const fn of fs
  .readdirSync(WORLDS_DIR)
  .filter(
    (f) => f.endsWith(".ts") && f !== "index.ts" && f !== "_shared.ts" && !f.endsWith(".d.ts"),
  )) {
  const worldKey = fn.replace(".ts", "");
  const sw = sharedWorlds[worldKey];
  const uniq = uniqueCoinNames[worldKey];

  let src = worlds[worldKey];

  // Remove old coin import/function
  src = src.replace(/\nimport \{ sharedCoin_\w+ \} from "\.\/_shared\.js";/, "");
  src = src.replace(/\nimport type \{ Ctx \} from "\.\.\/types\.js";\n/, "\n");
  src = src.replace(/\nexport function drawCoinDesign[\s\S]*?\n\}/, "");
  src = src.replace(/\nexport const drawCoinDesign = sharedCoin_\w+;/, "");

  // Add new coin import
  if (sw) {
    src += `\nimport { ${sw.fn} } from "../coins/${sw.coin}.js";\n`;
    src += `export function drawCoinDesign(ctx: Ctx, r: number) {\n`;
    src += `  ${sw.fn}(ctx, r, ${sw.args});\n`;
    src += `}\n`;
  } else if (uniq) {
    src += `\nimport { ${uniq.fn} } from "../coins/${uniq.name}.js";\n`;
    src += `export function drawCoinDesign(ctx: Ctx, r: number) {\n`;
    src += `  ${uniq.fn}(ctx, r);\n`;
    src += `}\n`;
  }

  // Clean up extra newlines
  src = src.replace(/\n\n\n+/g, "\n\n");

  fs.writeFileSync(path.join(WORLDS_DIR, fn), src);
}

// Update index.ts
let indexSrc = `// Auto-generated world registry
import type { Ctx } from "../types.js";
`;
for (const fn of fs
  .readdirSync(WORLDS_DIR)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "_shared.ts")
  .sort()) {
  const key = fn.replace(".ts", "");
  indexSrc += `import * as _${key} from "./${key}.js";\n`;
}
indexSrc += `\nexport const WORLDS: Record<string, { drawScenery: (ctx: Ctx, t: number) => void; drawCoinDesign: (ctx: Ctx, r: number) => void }> = {\n`;
for (const fn of fs
  .readdirSync(WORLDS_DIR)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "_shared.ts")
  .sort()) {
  const key = fn.replace(".ts", "");
  indexSrc += `  ${key}: { drawScenery: _${key}.drawScenery, drawCoinDesign: _${key}.drawCoinDesign },\n`;
}
indexSrc += `};\n`;
fs.writeFileSync(path.join(WORLDS_DIR, "index.ts"), indexSrc);

// Clean up _shared.ts (keep only what's still needed)
fs.unlinkSync(path.join(WORLDS_DIR, "_shared.ts"));

console.log("\nDone! Coin files in src/coins/, worlds updated.");
