# Nocturne — The Astral Cloister

A playable, third-person magical-academy showcase for desktop browsers. Built with Three.js and Vite, with a custom articulated character inspired by the supplied dark-academia reference.

## Run

Requires Node.js 22.12+ (validated with Node 24.19) and npm.

```sh
npm ci
npm run dev -- --port 5173
```

For a production build:

```sh
npm run build
npm run preview -- --port 4173
```

Textures and fonts are bundled locally. No API keys, backend, account, or runtime external requests are required.

## Play

| Control | Action |
| --- | --- |
| WASD / arrow keys | Move relative to the camera |
| Shift | Run |
| Space | Jump |
| Mouse drag | Orbit the camera |
| Mouse wheel | Zoom |
| E | Awaken the orrery when nearby |
| Q | Cast a guiding light; arcana recharges over time |
| P | Toggle photo mode |
| Escape | Open/close settings or leave photo mode |

Settings include Cinematic, Balanced, and Performance quality, camera sensitivity, ambient audio, and a return-to-start control. Audio begins only after the player enables it.

## Browser validation

With the dev server running:

```sh
npm test
```

The Playwright smoke test uses `/usr/bin/chromium` by default. Set `CHROME_PATH` for another Chromium installation and `TEST_URL` for a different server address. It exercises startup, movement, running, jumping, orbit, zoom, collision, the orrery, spell casting, photo mode, audio, settings, and resizing. Screenshots are written to the ignored `test-results/` directory.

Headless checks use software WebGL and the in-app Performance setting for interaction checks. They do not measure desktop GPU frame rates. Visual inspections also use Cinematic quality.

## Implementation

- Weathered stone courtyard with pointed arches, clustered columns, tracery, banners, carved doors, study furniture, and ivy.
- Articulated original character with navy tailoring, ringlets, a floral eyepatch, and a velvet fascinator. Idle, walk, run, and cloth motion are procedural.
- Moonlight shadows, warm candle pools, PBR textures, environmental reflections, fog, subtle light shafts, bloom, and airborne dust.
- Animated celestial orrery, glowing rune mosaic, spell projectiles, recharging arcana, and synthesized ambient sound.
- Static mesh batching and instanced candles reduce draw overhead; quality settings adjust resolution, shadows, and bloom.

This is a compact showcase, with a procedural stylized character and local interactions. It has no combat system, quests beyond the orrery encounter, or saved progression.

## Assets

See [asset credits](public/licenses/credits.md) and the accompanying license/source notices. The reference photograph is not included in the shipped application.
