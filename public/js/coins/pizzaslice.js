export function drawPizzaSliceCoin(ctx, r) {
    // Pizza slice with pepperoni
    ctx.save();
    ctx.rotate(0.3);
    ctx.shadowColor = "rgba(255,180,90,0.8)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#f2c268";
    ctx.beginPath();
    ctx.moveTo(0, r);
    ctx.lineTo(-r * 0.62, -r * 0.62);
    ctx.quadraticCurveTo(0, -r * 0.95, r * 0.62, -r * 0.62);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#c9622a";
    ctx.lineWidth = r * 0.18;
    ctx.beginPath();
    ctx.moveTo(-r * 0.62, -r * 0.62);
    ctx.quadraticCurveTo(0, -r * 0.95, r * 0.62, -r * 0.62);
    ctx.stroke();
    ctx.fillStyle = "#c0392b";
    for (const p of [
        [-0.15, -0.35],
        [0.2, -0.1],
        [-0.05, 0.3],
    ]) {
        ctx.beginPath();
        ctx.arc(p[0] * r, p[1] * r, r * 0.13, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}
