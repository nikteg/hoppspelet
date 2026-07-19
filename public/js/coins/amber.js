export function drawAmberCoin(ctx, r) {
    // Amber lump with prehistoric insect
    ctx.save();
    ctx.shadowColor = "rgba(255,190,90,0.8)";
    ctx.shadowBlur = 10;
    const g = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 1, 0, 0, r * 0.85);
    g.addColorStop(0, "#ffd98a");
    g.addColorStop(1, "#b86a1f");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(60,30,10,0.75)";
    ctx.beginPath();
    ctx.ellipse(0, r * 0.05, r * 0.16, r * 0.24, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
