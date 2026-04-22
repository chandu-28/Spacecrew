# Space Crew — Build Status

_Last updated: 2026-04-10_

## Files
| File | Status | Notes |
|------|--------|-------|
| `mission_select.html` | ✅ Restyled | Phase 1 — new dark design system, correct O2 href |
| `o2_regulator.html` | ✅ Restyled | Phase 2 — new design system, win sounds, STABLE_NEEDED=3 |
| `fuel_reactor.html` | ✅ Restyled | Phase 3 — new design system, slider classes |
| `nav_computer.html` | ✅ Restyled | Phase 4 — new design system, amber tokens, CSS vars in JS |
| `manifest.json` | ✅ OK | References icon-192.png / icon-512.png (not yet in folder) |
| `sw.js` | ✅ Fixed | Network-first for HTML, cache-first for assets |

## Bugs

### 🔴 Critical
| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `mission_select.html` | 225 | O2 Regulator card `href="index.html"` — should be `o2_regulator.html` |

### 🟡 Functional
| # | File | Issue |
|---|------|-------|
| 2 | `o2_regulator.html` | `STABLE_NEEDED=1` — spec says 3-frame stability counter |
| 3 | `o2_regulator.html` | `playHiss()`, `playChunk()`, `playChime()` are empty stubs — no win sound |
| 4 | `o2_regulator.html` | `dbg()` references `#audio-status` element that doesn't exist in HTML |
| 5 | `o2_regulator.html` | `testAudio()` calls undefined `getCtx()` — orphaned debug function |

### ⚪ Cosmetic
| # | File | Issue |
|---|------|-------|
| 6 | `fuel_reactor.html` | Duplicate `<meta>` tags in `<head>` (apple-mobile-web-app-* appear twice) |
| 7 | `nav_computer.html` | Duplicate `<meta>` tags in `<head>` (same) |
| 8 | `manifest.json` | `icon-192.png` / `icon-512.png` not yet in folder — PWA install will warn |

## Feature Checklist
### Hub (mission_select.html)
- [x] Mission cards with progress dots
- [x] Per-system readiness bars
- [x] Deep Space Power bar (20 levels)
- [x] Final Mission unlock + star-warp cinematic
- [x] localStorage persistence
- [x] 55hz engine hum on first tap
- [x] Hash-based progress reporting from game pages

### O2 Regulator (Levels 1–10)
- [x] Two bidirectional sliders (O2 + N2)
- [x] ±0.5 tolerance window
- [x] Two-stage target line (ratio glow → volume green)
- [ ] 3-frame stability counter (currently 1)
- [x] Vent All drain + individual vents
- [x] Over-pressure cylinder shake
- [x] Under-pressure screen flicker
- [x] Ship power bar
- [x] Level scaling (1:1/10u → 7:13/40u)
- [x] Ambient audio (hum + rumble)
- [x] Win sounds (playHiss → noise burst, playChunk → thud, playChime → ascending tones)

### Fuel Reactor (Levels 11–15)
- [x] Three sliders (H2, Plasma, Coolant)
- [x] 5-second hold in green zone
- [x] Thermal runaway (Plasma/Coolant > 2:1)
- [x] Circular SVG reactor core + supply pipes
- [x] Volume ring separate from ratio needle
- [x] localStorage save

### Nav Computer (Levels 16–20)
- [x] Draggable crosshair snapping to integers
- [x] Gold target + pulsing red obstacles
- [x] Axis numbers visible L16–17, hidden L18–20
- [x] Directional ticker ("3 right, 2 up")
- [x] Pythagorean distance readout
- [x] Canvas star-streak warp on win
- [x] localStorage save
- [x] Jump button activates only on target

## Missing Assets
- [ ] `icon-192.png`
- [ ] `icon-512.png`

## Design System — Applied to all 4 files
- Always-dark, no `@media (prefers-color-scheme)` blocks
- Tokens: `--cyan` (O2), `--magenta` (Fuel), `--amber` (Nav), `--purple` (Hub/final), `--green` (success)
- Consistent `--bg1/2/3`, `--t1/2/3`, `--bd1/2`, `--r8/12` across all files

## Missing Assets
- [ ] `icon-192.png`
- [ ] `icon-512.png`

## TODOs / Next Steps
_All 4 game screens complete. Remaining: PWA icons._
