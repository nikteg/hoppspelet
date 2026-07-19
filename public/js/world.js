// ---------- Världen ----------
// Temaval och nivåprogression (var 1000:e points byts värld), plus
// resetGame som nollställer rundans tillstånd. Temadatan bor i themes.ts,
// particles och skärmstorlek i stage.ts.
import { THEMES } from "./themes.js";
import { game, getScore, player, PLAYER_SIZE } from "./state.js";
import { GROUND_Y } from "./stage.js";
export const level = {
    offset: 0, // vilken nivå den aktuella omgången starts på
    pending: 0, // nivå som nästa omgång ska start på (sätts vid död)
    debugOverride: null, // sätts av pil-knapparna för att bläddra fritt bland themes
    appliedIndex: -1, // theme som för närvarande är applicerat (bakgrund m.m.)
    announceUntil: 0, // tidpunkt (ms) då temanamnet slutar visas
};
export function currentThemeIndex() {
    if (level.debugOverride !== null)
        return level.debugOverride;
    return (level.offset + Math.floor(getScore() / 1000)) % THEMES.length;
}
// ---------- Debug buttons (temabyte) ----------
export function debugGoToTheme(delta) {
    const cur = currentThemeIndex();
    level.debugOverride = (((cur + delta) % THEMES.length) + THEMES.length) % THEMES.length;
}
export function resetGame() {
    player.y = GROUND_Y - PLAYER_SIZE;
    player.vy = 0;
    player.onGround = true;
    player.rotation = 0;
    game.obstacles = [];
    game.coins = [];
    game.floatingTexts = [];
    game.coinScore = 0;
    game.coinSpawnTimer = 0;
    game.coinNextSpawnAt = 40 + Math.random() * 40;
    game.speed = 6;
    game.distance = 0;
    game.spawnTimer = 0;
    game.nextSpawnAt = 60 + Math.random() * 40;
    level.appliedIndex = -1;
    level.announceUntil = 0;
    // Har man valt en nivå med pil-knapparna starts omgången där - så att
    // man kan prova en specifik nivå. Annars startas på nivån man senast dog
    // på. Overriden släpps sedan så att nivån fortsätter bytas per 1000 points.
    if (level.debugOverride !== null) {
        level.offset = level.debugOverride;
    }
    else {
        level.offset = level.pending;
    }
    level.debugOverride = null;
}
