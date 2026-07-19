# Hoppspelet

Ett litet canvas-baserat hoppspel. Hoppa över hinder, samla mynt — var 1000:e
poäng byter banan tema (60+ teman).

## Spela lokalt

Spelet använder ES-moduler med en importmap, så du måste servera
filerna — `file://` fungerar inte. Enklast:

```bash
pnpm dlx serve public
```

Öppna `http://localhost:3000` i webbläsaren.

## Utveckla

Repot är ett pnpm-workspace. Spelet ligger i roten och spelmotorn
(Minimotor) är en git-submodul i `packages/minimotor/` som länkas in som
workspace-paket.

```bash
pnpm install        # hämtar typescript, oxlint, oxfmt + länkar minimotor
pnpm run build      # kompilerar motorn -> public/minimotor/, spelet -> public/js/
pnpm run dev:all    # watch-läge för både motor och spel
pnpm run dev        # watch-läge för bara spelet (tsc --watch)
pnpm run verify     # tsc --noEmit + oxlint + oxfmt --check parallellt
pnpm run format     # oxfmt .
```

De kompilerade filerna (`public/minimotor/*.js`, `public/js/*.js`) checkas in,
så att Docker-bygget (som bara kopierar `public/`) fungerar utan node/pnpm.
Kör alltså `pnpm run build` innan deploy.

## Hosta med Docker (Portainer)

```bash
docker compose up -d --build
```

I Portainer: skapa en stack från repot med `docker-compose.yml` +
`docker-compose.portainer.yml` (lägger containern i det externa
`nginx`-nätverket för reverse proxy, samma upplägg som niklas.tegnander.nu).

Containern svarar både på `/` och under `/hoppspelet/`, så en custom
location `/hoppspelet` i Nginx Proxy Manager fungerar rakt av — hela
sökvägen får skickas vidare oförändrad till containern.

## PWA

Spelet är installerbart som PWA (manifest + service worker) och fungerar
offline efter första besöket. Service workern registreras bara över
https/localhost. Cacheversionen stämplas automatiskt med byggtidpunkten
när Docker-imagen byggs (`__BUILD_STAMP__` i `public/sw.js` byts ut i
Dockerfilen), så en ny deploy invaliderar gamla klienters cache utan
manuell versionsbump. Hostas filerna på annat sätt än via Docker-imagen:
byt ut stämpeln manuellt vid deploy.

Ikonerna i `public/icons/` är genererade från `public/favicon.svg`
(macOS: `qlmanage -t -s 512 -o public/icons public/favicon.svg`).
Skärmbilderna på startsidan (`public/assets/screens/`) är riktiga
spelbilder. Regenerera dem med `tools/capture-screens.js` — klistra in
filen i webbläsarkonsolen på spelsidan, så iscensätts scenerna och tre
jpg-filer laddas ner (instruktioner i filens huvud).

## Filstruktur

```
src/                  TypeScript-källan till spelet (kompileras till public/js/)
  types.d.ts          Delade globala typer (Theme, Obstacle, Coin, ...)
  state.ts            Konstanter, spelarens/rundans tillstånd
  themes.ts           Temadata (färger/partiklar per tema)
  world.ts            Temaval, partiklar, resize, resetGame
  audio.ts            WebAudio: musik + ljudeffekter
  gameplay.ts         Hopp/död, hinder- och myntspawning
  input.ts            Tangentbord, touch, debug-/mute-knappar
  update.ts           Fysik, kollisioner, poäng (per frame)
  render-helpers.ts   Rityhjälpare (mark, moln, träd, ...)
  scenery.ts          Bakgrundsscener per tema
  sprites.ts          Spelare, mynt, hinder, UI-texter
  main.ts             drawUI/draw + uppstart
packages/
  minimotor/          Git-submodul: Minimotor, spelmotorn (återanvänds i andra projekt)
    src/engine.ts     TypeScript-källkod (minimal game loop + kollisionshjälp)
public/
  index.html          Skal + startsida + skriptordning + SW-registrering
  styles.css          All CSS
  minimotor/          Kompilerad Minimotor (byggs från packages/minimotor)
  js/                 Kompilerat spel (byggs från src/)
  sw.js               Service worker (cache-first offline)
  manifest.webmanifest
  importmap            `type="importmap"` i index.html pekar på minimotor/index.js
```
