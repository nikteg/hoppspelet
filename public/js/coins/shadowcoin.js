export function drawShadowCoin(ctx, r) {
    // Dark coin with sharp white outline - fits the black-and-white world
    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.95)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}
