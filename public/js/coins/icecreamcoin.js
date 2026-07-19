export function drawIceCreamCoin(ctx, r) {
    // Ice cream cone with strawberry scoop
    ctx.save();
    ctx.shadowColor = "rgba(255,200,225,0.8)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#e8b56a";
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.05);
    ctx.lineTo(r * 0.5, -r * 0.05);
    ctx.lineTo(0, r);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(120,70,20,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, r * 0.25);
    ctx.lineTo(r * 0.1, -r * 0.02);
    ctx.moveTo(-r * 0.05, r * 0.6);
    ctx.lineTo(r * 0.32, r * 0.12);
    ctx.stroke();
    ctx.fillStyle = "#ffb0d0";
    ctx.beginPath();
    ctx.arc(0, -r * 0.4, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff0f8";
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.55, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
