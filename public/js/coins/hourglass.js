export function drawHourglassCoin(ctx, r) {
    // Hourglass with flowing sand
    ctx.save();
    ctx.shadowColor = "rgba(255,220,150,0.9)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#8a6a3a";
    ctx.fillRect(-r * 0.7, -r * 0.95, r * 1.4, r * 0.2);
    ctx.fillRect(-r * 0.7, r * 0.75, r * 1.4, r * 0.2);
    ctx.fillStyle = "rgba(255,240,200,0.35)";
    ctx.beginPath();
    ctx.moveTo(-r * 0.55, -r * 0.75);
    ctx.lineTo(r * 0.55, -r * 0.75);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.moveTo(-r * 0.55, r * 0.75);
    ctx.lineTo(r * 0.55, r * 0.75);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffd98a";
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.75);
    ctx.lineTo(r * 0.3, -r * 0.75);
    ctx.lineTo(0, -r * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-r * 0.4, r * 0.75);
    ctx.lineTo(r * 0.4, r * 0.75);
    ctx.lineTo(0, r * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
