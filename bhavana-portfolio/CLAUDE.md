# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite HMR)
npm run build    # Production build to dist/
npm run preview  # Preview production build
npx eslint .     # Run ESLint (configured but no npm script)
```

No test suite configured.

## Architecture

This is a personal portfolio site for Bhavana Sudhakar Athavane, built with React + Vite.

**Two-mode design:**
- **StoryMode** (`src/components/StoryMode.jsx`): Snapchat-style animated intro with auto-advancing frames. Edit content by modifying the `FRAMES` array — each frame defines `pose`/`poseFile`, `pos` (position), `bubble` (text + placement), and optional `art` (illustration component). Supports keyboard navigation (arrows, space, escape) and manual controls.
- **Portfolio** (`src/components/Portfolio.jsx`): Traditional portfolio layout with hero, experience timeline, projects, and skills. Self-contained component functions: `TLItem`, `ProjectCard`, `SkillGroup`, `ContactRow`.

`App.jsx` manages the mode toggle via `useState('story')` and passes a `tweaks` object for configurable display options. Adjust defaults in `TWEAK_DEFAULTS`: `pacing` (seconds per frame), `bitmojiSize`, `bubbleShape`, `typography` (`serif-heavy` or `sans-heavy`).

**Illustrations** (`src/components/Illustrations.jsx`): SVG illustration components (USAMap, Globe, UniCard, CompanyCard, SkillPile, etc.) rendered inline alongside bitmoji poses in StoryMode.

**Assets:**
- `/public/bitmoji/` — PNG bitmoji poses referenced by `poseFile` in FRAMES (e.g., `thinking`, `pro_laptop`, `peace_wink`)
- `/public/Bhavana_Resume.pdf` — Downloadable resume

## Styling

Uses Solarized color palette defined as CSS custom properties in `src/styles.css`. Three font families loaded from Google Fonts:
- `--serif`: Fraunces (display headings)
- `--sans`: Inter (body text)
- `--mono`: JetBrains Mono (code/labels)

Typography mode controlled by body class: `serif-heavy` or `sans-heavy`.
