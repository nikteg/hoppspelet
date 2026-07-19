const fs = require("fs");
const path = require("path");

// Fix render-helpers: rename unused speed params to _speed
let rh = fs.readFileSync("src/render-helpers.ts", "utf8");
// In drawFallingStreaks, the `speed` param on line ~366 is unused (it uses game.speed instead)
// Replace the param in the function signature only
rh = rh.replace(
  "export function drawFallingStreaks(\n  ctx: Ctx,\n  t: number,\n  canvasW: number,\n  canvasH: number,\n  count: number,\n  color: string,\n  speed: number,\n  streakLen: number,\n)",
  "export function drawFallingStreaks(\n  ctx: Ctx,\n  t: number,\n  canvasW: number,\n  canvasH: number,\n  count: number,\n  color: string,\n  _speed: number,\n  streakLen: number,\n)",
);
rh = rh.replace(
  "export function drawDriftingClouds(\n  ctx: Ctx,\n  t: number,\n  color: string,\n  count: number,\n  yBase: number,\n  scale: number,\n  speed: number,\n)",
  "export function drawDriftingClouds(\n  ctx: Ctx,\n  t: number,\n  color: string,\n  count: number,\n  yBase: number,\n  scale: number,\n  _speed: number,\n)",
);
fs.writeFileSync("src/render-helpers.ts", rh);

// Fix world files
for (const fn of fs
  .readdirSync("src/worlds")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
  const fp = path.join("src/worlds", fn);
  let src = fs.readFileSync(fp, "utf8");

  // Fix 1: Remove unused viewH from import
  if (!src.includes("viewH")) {
    src = src.replace("viewW, viewH, GROUND_Y", "viewW, GROUND_Y");
  }

  // Fix 2: Fix stale coin-design import blocks (the ones with drawStarShape/drawGearSpike
  // that are left over after the earlier refactor)
  // These are blocks that ONLY import from sprites.ts and aren't used
  const lines = src.split("\n");
  const cleaned = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip import blocks that only import from sprites.js when the file already has a coin import from coins/
    if (
      line.includes('import { drawStarShape, drawGearSpike } from "../sprites.js";') ||
      line.includes('import { drawStarShape } from "../sprites.js";') ||
      line.includes('import { drawGearSpike } from "../sprites.js";')
    ) {
      // Skip this and the following empty line
      if (lines[i + 1]?.trim() === "") i++;
      continue;
    }
    cleaned.push(line);
  }
  src = cleaned.join("\n");

  // Fix 3: Remove empty import blocks: `import {\n} from "../render-helpers.js";`
  src = src.replace(/import \{\n\} from "\.\.\/render-helpers\.js";\n/, "");

  // Fix 4: Remove duplicate empty lines
  src = src.replace(/\n\n\n+/g, "\n\n");

  // Fix 5: Rename unused `t` -> `_t` in drawScenery that doesn't use t
  if (src.includes("export function drawScenery(ctx: Ctx, t: number)")) {
    const fnBody = src.split("export function drawScenery(ctx: Ctx, t: number)")[1];
    // Check if `t` is used in the body (as a standalone word, not part of other words)
    if (fnBody && !/\bt\b/.test(fnBody.split("\n}\n")[0])) {
      src = src.replace(
        "export function drawScenery(ctx: Ctx, t: number)",
        "export function drawScenery(ctx: Ctx, _t: number)",
      );
    }
  }

  fs.writeFileSync(fp, src);
}

console.log("Fixed remaining unused imports");
