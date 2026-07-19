export function drawNeonCoin(ctx, r) {
    ctx.save();
    ctx.shadowColor = "rgba(0,255,255,0.9)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#0ff0fc";
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.75, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.75, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#ff2fb0";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}
