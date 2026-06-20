# The Polymath Protocol — Quang Le's Interactive 3D Portfolio

Extracted from a previous Claude (Fable) web session. Two turns of work happened:
1. An initial single-file attempt that got interrupted mid-generation (its sandbox
   was gone by the next turn, so it was rebuilt from scratch).
2. A rebuild ("Continue working") that went further on the JS/content side but was
   itself cut off before the Three.js scene code was written.

This folder contains the **rebuild** (more progress overall), reassembled from the
raw tool calls in the export. See "What's done" / "What's missing" below.

## Original brief (verbatim intent)

> Create an interactive gamified 3d website that showcases my portfolio. Go crazy
> on the design, make the website look as good as humanly possible. Organize the
> information first. The design does not have to match whatever is being said, try
> and keep a cohesive theme throughout the website.

Portfolio source material supplied: research roles (NTU machine learning/robotics,
Chiang Mai University materials chemistry, CNC engineering in Vietnam), competition
mathematics (ACS(I) Math Competition Team EXCO, TrinMac NYC 1st place + multiple
golds/silvers), music (ACS(I) Choir Club President, SYF Distinction), founding roles
(Sigma Academy non-profit math education, SEIA entrepreneurship association),
volunteering (Aqualium Project beach cleanups), education history (Hanoi-Amsterdam →
ACS(I) O-Levels → Victoria Junior College A-Levels), honors (MOE ASEAN Scholarship,
1st in Year 3 cohort, Harvard Venture-TECH program, DataCamp deep learning cert).

## Design direction settled on

- Title: **"The Polymath Protocol"** — single-file dark/cosmic RPG-styled site.
- Player-profile framing: visitor "plays" Quang Le, leveling up (Novice → Polymath
  titles) as they explore.
- World shape: a **floating-island archipelago** (not the alternate "planets in
  space" idea that was considered and dropped — see Design options below), viewed
  via a draggable/zoomable orbit camera over a starfield/nebula backdrop.
- 7 zones, each a distinct "island": **Nexus** (player profile/about), **Lab**
  (research), **Arena** (competition math), **Stage** (music/performance), **Guild**
  (founding/volunteering), **Academy** (education timeline), **Vault** (honors).
- Game-feel systems: XP bar + leveling, achievement unlocks, quest log, collectible
  glowing orbs (XP pickups scattered on/near islands), a radar/"sector map" mini-map,
  toast notifications, confetti on milestones, ambient audio toggle, a title/loading
  screen ("PRESS START"), and a "World 100% Cleared" end-state with contact links.
- Content is written in RPG flavor text (quest cards tagged MAIN QUEST / SIDE QUEST /
  ACTIVE / CLEARED / LEGENDARY / EPIC / RARE) while keeping every underlying fact
  accurate — flavor wraps the resume, it doesn't replace it.
- Typography: Orbitron (display), Rajdhani (body), Share Tech Mono (UI/labels).
- Color system: deep navy/near-black background, per-zone accent colors (cyan=Lab,
  rose=Arena, violet=Stage, emerald=Guild, blue=Academy, gold=Vault, ice=Nexus).

### Design options considered (from planning notes) and the call made
- Considered both a **"cosmic odyssey"** (ship traveling between glowing planets/star
  systems) and a **floating-islands archipelago**. The archipelago direction is what
  actually got built (HUD copy says "ORBIT THE ARCHIPELAGO", islands have labels and
  quest markers) — the cosmic/space dressing (starfield, nebula, particles) was kept
  as the *backdrop* rather than the literal world shape.

## What's actually done (verified against the raw export)

- **`index.html`** — complete `<head>` (fonts, full CSS design system: colors,
  responsive HUD, title screen, panel/modal styles, animations) and complete `<body>`
  markup (HUD with avatar/XP/level plate, top-right buttons for quests/achievements/
  sound/help, zone dock, hint bar, radar canvas, slide-in zone panel, modal shell,
  confetti layer, title/loading screen, no-WebGL fallback message).
- **`js/game.js`** — content + logic layer, fully written for:
  - All 7 zones' real content (`ZONES.*.body`), pulled directly from the supplied
    portfolio info (research roles, math competition results table, choir
    leadership, Sigma Academy/SEIA/volunteering, full education timeline, honors,
    Nexus profile card with stat bars and contact links).
  - Achievement definitions and an achievement system.
  - App state shape, XP/leveling math, audio-toggle plumbing, confetti effect.
  - Modal renderers: quest log, achievements list, help/controls, "full clear"
    end screen with `mailto:` and LinkedIn links.

## What was completed (chunks 4–5 — now written)

The plan called for 5 chunks: (1) HTML structure/CSS, (2) body markup, (3) JS data
layer, (4) Three.js scene setup, (5) input handling + animation loop. Chunks 1–3 came
from the original export; **chunks 4 and 5 have now been written**, appended to the
bottom of `js/game.js` (before the IIFE close) and hooked into the existing data/
state/XP/modal layer. Concretely added:
- Three.js scene (r128, loaded via CDN in `index.html`): alpha renderer mounted in
  `#world`, perspective camera, ambient + directional + point lighting, a 2.6k-point
  starfield, additive nebula glow sprites, and a floating archipelago — one island
  per zone (Nexus central, the six `ORDER` zones on a ring), each with a platform,
  glowing rim, downward rock spike, a spinning zone-colored crystal beacon, accent
  light, and an HTML `.isl-label`.
- Custom spherical orbit camera (no OrbitControls dependency): pointer drag-to-orbit
  with eased targets and idle auto-rotate, wheel + two-finger pinch zoom, all clamped.
- Raycast interaction: click an island → `openZone(id)`; click a glowing orb →
  collect (8 total) feeding XP and the `orbs` / `full` achievements; desktop hover
  highlights the hovered island's label.
- `openZone(id)` zone-panel renderer (single source of truth for island/dock/label
  clicks), the dynamically built zone dock, the sector-map radar, the render/animation
  loop with HTML-label projection, the title→PRESS START boot sequence, HUD button
  wiring (quests/achievements/help/sound), ESC/close handling, the playtime ticker,
  the one-shot hint, and the Konami-code easter egg.
- The outer `(function(){ … })();` IIFE is now **closed**.

`index.html` includes `js/game.js` via `<script src="js/game.js"></script>`. The file
now passes `node --check`, and a stubbed harness exercises init → start → openZone →
HUD buttons without runtime errors. Open `index.html` in a modern (WebGL) browser to
play; without WebGL it shows the `#no3d` fallback.
