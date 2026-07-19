export function drawLeafCoin(ctx, r, color) {
    // Leaf with center vein
    ctx.save();
    ctx.shadowColor = "rgba(200,255,150,0.8)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.9, -r * 0.2, 0, r);
    ctx.quadraticCurveTo(-r * 0.9, -r * 0.2, 0, -r);
    ctx.fill();
    ctx.strokeStyle = "rgba(40,90,20,0.7)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.85);
    ctx.lineTo(0, r * 0.85);
    ctx.stroke();
    ctx.restore();
}
