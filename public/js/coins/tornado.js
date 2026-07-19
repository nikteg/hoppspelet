export function drawTornadoCoin(ctx, r) {
    // Filled vortex funnel with wind bands and flying debris
    ctx.save();
    ctx.shadowColor = "rgba(230,225,170,0.8)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#e8e0b0";
    ctx.strokeStyle = "#3a3520";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.95, -r * 0.85);
    ctx.quadraticCurveTo(0, -r * 1.15, r * 0.95, -r * 0.85);
    ctx.quadraticCurveTo(r * 0.55, -r * 0.25, r * 0.3, r * 0.15);
    ctx.quadraticCurveTo(r * 0.18, r * 0.6, r * 0.05, r * 1.0);
    ctx.quadraticCurveTo(-r * 0.12, r * 0.5, -r * 0.28, r * 0.1);
    ctx.quadraticCurveTo(-r * 0.6, -r * 0.3, -r * 0.95, -r * 0.85);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Vindband tvars over tratten
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(90,82,40,0.55)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.62, -r * 0.5);
    ctx.quadraticCurveTo(0, -r * 0.3, r * 0.6, -r * 0.52);
    ctx.moveTo(-r * 0.32, 0);
    ctx.quadraticCurveTo(0, r * 0.14, r * 0.32, -r * 0.02);
    ctx.moveTo(-r * 0.14, r * 0.5);
    ctx.quadraticCurveTo(0, r * 0.6, r * 0.15, r * 0.48);
    ctx.stroke();
    // Skrap som virvlar runt
    ctx.fillStyle = "#6a4a20";
    ctx.save();
    ctx.translate(-r * 1.05, -r * 0.15);
    ctx.rotate(0.5);
    ctx.fillRect(-r * 0.18, -r * 0.07, r * 0.36, r * 0.14);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(r * 0.85, -r * 0.1, r * 0.09, 0, Math.PI * 2);
    ctx.arc(r * 0.6, r * 0.55, r * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
