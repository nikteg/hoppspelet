export function drawBananaCoin(ctx, r) {
    ctx.save();
    ctx.shadowColor = "rgba(255,220,80,0.8)";
    ctx.shadowBlur = 10;
    const bananaGrad = ctx.createLinearGradient(-r, -r, r, r);
    bananaGrad.addColorStop(0, "#fff2a8");
    bananaGrad.addColorStop(0.5, "#ffd93d");
    bananaGrad.addColorStop(1, "#e2a92b");
    // Curved body: outer curve + flatter inner curve - thick in the middle
    // and tapering toward the tips, like a real banana.
    ctx.fillStyle = bananaGrad;
    ctx.beginPath();
    ctx.moveTo(-r * 1.15, r * 0.55);
    ctx.quadraticCurveTo(0, -r * 1.55, r * 1.1, -r * 0.5);
    ctx.lineTo(r * 1.0, -r * 0.32);
    ctx.quadraticCurveTo(0, -r * 0.35, -r * 1.02, r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(140,90,10,0.8)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // Ridge line along the middle for a bit of depth
    ctx.strokeStyle = "rgba(150,100,10,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, r * 0.32);
    ctx.quadraticCurveTo(0, -r * 0.95, r * 0.9, -r * 0.36);
    ctx.stroke();
    // Bright highlight along the top side
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = r * 0.12;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-r * 0.45, -r * 0.35);
    ctx.quadraticCurveTo(-r * 0.05, -r * 0.75, r * 0.45, -r * 0.65);
    ctx.stroke();
    // Stem at one end, brown tip at the other
    ctx.strokeStyle = "#6b4a1f";
    ctx.lineWidth = r * 0.16;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-r * 1.08, r * 0.46);
    ctx.lineTo(-r * 1.28, r * 0.6);
    ctx.stroke();
    ctx.fillStyle = "#6b4a1f";
    ctx.beginPath();
    ctx.arc(r * 1.08, -r * 0.5, r * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
