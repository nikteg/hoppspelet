export function drawDieCoin(ctx, r) {
    // Die
    ctx.save();
    ctx.rotate(0.2);
    ctx.shadowColor = "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#ffffff";
    const s = r * 0.72;
    ctx.fillRect(-s, -s, s * 2, s * 2);
    ctx.fillStyle = "#e0325c";
    for (const p of [
        [-0.45, -0.45],
        [0.45, -0.45],
        [0, 0],
        [-0.45, 0.45],
        [0.45, 0.45],
    ]) {
        ctx.beginPath();
        ctx.arc(p[0] * s * 1.2, p[1] * s * 1.2, r * 0.11, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}
