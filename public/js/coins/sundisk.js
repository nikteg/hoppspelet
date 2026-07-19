export function drawSunDiskCoin(ctx, r, embossed) {
    // Sun disk with rays; the Aztec variant gets an embossed face
    const az = embossed;
    ctx.save();
    ctx.shadowColor = "rgba(255,220,90,0.9)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = az ? "#ffd85a" : "#ffc44a";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.18) * r * 0.62, Math.sin(a - 0.18) * r * 0.62);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(Math.cos(a + 0.18) * r * 0.62, Math.sin(a + 0.18) * r * 0.62);
        ctx.closePath();
        ctx.fill();
    }
    if (az) {
        ctx.fillStyle = "rgba(90,50,10,0.8)";
        ctx.beginPath();
        ctx.arc(-r * 0.18, -r * 0.1, r * 0.08, 0, Math.PI * 2);
        ctx.arc(r * 0.18, -r * 0.1, r * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-r * 0.14, r * 0.14, r * 0.28, r * 0.08);
    }
    ctx.restore();
}
