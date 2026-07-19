export function drawAppleCoin(ctx, r) {
    // Red apple with leaf
    ctx.save();
    ctx.shadowColor = "rgba(255,140,140,0.8)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#e0483a";
    ctx.beginPath();
    ctx.arc(-r * 0.25, r * 0.1, r * 0.55, 0, Math.PI * 2);
    ctx.arc(r * 0.25, r * 0.1, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#6a4a28";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.35);
    ctx.lineTo(0, -r * 0.8);
    ctx.stroke();
    ctx.fillStyle = "#5a8a2a";
    ctx.beginPath();
    ctx.ellipse(r * 0.25, -r * 0.7, r * 0.28, r * 0.14, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
