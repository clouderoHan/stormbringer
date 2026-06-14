# Stormbringer

A standalone 2D browser bullet hell built with HTML canvas.

## Play

Play in browser: [Stormbringer on GitHub Pages](https://clouderoHan.github.io/stormbringer/)

Local fallback: open `index.html` in a browser.

## Project Layout

- `index.html` - page structure and script loading
- `styles.css` - screen layout and UI styling
- `src/data.js` - static powerup, kill-label, and encyclopedia data
- `src/records.js` - saved score keys and localStorage helpers
- `game.js` - main loop, gameplay, rendering, input, and audio

## Controls

- Move: mouse
- Hold fire: left mouse button
- Magnet collectibles: right mouse button
- Pause menu and encyclopedia: `Esc` or `P`
- Restart: `R`
- Debug boss phase: `B`
- Debug Motherland pack: `M`
- Debug Seal of Judgement: `C`
- Seal of Judgement: hold left mouse after pressing `C`; releasing before the loop closes breaks judgement
- Debug overlay: backtick
- Debug drops: `1` shotgun, `2` trident, `3` missiles, `4` machine gun
- Debug refill: `E` energy, `H` hull
- Debug streak: `S` instant S rank

## Features

- Regular enemy waves with the first boss encounter enabled
- Auto-fire player ship with a single straight default shot
- Destroyable enemy ships with targeted shots, hit flashes, score popups, and explosions
- Player weapons show muzzle flashes, while enemy weapons use larger warning flashes and direction cues before shots become dangerous
- Distinct death animations for standard ships, UFOs, Motherlands, and boss parts
- Enemy ships damage and knock the player back on body collision
- Disk-like UFO enemies with default blue shields and faster red-orange elongated laser projectiles
- Fighter jets appear from wave 3, perch, lock onto the player for three seconds, then fire twin machine-gun lanes at the final lock position
- Cargo ships with yellow armor pips that lose exactly one armor per hit and guarantee one energy plus one powerup
- Tougher Motherland support enemy with an alert cue on arrival, Frenzy aura pressure, concentrated volleys, and slow drop stealing
- First boss appears at wave 10 and every 5 waves after, forces regular enemies to retreat, and has four destructible cannons plus a torso
- Boss torso starts with 20 yellow armor and refreshes that armor whenever a cannon is destroyed
- Boss cannons guarantee one powerup and three energy drops when destroyed
- Main weapon powerups: `S` shotgun spread and `T` forward trident fire
- Sub weapon powerups: `M` lighter homing missiles and `G` short-range fast wing-mounted machine guns that briefly suppress enemy fire, strip armor well, but deal reduced damage to blue shields
- Powerups are marked with `S`, `T`, `M`, or `G`
- Main powerups use angular diamond visuals; sub powerups use round/orbital visuals
- Main and sub powerups can run together; collecting another powerup in the same slot swaps that slot
- Web Audio sound effects for shots, projectile-specific hits, magnet activation, explosions, pickups, damage, and ultimates
- Enemy hit audio changes by defense layer: blue shield pings, yellow armor thunks, and red health hits pitch upward as enemies weaken
- Generated Web Audio background music with normal and urgent boss-phase loops
- Collectibles scatter, fade, and expire unless collected or attracted with right mouse, with tighter manual pickup radius to make magnet timing valuable
- Magnet mode changes color and sound as it ramps normal enemy bullets into faster tracking threats, with red/orange warning lines for affected bullets while UFO lasers ignore suction and speed up
- Five blue energy units trigger a context-sensitive release: dense triple radial blast, sixfold trident blast, stronger shotgun mini-nuke, missile storm, or machine gun lockdown barrage
- Ultimates now use a short charge cue, weapon-specific callout, energy flash, and lingering visual/audio effect before and during release
- Bright blue energy shards charge ultimates; triggering an ultimate restores one hull
- Score increases only when enemies are destroyed
- Streak aura builds from enemy hits and kills into D/C/B/A/S layers around the player, then decays after one second without hits
- S-rank streak enables weapon overdrives: default critical shots, tighter shotgun burst, wider trident center shot, missile splash, and machine-gun root
- Game-over summary compares against last run and persistent best score, with kill counts by enemy type
- Active main and sub weapon powerups show separate shrinking timer bars in the HUD
- In-game pause encyclopedia for enemy types, weapon types, and core mechanics
- Five-hit player health shown as HUD and in-canvas pips
- Wave escalation, screen shake, particles, and game-over restart flow
