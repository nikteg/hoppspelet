export function drawPaletteCoin(ctx, r) {
    // Painter's palette with paint dabs
    ctx.save();
    ctx.shadowColor = "rgba(200,100,255,0.7)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#c9a072";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.arc(r * 0.35, r * 0.3, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
    const dabs = [
        ["#ff5a5a", -0.4, -0.35],
        ["#5ab4ff", 0.05, -0.5],
        ["#ffe066", 0.45, -0.15],
        ["#6fce7a", -0.5, 0.15],
    ];
    for (const d of dabs) {
        ctx.fillStyle = d[0];
        ctx.beginPath();
        ctx.arc(d[1] * r, d[2] * r, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}
