// Shared coin designs used by multiple worlds.
import type { Ctx } from "../types.js";
import { drawStarShape, drawGearSpike } from "../sprites.js";

// Used by: lava, volcanoisland
export function sharedCoin_lava(ctx: Ctx, r: number, key: string) {
      // Glowing magma lump with dark, cracked crust
      ctx.save();
      ctx.shadowColor = "rgba(255,140,40,0.9)";
      ctx.shadowBlur = 14;
      const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
      g.addColorStop(0, "#fff1b8");
      g.addColorStop(0.55, key === "lava" ? "#ff9a3a" : "#ff8a4a");
      g.addColorStop(1, "#7a2410");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(40,10,5,0.7)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r * 0.3);
      ctx.lineTo(-r * 0.05, -r * 0.05);
      ctx.lineTo(-r * 0.3, r * 0.45);
      ctx.moveTo(r * 0.15, -r * 0.55);
      ctx.lineTo(r * 0.3, 0);
      ctx.lineTo(r * 0.6, r * 0.2);
      ctx.stroke();
      ctx.restore();
}

// Used by: pirate, atlantis
export function sharedCoin_pirate(ctx: Ctx, r: number, key: string) {
      // Doubloon - shiny for pirates, tarnished/patinated in sunken Atlantis
      const gold = key === "pirate";
      ctx.save();
      ctx.shadowColor = gold ? "rgba(255,210,80,0.9)" : "rgba(90,220,230,0.8)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = gold ? "#d9a92f" : "#3fae9a";
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = gold ? "#8a641a" : "#1f6a5a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.42);
      ctx.lineTo(0, r * 0.42);
      ctx.moveTo(-r * 0.42, 0);
      ctx.lineTo(r * 0.42, 0);
      ctx.stroke();
      ctx.restore();
}

// Used by: savanna, aztec
export function sharedCoin_savanna(ctx: Ctx, r: number, key: string) {
      // Sun disk with rays; the Aztec variant gets an embossed face
      const az = key === "aztec";
      ctx.save();
      ctx.shadowColor = "rgba(255,220,90,0.9)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = az ? "#ffd85a" : "#ffc44a";
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.18) * r * 0.62, Math.sin(a - 0.18) * r * 0.62);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(Math.cos(a + 0.18) * r * 0.62, Math.sin(a + 0.18) * r * 0.62);
        ctx.closePath();
        ctx.fill();
      }
      if (az) {
        ctx.fillStyle = "rgba(90,50,10,0.8)";
        ctx.beginPath();
        ctx.arc(-r * 0.18, -r * 0.1, r * 0.08, 0, Math.PI * 2);
        ctx.arc(r * 0.18, -r * 0.1, r * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-r * 0.14, r * 0.14, r * 0.28, r * 0.08);
      }
      ctx.restore();
}

// Used by: crystal, fairy
export function sharedCoin_crystal(ctx: Ctx, r: number, key: string) {
      // Faceted gemstone with white facet lines
      const col = key === "crystal" ? "#5ff2e0" : "#ffe08a";
      ctx.save();
      ctx.shadowColor = col;
      ctx.shadowBlur = 14;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.6, -r * 0.2);
      ctx.lineTo(r * 0.35, r);
      ctx.lineTo(-r * 0.35, r);
      ctx.lineTo(-r * 0.6, -r * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(-r * 0.15, r * 0.2);
      ctx.moveTo(r * 0.6, -r * 0.2);
      ctx.lineTo(-r * 0.15, r * 0.2);
      ctx.stroke();
      ctx.restore();
}

// Used by: bog, mangrove, fog
export function sharedCoin_bog(ctx: Ctx, r: number, key: string) {
      // Will-o'-wisp - self-illuminating orb with a small tail
      const col = key === "fog" ? "rgba(220,235,225,0.95)" : "rgba(170,255,140,0.95)";
      ctx.save();
      ctx.shadowColor = col;
      ctx.shadowBlur = 16;
      const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 0.9);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.5, col);
      g.addColorStop(1, "rgba(140,200,140,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(r * 0.3, r * 0.55, r * 0.16, r * 0.32, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
}

// Used by: bamboo, canopy
export function sharedCoin_bamboo(ctx: Ctx, r: number, key: string) {
      // Leaf with center vein
      ctx.save();
      ctx.shadowColor = "rgba(200,255,150,0.8)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = key === "bamboo" ? "#a9d98a" : "#8aca5a";
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(r * 0.9, -r * 0.2, 0, r);
      ctx.quadraticCurveTo(-r * 0.9, -r * 0.2, 0, -r);
      ctx.fill();
      ctx.strokeStyle = "rgba(40,90,20,0.7)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.lineTo(0, r * 0.85);
      ctx.stroke();
      ctx.restore();
}

// Used by: reef, mermaid
export function sharedCoin_reef(ctx: Ctx, r: number, key: string) {
      // Shell with grooves
      ctx.save();
      ctx.shadowColor = "rgba(255,200,225,0.9)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = key === "reef" ? "#ff9ab8" : "#ffb8e0";
      ctx.beginPath();
      ctx.arc(0, -r * 0.1, r * 0.8, Math.PI, 0);
      ctx.lineTo(0, r * 0.85);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 1.3;
      for (let k = -2; k <= 2; k++) {
        ctx.beginPath();
        ctx.moveTo(0, r * 0.8);
        ctx.lineTo(k * r * 0.35, -r * 0.5);
        ctx.stroke();
      }
      ctx.restore();
}

// Used by: giant, mars
export function sharedCoin_giant(ctx: Ctx, r: number, key: string) {
      // Angular chunk - gold nugget for the giant, red ore on Mars
      const gold = key === "giant";
      ctx.save();
      ctx.shadowColor = gold ? "rgba(255,220,120,0.9)" : "rgba(255,150,90,0.8)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = gold ? "#e8b33a" : "#c05a2e";
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, r * 0.4);
      ctx.lineTo(-r * 0.5, -r * 0.5);
      ctx.lineTo(r * 0.15, -r * 0.8);
      ctx.lineTo(r * 0.8, -r * 0.2);
      ctx.lineTo(r * 0.6, r * 0.55);
      ctx.lineTo(-r * 0.2, r * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = gold ? "#fff0b0" : "rgba(60,20,10,0.5)";
      ctx.beginPath();
      ctx.arc(-r * 0.15, -r * 0.15, r * 0.16, 0, Math.PI * 2);
      ctx.arc(r * 0.3, r * 0.15, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
}

// Used by: sakura, spring
export function sharedCoin_sakura(ctx: Ctx, r: number, key: string) {
      // Flower with five petals
      const petal = key === "sakura" ? "#ffb0c8" : "#fff6e8";
      const center = key === "sakura" ? "#ff7a9a" : "#ffd94a";
      ctx.save();
      ctx.shadowColor = "rgba(255,220,235,0.9)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = petal;
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        ctx.beginPath();
        ctx.ellipse(
          Math.cos(a) * r * 0.5,
          Math.sin(a) * r * 0.5,
          r * 0.4,
          r * 0.28,
          a,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.fillStyle = center;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
}

// Used by: circus, beach
export function sharedCoin_circus(ctx: Ctx, r: number, key: string) {
      // Striped ball (red/white at the circus, multicolor beach ball at the beach)
      const cols =
        key === "circus"
          ? ["#e0325c", "#ffffff"]
          : ["#ff5a5a", "#ffe24a", "#5ab4ff", "#ffffff"];
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.shadowBlur = 10;
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r * 0.85, (Math.PI * 2 * i) / 6, (Math.PI * 2 * (i + 1)) / 6);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
}

