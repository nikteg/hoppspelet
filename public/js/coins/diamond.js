export function drawDiamondCoin(ctx, r) {
    ctx.save();
    ctx.shadowColor = "rgba(150,220,255,0.9)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#cdefff";
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.7, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
