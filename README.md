# Hoppspelet

A small canvas-based platform jumper. Jump over obstacles, collect coins — every 1000
points the track changes theme (60+ themes).

## Play locally

The game uses ES modules with an importmap, so you need to serve
the files — `file://` won't work. Simplest way:

```bash
pnpm dlx serve public
```

Open `http://localhost:3000` in your browser.

## Develop

The repo is a pnpm workspace. The game lives at the root and the game engine
(Minimotor) is a git submodule in `packages/minimotor/` linked in as
a workspace package.

```bash
pnpm install        # fetches typescript, oxlint, oxfmt + links minimotor
pnpm run build      # compiles engine -> public/minimotor/, game -> public/js/
pnpm run dev:all    # watch mode for both engine and game
pnpm run dev        # watch mode for just the game (tsc --watch)
pnpm run verify     # tsc --noEmit + oxlint + oxfmt --check in parallel
pnpm run format     # oxfmt .
```

The compiled files (`public/minimotor/*.js`, `public/js/*.js`) are checked in,
so the Docker build (which only copies `public/`) works without node/pnpm.
Run `pnpm run build` before deploying.

## Host with Docker (Portainer)

```bash
docker compose up -d --build
```

In Portainer: create a stack from the repo using `docker-compose.yml` +
`docker-compose.portainer.yml` (places the container on the external
`nginx` network for reverse proxy, same setup as niklas.tegnander.nu).

The container responds both on `/` and under `/hoppspelet/`, so a custom
location `/hoppspelet` in Nginx Proxy Manager works straight away — the
full path is forwarded unchanged to the container.

## PWA

The game is installable as a PWA (manifest + service worker) and works
offline after the first visit. The service worker is only registered over
https/localhost. The cache version is automatically stamped with the build
timestamp when the Docker image is built (`__BUILD_STAMP__` in `public/sw.js`
is replaced in the Dockerfile), so a new deploy invalidates old client caches
without manual version bumps. If hosting files outside the Docker image:
replace the stamp manually on deploy.

The icons in `public/icons/` are generated from `public/favicon.svg`
(macOS: `qlmanage -t -s 512 -o public/icons public/favicon.svg`).
The screenshots on the landing page (`public/assets/screens/`) are real
game captures. Regenerate them with `tools/capture-screens.js` — paste
the file into the browser console on the game page; it will stage the
scenes and download three jpg files (instructions in the file header).

## File structure

```
src/                  TypeScript source for the game (compiled to public/js/)
  types.d.ts          Shared global types (Theme, Obstacle, Coin, ...)
  state.ts            Constants, player/round state
  themes.ts           Theme data (colors/particles per theme)
  world.ts            Theme selection, particles, resize, resetGame
  audio.ts            WebAudio: music + sound effects
  gameplay.ts         Jump/death, obstacle and coin spawning
  input.ts            Keyboard, touch, debug/mute buttons
  update.ts           Physics, collisions, scoring (per frame)
  render-helpers.ts   Drawing helpers (ground, clouds, trees, ...)
  scenery.ts          Background scenes per theme
  sprites.ts          Player, coins, obstacles, UI texts
  main.ts             drawUI/draw + startup
packages/
  minimotor/          Git submodule: Minimotor, the game engine (reused in other projects)
    src/engine.ts     TypeScript source (minimal game loop + collision helpers)
public/
  index.html          Shell + landing page + script ordering + SW registration
  styles.css          All CSS
  minimotor/          Compiled Minimotor (built from packages/minimotor)
  js/                 Compiled game (built from src/)
  sw.js               Service worker (cache-first offline)
  manifest.webmanifest
  importmap            `type="importmap"` in index.html points to minimotor/index.js
```
