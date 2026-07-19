const fs = require("fs");
const path = require("path");

for (const fn of fs
  .readdirSync("src/worlds")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
  const fp = path.join("src/worlds", fn);
  let src = fs.readFileSync(fp, "utf8");
  const lines = src.split("\n");

  // Check if viewH is used outside the import line
  const nonImportLines = lines.filter((l) => !l.includes("import"));
  const usesViewH = nonImportLines.some((l) => l.includes("viewH"));
  if (!usesViewH) {
    src = src.replace("viewW, viewH, GROUND_Y", "viewW, GROUND_Y");
  }

  // Check if GROUND_Y is used outside the import line
  const usesGroundY = nonImportLines.some((l) => l.includes("GROUND_Y"));
  if (!usesGroundY) {
    src = src.replace("viewW, GROUND_Y", "viewW");
    src = src.replace(/import \{ viewW, GROUND_Y \} from/, "import { viewW } from");
  }

  // Check if game is used outside the import line
  const usesGame = nonImportLines.some((l) => l.includes("game."));
  if (!usesGame) {
    src = src.replace(/import \{ game \} from "\.\.\/state\.js";\n/, "");
  }

  // Check if t (the param) is used in the scenery body
  if (src.includes("export function drawScenery(ctx: Ctx, t: number)")) {
    const fnBodyStart = src.indexOf("export function drawScenery(ctx: Ctx, t: number)") + 48;
    const fnBodyEnd = src.indexOf("\n}\n", fnBodyStart);
    const fnBody = src.slice(fnBodyStart, fnBodyEnd);
    // Check for `t` as a standalone identifier (not part of other words)
    if (!/\bt\b/.test(fnBody)) {
      src = src.replace(
        "export function drawScenery(ctx: Ctx, t: number)",
        "export function drawScenery(ctx: Ctx, _t: number)",
      );
    }
  }

  fs.writeFileSync(fp, src);
}

// Fix robot.ts: drawGearSpike is used by its scenery, so don't remove it
// (The previous fix script removed it, leading to TS2304)
// This should be fixed by the fix above not touching it

console.log("Fixed");
