const fs = require("fs");
const path = require("path");

// Fix world files: add back import type { Ctx }
for (const fn of fs
  .readdirSync("src/worlds")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
  let src = fs.readFileSync(path.join("src/worlds", fn), "utf8");

  // Add Ctx import after first line if missing
  if (!src.includes("import type { Ctx }")) {
    const lines = src.split("\n");
    lines.splice(1, 0, 'import type { Ctx } from "../types.js";');
    src = lines.join("\n");
  }

  // Remove any duplicate Ctx imports
  const lines = src.split("\n");
  let seen = false;
  const result = [];
  for (const l of lines) {
    if (l.includes("import type { Ctx }")) {
      if (!seen) {
        result.push(l);
        seen = true;
      }
    } else {
      result.push(l);
    }
  }
  src = result.join("\n").replace(/\n\n\n+/g, "\n\n");
  fs.writeFileSync(path.join("src/worlds", fn), src);
}

// Create default gold coin
const goldCoin = `// Default gold coin
import type { Ctx } from "../types.js";

export function drawGoldCoin(ctx: Ctx, r: number) {
      ctx.save();
      ctx.shadowColor = "rgba(255,210,80,0.9)";
      ctx.shadowBlur = 12;
      const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
      g.addColorStop(0, "#fff6c8");
      g.addColorStop(0.5, "#ffd54a");
      g.addColorStop(1, "#c98b1f");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
}
`;
fs.writeFileSync("src/coins/gold.ts", goldCoin);

console.log("Fixed world files and created gold coin");
