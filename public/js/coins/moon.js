export function drawMoonCoin(ctx, r) {
    // Full moon with craters
    ctx.save();
    ctx.shadowColor = "rgba(220,230,255,0.8)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#dfe4ee";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(120,130,150,0.6)";
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.15, r * 0.2, 0, Math.PI * 2);
    ctx.arc(r * 0.25, r * 0.3, r * 0.14, 0, Math.PI * 2);
    ctx.arc(r * 0.2, -r * 0.4, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
