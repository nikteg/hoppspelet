export function drawFeatherCoin(ctx, r) {
    // Glowing phoenix feather
    ctx.save();
    ctx.rotate(0.5);
    ctx.shadowColor = "rgba(255,170,60,0.9)";
    ctx.shadowBlur = 12;
    const g = ctx.createLinearGradient(0, -r, 0, r);
    g.addColorStop(0, "#ffcf6a");
    g.addColorStop(1, "#ff6a3a");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.7, -r * 0.2, 0, r);
    ctx.quadraticCurveTo(-r * 0.7, -r * 0.2, 0, -r);
    ctx.fill();
    ctx.strokeStyle = "rgba(120,40,10,0.7)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.85);
    ctx.lineTo(0, r * 0.9);
    for (let k = 1; k <= 3; k++) {
        const yy = -r * 0.55 + k * r * 0.35;
        ctx.moveTo(0, yy);
        ctx.lineTo(-r * 0.4, yy + r * 0.18);
        ctx.moveTo(0, yy);
        ctx.lineTo(r * 0.4, yy + r * 0.18);
    }
    ctx.stroke();
    ctx.restore();
}
