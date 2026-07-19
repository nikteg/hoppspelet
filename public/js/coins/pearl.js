export function drawPearlCoin(ctx, r) {
    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.7)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "rgba(150,220,210,0.55)";
    ctx.beginPath();
    ctx.ellipse(0, r * 0.3, r * 1.3, r * 0.6, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = "#eafdf6";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
