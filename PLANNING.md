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

## What's missing (never written — do not assume it exists)

The plan called for 5 chunks: (1) HTML structure/CSS, (2) body markup, (3) JS data
layer, (4) Three.js scene setup, (5) input handling + animation loop. Only 1–3 were
written before the session ended. **Chunks 4 and 5 do not exist anywhere in the
export.** Concretely, still to build:
- Actual Three.js scene: renderer/camera setup, the floating islands themselves
  (geometry/materials), lighting, starfield/nebula background, atmospheric effects.
- Camera controls (drag-to-orbit, scroll/pinch-to-zoom).
- Click/raycast handling to select an island and open its zone panel.
- Collectible orb objects + click-to-collect logic feeding into XP/achievements.
- The render/animation loop tying it all together.
- Closing the outer `(function(){ ... })();` IIFE in `js/game.js` (currently
  unclosed — the file will throw a syntax error until the remaining code is added
  and the IIFE is closed).

`index.html` includes `js/game.js` via `<script src="js/game.js"></script>` and will
not render correctly as-is — opening it in a browser will hit the JS syntax error
described above. Treat this as a paused work-in-progress, not a working demo.
