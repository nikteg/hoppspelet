export function drawShellCoin(ctx, r, color) {
    // Shell with grooves
    ctx.save();
    ctx.shadowColor = "rgba(255,200,225,0.9)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -r * 0.1, r * 0.8, Math.PI, 0);
    ctx.lineTo(0, r * 0.85);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 1.3;
    for (let k = -2; k <= 2; k++) {
        ctx.beginPath();
        ctx.moveTo(0, r * 0.8);
        ctx.lineTo(k * r * 0.35, -r * 0.5);
        ctx.stroke();
    }
    ctx.restore();
}
