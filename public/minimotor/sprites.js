// ---------- Sprite pre-rendering ----------
// Pre-render expensive drawing operations (shadowBlur, gradients) to an
// offscreen canvas once, then blit with drawImage each frame.
const cache = new Map();
/** Get or create a pre-rendered sprite canvas keyed by `cacheKey`.
 *  `size` is the logical size in CSS pixels.
 *  `dpr` is the device pixel ratio for sharp rendering.
 *  `draw` is called once with the offscreen 2D context (already DPR-scaled
 *  and translated to center). */
export function getSprite(cacheKey, size, dpr, draw) {
    let sprite = cache.get(cacheKey);
    if (!sprite) {
        sprite = document.createElement("canvas");
        sprite.width = Math.ceil(size * dpr);
        sprite.height = Math.ceil(size * dpr);
        sprite.logicalSize = size;
        const ctx = sprite.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.translate(size / 2, size / 2);
        draw(ctx);
        cache.set(cacheKey, sprite);
    }
    return sprite;
}
/** Clear the sprite cache (call on resize or theme change if needed). */
export function clearSpriteCache() {
    cache.clear();
}
