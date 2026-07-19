// ---------- Text drawing helpers ----------
// Aligned text without manual ctx.textAlign/textBaseline juggling
// or text-width math. All helpers save/restore the context state.
/** Draw text anchored at (x, y) according to align/baseline.
 *
 *    // top-left HUD (same as plain fillText):
 *    drawText(ctx, "Score: 10", 10, 10);
 *    // right-aligned against the right edge — no width guessing:
 *    drawText(ctx, "controls", w - 10, 10, { align: "right" });
 *    // sits ON the bottom edge, never dips below it:
 *    drawText(ctx, "hint", 10, h - 8, { baseline: "bottom" }); */
export function drawText(ctx, str, x, y, style = {}) {
    ctx.save();
    ctx.font = style.font ?? "16px monospace";
    ctx.fillStyle = style.color ?? "#fff";
    ctx.textAlign = style.align ?? "left";
    ctx.textBaseline = style.baseline ?? "top";
    ctx.fillText(str, x, y);
    ctx.restore();
}
/** Text centered horizontally and vertically on (cx, cy).
 *  The standard choice for overlay headlines. */
export function drawCentered(ctx, str, cx, cy, style = {}) {
    drawText(ctx, str, cx, cy, { ...style, align: "center", baseline: "middle" });
}
/** Same-style multi-line text block, vertically centered on cy.
 *  `lineHeight` defaults to 24. */
export function drawCenteredBlock(ctx, lines, cx, cy, style = {}) {
    const lh = style.lineHeight ?? 24;
    const top = cy - ((lines.length - 1) * lh) / 2;
    for (let i = 0; i < lines.length; i++) {
        drawCentered(ctx, lines[i], cx, top + i * lh, style);
    }
}
