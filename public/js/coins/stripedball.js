export function drawStripedBallCoin(ctx, r, colors) {
    // Striped ball (red/white at the circus, multicolor beach ball at the beach)
    const cols = colors;
    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 10;
    for (let i = 0; i < 6; i++) {
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r * 0.85, (Math.PI * 2 * i) / 6, (Math.PI * 2 * (i + 1)) / 6);
        ctx.closePath();
        ctx.fill();
    }
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
