export function drawWispCoin(ctx, r, color) {
    // Will-o'-wisp - self-illuminating orb with a small tail
    const col = color;
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
