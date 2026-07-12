# Hoppspelet

Ett litet canvas-baserat hoppspel. Hoppa över hinder, samla mynt — var 1000:e
poäng byter banan tema (60+ teman).

## Spela lokalt

Dubbelklicka på `public/index.html`. Inget byggsteg, ingen server behövs.

> JS-filerna i `public/js/` är uppdelade i `.mjs`-moduler men laddas som
> vanliga skript (inte `type="module"`) eftersom webbläsare blockerar
> ES-modul-import från `file://`. Ordningen på `<script>`-taggarna i
> `index.html` är därför viktig.

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
public/
  index.html          Skal + startsida + skriptordning + SW-registrering
  styles.css          All CSS
  js/
    engine.mjs        Minimal game loop + kollisionshjälp
    state.mjs         Konstanter, spelarens/rundans tillstånd
    themes.mjs        Temadata (färger/partiklar per tema)
    world.mjs         Temaval, partiklar, resize, resetGame
    audio.mjs         WebAudio: musik + ljudeffekter
    gameplay.mjs      Hopp/död, hinder- och myntspawning
    input.mjs         Tangentbord, touch, debug-/mute-knappar
    update.mjs        Fysik, kollisioner, poäng (per frame)
    render-helpers.mjs Rityhjälpare (mark, moln, träd, ...)
    scenery.mjs       Bakgrundsscener per tema
    sprites.mjs       Spelare, mynt, hinder, UI-texter
    main.mjs          drawUI/draw + uppstart
  sw.js               Service worker (cache-first offline)
  manifest.webmanifest
```
