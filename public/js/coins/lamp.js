export function drawLampCoin(ctx, r) {
    // Warm streetlamp glow with light flare
    ctx.save();
    ctx.shadowColor = "rgba(255,200,110,0.95)";
    ctx.shadowBlur = 16;
    const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 0.8);
    g.addColorStop(0, "#fff6d8");
    g.addColorStop(1, "#ffb84a");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,230,170,0.8)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.stroke();
    ctx.restore();
}
