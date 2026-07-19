/**
 * Splits scenery.ts and sprites.ts switch cases into per-world files.
 * Uses line-range extraction based on known switch structure.
 *
 * Usage: npx tsx tools/extract-worlds.ts
 */
import * as fs from "fs";
import * as path from "path";

const WORLDS_DIR = "src/worlds";

// ---- Known start/end lines from the switch statements ----

// Read scenery.ts to find the switch
const sceneryLines = fs.readFileSync("src/scenery.ts", "utf8").split("\n");
const spritesLines = fs.readFileSync("src/sprites.ts", "utf8").split("\n");

// Find the drawScenery switch bounds by brace counting
let scSwitchStart = -1, scSwitchEnd = -1;
let braceDepth = 0;
let inScSwitch = false;
for (let i = 0; i < sceneryLines.length; i++) {
  if (!inScSwitch && sceneryLines[i].includes("switch (theme.key) {")) {
    scSwitchStart = i + 1;
    inScSwitch = true;
    braceDepth = 0;
  }
  if (inScSwitch) {
    for (const ch of sceneryLines[i]) {
      if (ch === "{") braceDepth++;
      if (ch === "}") braceDepth--;
    }
    if (braceDepth === 0 && scSwitchStart > 0 && i > scSwitchStart) {
      scSwitchEnd = i;
      break;
    }
  }
}

console.log(`Scenery switch: lines ${scSwitchStart}-${scSwitchEnd}`);

// Find the drawCoinDesign switch bounds by brace counting
let coinSwitchStart = -1, coinSwitchEnd = -1;
braceDepth = 0;
inScSwitch = false;
for (let i = 0; i < spritesLines.length; i++) {
  if (!inScSwitch && spritesLines[i].includes("switch (theme.key) {")) {
    coinSwitchStart = i + 1;
    inScSwitch = true;
    braceDepth = 0;
  }
  if (inScSwitch) {
    for (const ch of spritesLines[i]) {
      if (ch === "{") braceDepth++;
      if (ch === "}") braceDepth--;
    }
    if (braceDepth === 0 && coinSwitchStart > 0 && i > coinSwitchStart) {
      coinSwitchEnd = i;
      break;
    }
  }
}

console.log(`Coin switch: lines ${coinSwitchStart}-${coinSwitchEnd}`);

// ---- Extract scenery cases ----
// Each case starts with `    case "key":` or `    case "key": {`
// and ends before the next case or the switch close.
const scCases = new Map<string, string[]>();

let currentScKey = "";
let currentScLines: string[] = [];

for (let i = scSwitchStart; i < scSwitchEnd; i++) {
  const line = sceneryLines[i];
  const caseMatch = line.match(/^\s*case\s+"(\w+)":/);
  if (caseMatch) {
    // Save previous case
    if (currentScKey && currentScLines.length > 0) {
      scCases.set(currentScKey, currentScLines);
    }
    currentScKey = caseMatch[1];
    currentScLines = [];
  } else if (currentScKey) {
    currentScLines.push(line);
  }
}
if (currentScKey && currentScLines.length > 0) {
  scCases.set(currentScKey, currentScLines);
}

console.log(`Extracted ${scCases.size} scenery cases`);

// Remove trailing break/close from scenery cases more carefully.
// The switch cases end with `break;` and optionally a closing `}` (if the case used braces).
// We strip these but NOT internal closing braces.
for (const [key, lines] of scCases) {
  // Remove trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();
  // Remove trailing `break;`
  if (lines.length > 0 && lines[lines.length - 1].trim() === "break;") lines.pop();
  // Remove trailing empty lines again
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();
  // Remove trailing `}` that closes the case block (only if the case used braces).
  // The case opens with `case "key": {` which has brace depth +1. We strip only the matching `}`.
  // But we can't easily distinguish from internal `}` at same indent. Instead, count braces.
  let depth = 0;
  for (const line of lines) {
    for (const ch of line) {
      if (ch === "{") depth++;
      if (ch === "}") depth--;
    }
  }
  // If depth is positive, the case opened with `{` and we're missing the closing `}`.
  // Add it back (the stripper removed too many).
  while (depth > 0) { lines.push("}"); depth--; }
}

// ---- Extract coin design cases (handle multi-label cases) ----
const coinCases = new Map<string, string[]>();
let currentCoinKeys: string[] = [];
let currentCoinLines: string[] = [];

for (let i = coinSwitchStart; i < coinSwitchEnd; i++) {
  const line = spritesLines[i];
  const caseMatch = line.match(/^\s*case\s+"(\w+)":/);
  if (caseMatch) {
    // New case label - if we have accumulated content, save to all current keys
    if (currentCoinKeys.length > 0 && currentCoinLines.some(l => l.trim().length > 0)) {
      for (const k of currentCoinKeys) {
        // Only save if not already set (first occurrence wins)
        if (!coinCases.has(k)) coinCases.set(k, [...currentCoinLines]);
      }
    }
    currentCoinKeys.push(caseMatch[1]);
    currentCoinLines = [];
  } else if (line.trim() === "default:") {
    if (currentCoinKeys.length > 0 && currentCoinLines.some(l => l.trim().length > 0)) {
      for (const k of currentCoinKeys) {
        if (!coinCases.has(k)) coinCases.set(k, [...currentCoinLines]);
      }
    }
    currentCoinKeys = ["default"];
    currentCoinLines = [];
  } else if (currentCoinKeys.length > 0) {
    currentCoinLines.push(line);
  }
}
// Save final case
if (currentCoinKeys.length > 0 && currentCoinLines.some(l => l.trim().length > 0)) {
  for (const k of currentCoinKeys) {
    if (!coinCases.has(k)) coinCases.set(k, [...currentCoinLines]);
  }
}

console.log(`Extracted ${coinCases.size} coin cases`);

// Balance braces in extracted coin cases
for (const [key, lines] of coinCases) {
  if (key === "default") continue;
  // Remove trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();
  // Remove trailing `}` that closes the case block (the `{` was on the case label line)
  if (lines.length > 0 && lines[lines.length - 1].trim() === "}") lines.pop();
  // Remove trailing `break;`
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();
  if (lines.length > 0 && lines[lines.length - 1].trim() === "break;") lines.pop();
  // Count brace balance and add missing closing braces for any remaining imbalance
  let depth = 0;
  for (const line of lines) {
    for (const ch of line) {
      if (ch === "{") depth++;
      if (ch === "}") depth--;
    }
  }
  while (depth > 0) { lines.push("}"); depth--; }
}

// ---- Read theme keys from themes.ts ----
const themesSrc = fs.readFileSync("src/themes.ts", "utf8");
const themeKeyRegex = /key:\s*"(\w+)"/g;
const themeKeys: string[] = [];
let tm: RegExpExecArray | null;
while ((tm = themeKeyRegex.exec(themesSrc)) !== null) {
  themeKeys.push(tm[1]);
}

console.log(`Found ${themeKeys.length} themes: ${themeKeys.join(", ")}`);

// ---- Detect shared coin designs ----
// Two themes share a coin design if their extracted coin case lines are identical
const coinDesignKeys = new Map<string, string[]>(); // normalized code -> keys
for (const key of themeKeys) {
  const lines = coinCases.get(key);
  if (!lines) continue;
  // Normalize: trim, remove empty and comment-only lines
  const normalized = lines
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .join("\n");
  if (!normalized) continue;
  const existing = coinDesignKeys.get(normalized);
  if (existing) {
    existing.push(key);
  } else {
    coinDesignKeys.set(normalized, [key]);
  }
}

const sharedCoins = [...coinDesignKeys.entries()]
  .filter(([_, keys]) => keys.length > 1)
  .map(([code, keys]) => ({ primary: keys[0], keys, rawLines: coinCases.get(keys[0])! }));

console.log(`Found ${sharedCoins.length} shared coin designs: ${sharedCoins.map(s => s.keys.join("/")).join(", ")}`);

// ---- Generate _shared.ts ----
let sharedSrc = `// Shared coin designs used by multiple worlds.\nimport type { Ctx } from "../types.js";\nimport { drawStarShape, drawGearSpike } from "../sprites.js";\n\n`;
for (const { primary, keys } of sharedCoins) {
  sharedSrc += `// Used by: ${keys.join(", ")}\n`;
  sharedSrc += `export function sharedCoin_${primary}(ctx: Ctx, r: number, key: string) {\n`;
  const lines = coinCases.get(primary)!;
  const startIdx = lines[0]?.trim() === "{" ? 1 : 0;
  let body = lines.slice(startIdx).join("\n");
  // Replace theme.key references with the key parameter
  body = body.replace(/theme\.key/g, "key");
  sharedSrc += body + "\n}\n\n";
}

// Also add default gold coin
const defaultLines = coinCases.get("default");
if (defaultLines) {
  sharedSrc += `// Default gold coin for worlds without a custom design
`;
  sharedSrc += `export function sharedCoin_default(ctx: Ctx, r: number) {
`;
  const startIdx = defaultLines[0]?.trim() === "{" ? 1 : 0;
  const body = defaultLines.slice(startIdx).join("\n");
  // Replace theme.key references with a static default
  sharedSrc += body.replace(/theme\.key/g, '"default"') + "\n}\n";
}

fs.writeFileSync(path.join(WORLDS_DIR, "_shared.ts"), sharedSrc);

// ---- Generate per-world files ----
const sceneryImports = `import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { game } from "../state.js";
import {
  drawBird,
  drawDriftingClouds,
  drawFallingStreaks,
  drawFirework,
  drawFish,
  drawFloatingIsland,
  drawFlutterfly,
  drawGroundProp,
  drawHangingVine,
  drawIceberg,
  drawJaggedSilhouette,
  drawLantern,
  drawPillar,
  drawRainbow,
  drawShootingStar,
  drawSwayingTree,
  drawTowerRow,
  drawWavingBanner,
  drawBalloon,
} from "../render-helpers.js";
`;

let generated = 0;
let indexSrc = `// Auto-generated world registry\nimport type { Ctx } from "../types.js";\n`;

for (const key of themeKeys) {
  const scLines = scCases.get(key);
  const coinLines = coinCases.get(key);

  // Determine if this world uses a shared coin design
  const sharedEntry = sharedCoins.find(s => s.keys.includes(key));
  const usesSharedCoin = sharedEntry !== undefined;
  const sharedPrimary = usesSharedCoin ? sharedEntry!.primary : null;

  let src = `// World: ${key}\n`;

  // Scenery imports and function
  if (scLines && scLines.some(l => l.trim().length > 0)) {
    src += sceneryImports;
    src += `\nexport function drawScenery(ctx: Ctx, t: number) {\n`;
    src += scLines.join("\n") + "\n}\n";
  } else {
    src += `import type { Ctx } from "../types.js";\n\n`;
    src += `export function drawScenery(_ctx: Ctx, _t: number) {}\n`;
  }

  // Coin design
  src += "\n";
  if (usesSharedCoin) {
    src += `import { sharedCoin_${sharedPrimary} } from "./_shared.js";\n`;
    src += `import type { Ctx } from "../types.js";\n\n`;
    src += `export function drawCoinDesign(ctx: Ctx, r: number) {\n`;
    src += `  sharedCoin_${sharedPrimary}(ctx, r, "${key}");\n`;
    src += `}\n`;
  } else if (coinLines && coinLines.some(l => l.trim().length > 0)) {
    if (!scLines || !scLines.some(l => l.trim().length > 0)) {
      src = `import type { Ctx } from "../types.js";\n`;
      src += `import { drawStarShape, drawGearSpike } from "../sprites.js";\n\n`;
      src += `export function drawScenery(_ctx: Ctx, _t: number) {}\n\n`;
      src += `export function drawCoinDesign(ctx: Ctx, r: number) {\n`;
      const startIdx = coinLines[0]?.trim() === "{" ? 1 : 0;
      src += coinLines.slice(startIdx).join("\n") + "\n}\n";
    } else {
      src += `import { drawStarShape, drawGearSpike } from "../sprites.js";\n\n`;
      src += `export function drawCoinDesign(ctx: Ctx, r: number) {\n`;
      const startIdx = coinLines[0]?.trim() === "{" ? 1 : 0;
      src += coinLines.slice(startIdx).join("\n") + "\n}\n";
    }
  } else {
    if (!scLines || !scLines.some(l => l.trim().length > 0)) {
      src = `import type { Ctx } from "../types.js";\n\n`;
      src += `export function drawScenery(_ctx: Ctx, _t: number) {}\n\n`;
    }
    src += `import { sharedCoin_default } from "./_shared.js";\n`;
    src += `export const drawCoinDesign = sharedCoin_default;\n`;
  }

  fs.writeFileSync(path.join(WORLDS_DIR, `${key}.ts`), src);
  generated++;
  indexSrc += `import * as _${key} from "./${key}.js";\n`;
}

// Generate index
indexSrc += `\nexport const WORLDS: Record<string, { drawScenery: (ctx: Ctx, t: number) => void; drawCoinDesign: (ctx: Ctx, r: number) => void }> = {\n`;
for (const key of themeKeys) {
  indexSrc += `  ${key}: { drawScenery: _${key}.drawScenery, drawCoinDesign: _${key}.drawCoinDesign },\n`;
}
indexSrc += `};\n`;

fs.writeFileSync(path.join(WORLDS_DIR, "index.ts"), indexSrc);

console.log(`Generated ${generated} world files.`);
console.log("Done!");
