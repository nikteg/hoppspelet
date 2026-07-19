export function drawSaucerCoin(ctx, r) {
    // Small saucer with dome and lights
    ctx.save();
    ctx.shadowColor = "rgba(140,255,160,0.9)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "rgba(150,255,180,0.85)";
    ctx.beginPath();
    ctx.arc(0, -r * 0.15, r * 0.45, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#9aa8b0";
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.95, r * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7aff9a";
    for (let k = -1; k <= 1; k++) {
        ctx.beginPath();
        ctx.arc(k * r * 0.5, r * 0.08, r * 0.09, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}
