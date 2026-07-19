"use strict";
import type { Ctx, Theme } from "./types.js";
import { WORLDS } from "./worlds/index.js";

export function drawScenery(ctx: Ctx, theme: Theme, t: number) {
  WORLDS[theme.key]?.drawScenery(ctx, t);
}
