export function drawRuneCoin(ctx, r) {
    ctx.save();
    ctx.shadowColor = "rgba(200,230,255,0.8)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#8a95a0";
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.85, r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e8eef2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.6);
    ctx.lineTo(0, r * 0.6);
    ctx.moveTo(-r * 0.4, -r * 0.3);
    ctx.lineTo(r * 0.4, r * 0.3);
    ctx.stroke();
    ctx.restore();
}
