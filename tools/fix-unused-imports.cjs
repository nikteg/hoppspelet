const fs = require("fs");
const path = require("path");

// All known render-helper function names
const helpers = [
  "drawBird",
  "drawDriftingClouds",
  "drawFallingStreaks",
  "drawFirework",
  "drawFish",
  "drawFloatingIsland",
  "drawFlutterfly",
  "drawGroundProp",
  "drawHangingVine",
  "drawIceberg",
  "drawJaggedSilhouette",
  "drawLantern",
  "drawPillar",
  "drawRainbow",
  "drawShootingStar",
  "drawSwayingTree",
  "drawTowerRow",
  "drawWavingBanner",
  "drawBalloon",
];

// Fix world files: remove unused render-helper imports, viewH, game
for (const fn of fs
  .readdirSync("src/worlds")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
  const fp = path.join("src/worlds", fn);
  let src = fs.readFileSync(fp, "utf8");

  // Find which helpers are actually used in the scenery function
  const used = helpers.filter((h) => src.includes(h + "("));

  // Rebuild the imports
  let newSrc = src;

  // Remove the old import block
  const importStart = newSrc.indexOf("import {\n  drawBird");
  if (importStart >= 0) {
    const importEnd = newSrc.indexOf("} from", importStart) + 1;
    // Find the closing of the import
    const closing = newSrc.indexOf(";", importEnd);
    if (used.length === 0) {
      // No helpers used - remove import and lines before it
      const prevNewline = newSrc.lastIndexOf("\n", importStart);
      newSrc =
        newSrc.slice(0, prevNewline >= 0 ? prevNewline : importStart) + newSrc.slice(closing + 1);
    } else {
      // Replace with minimal import
      const indent = "  ";
      const importLines = used.map((h) => `${indent}${h}`).join(",\n");
      const newImport = `import {\n${importLines},\n} from "../render-helpers.js";`;
      newSrc = newSrc.slice(0, importStart) + newImport + newSrc.slice(closing + 1);
    }
  }

  // Remove unused `game` import
  if (!newSrc.includes("game.") && !newSrc.includes("game,")) {
    newSrc = newSrc.replace(/import \{ game \} from "\.\.\/state\.js";\n/, "");
  }

  // Remove unused `viewH` import (check if viewH is used)
  if (!newSrc.includes("viewH")) {
    newSrc = newSrc.replace(/, viewH/, "").replace(/viewH, /, "");
  }

  // Remove duplicate empty lines
  newSrc = newSrc.replace(/\n\n\n+/g, "\n\n");

  fs.writeFileSync(fp, newSrc);
}

// Fix coin files: remove unused drawStarShape/drawGearSpike
for (const fn of fs.readdirSync("src/coins").filter((f) => f.endsWith(".ts"))) {
  const fp = path.join("src/coins", fn);
  let src = fs.readFileSync(fp, "utf8");

  const usesStarShape = src.includes("drawStarShape(");
  const usesGearSpike = src.includes("drawGearSpike(");

  if (!usesStarShape && !usesGearSpike) {
    // Remove the sprites import entirely
    src = src.replace(
      /import \{ (drawStarShape|drawGearSpike)(, (drawStarShape|drawGearSpike))? \} from "\.\.\/sprites\.js";\n/,
      "",
    );
  } else if (usesStarShape && !usesGearSpike) {
    src = src.replace(
      /import \{ drawStarShape, drawGearSpike \} from/,
      "import { drawStarShape } from",
    );
  } else if (!usesStarShape && usesGearSpike) {
    src = src.replace(
      /import \{ drawStarShape, drawGearSpike \} from/,
      "import { drawGearSpike } from",
    );
  }

  src = src.replace(/\n\n\n+/g, "\n\n");
  fs.writeFileSync(fp, src);
}

// Fix sprites.ts: remove unused GROUND_Y import
let sprites = fs.readFileSync("src/sprites.ts", "utf8");
sprites = sprites.replace(/, GROUND_Y/, "");
fs.writeFileSync("src/sprites.ts", sprites);

// Fix render-helpers.ts: remove unused speed parameter in drawFallingStreaks and drawDriftingClouds
// These have `speed` in the parameter list but it's not used in the body
// Actually, let me check - the bodies compute speed differently

console.log("Fixed unused imports");
