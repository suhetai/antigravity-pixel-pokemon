---
name: pixel-pokemon-control
description: Manage the bottom-left Pixel Pokémon GIF companion widget in Antigravity, roll a new random Pokémon GIF from Tenor, or open the Pixel Pokémon Gallery side pane.
---

# Pixel Pokémon Companion (`pixel-pokemon-control`)

Use this skill when the user asks to change, refresh, lock/unlock, or inspect the Pixel Pokémon GIF companion in the bottom-left corner of Antigravity.

## Capabilities

1. **Open the Side Pane Gallery**:
   Emit a pill link: `[像素宝可梦图鉴](sidecar://pixel-pokemon-widget/pokemon/)`

2. **Switch / Refresh via CDP**:
   You can trigger `window.__AGY_POKEMON_NEXT__ && window.__AGY_POKEMON_NEXT__()` in the active renderer window via `DevToolsActivePort` to immediately roll a new random Pixel Pokémon GIF.
