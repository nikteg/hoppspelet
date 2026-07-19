export function drawRunestoneCoin(ctx, r) {
    // Runestone
    ctx.save();
    ctx.shadowColor = "rgba(180,220,220,0.7)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#8a9aa0";
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, r * 0.8);
    ctx.lineTo(-r * 0.7, -r * 0.4);
    ctx.lineTo(0, -r * 0.9);
    ctx.lineTo(r * 0.65, -r * 0.35);
    ctx.lineTo(r * 0.6, r * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#2c3a40";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.5);
    ctx.lineTo(0, r * 0.45);
    ctx.moveTo(0, -r * 0.15);
    ctx.lineTo(r * 0.3, -r * 0.45);
    ctx.moveTo(0, r * 0.05);
    ctx.lineTo(r * 0.3, -r * 0.25);
    ctx.stroke();
    ctx.restore();
}
