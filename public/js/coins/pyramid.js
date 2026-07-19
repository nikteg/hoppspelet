export function drawPyramidCoin(ctx, r) {
    ctx.save();
    ctx.shadowColor = "rgba(255,220,120,0.9)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#e8c26a";
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.9, r * 0.7);
    ctx.lineTo(-r * 0.9, r * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(140,90,20,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r * 0.7);
    ctx.stroke();
    ctx.restore();
}
