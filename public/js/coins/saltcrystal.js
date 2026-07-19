export function drawSaltCrystalCoin(ctx, r) {
    // White salt crystals in two facets
    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.9)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ffffff";
    ctx.save();
    ctx.rotate(-0.2);
    ctx.fillRect(-r * 0.5, -r * 0.7, r * 0.7, r * 1.3);
    ctx.restore();
    ctx.save();
    ctx.rotate(0.35);
    ctx.fillStyle = "#e4efec";
    ctx.fillRect(-r * 0.15, -r * 0.55, r * 0.55, r * 1.1);
    ctx.restore();
    ctx.restore();
}
