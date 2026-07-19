"use strict";
import { WORLDS } from "./worlds/index.js";
export function drawScenery(ctx, theme, t) {
    WORLDS[theme.key]?.drawScenery(ctx, t);
}
