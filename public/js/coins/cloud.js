export function drawCloudCoin(ctx, r) {
    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.9)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-r * 0.4, r * 0.15, r * 0.55, 0, Math.PI * 2);
    ctx.arc(r * 0.3, r * 0.1, r * 0.65, 0, Math.PI * 2);
    ctx.arc(0, -r * 0.3, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
