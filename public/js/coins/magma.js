export function drawMagmaCoin(ctx, r, midColor) {
    // Glowing magma lump with dark, cracked crust
    ctx.save();
    ctx.shadowColor = "rgba(255,140,40,0.9)";
    ctx.shadowBlur = 14;
    const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
    g.addColorStop(0, "#fff1b8");
    g.addColorStop(0.55, midColor);
    g.addColorStop(1, "#7a2410");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(40,10,5,0.7)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.3);
    ctx.lineTo(-r * 0.05, -r * 0.05);
    ctx.lineTo(-r * 0.3, r * 0.45);
    ctx.moveTo(r * 0.15, -r * 0.55);
    ctx.lineTo(r * 0.3, 0);
    ctx.lineTo(r * 0.6, r * 0.2);
    ctx.stroke();
    ctx.restore();
}
