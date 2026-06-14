# Bhavana Portfolio

A personal portfolio site built with React + Vite featuring two viewing modes:

- **Story Mode**: Snapchat-style animated intro with auto-advancing frames
- **Portfolio Mode**: Traditional layout with experience timeline, projects, and skills

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bhavana-portfolio.git
   cd bhavana-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deploying to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Dashboard (Recommended)

1. Push your code to a GitHub repository

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your GitHub repository

5. Vercel auto-detects Vite settings. Default configuration works:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Click "Deploy"

Vercel automatically redeploys on every push to your main branch.

## Project Structure

```
bhavana-portfolio/
├── public/
│   ├── bitmoji/              # PNG bitmoji pose images for StoryMode
│   │   ├── thinking.png
│   │   ├── pro_laptop.png
│   │   ├── peace_wink.png
│   │   └── ...
│   ├── photo/                # Optional real photo for flip animation
│   │   └── bhavana.jpg       # Add your photo here to enable flip
│   ├── Bhavana_Resume.pdf    # Downloadable resume
│   ├── favicon.svg           # Site favicon
│   └── icons.svg             # SVG icon sprites
├── src/
│   ├── components/
│   │   ├── StoryMode.jsx     # Snapchat-style animated intro with FRAMES array
│   │   ├── Portfolio.jsx     # Traditional portfolio layout (hero, timeline, projects)
│   │   ├── Illustrations.jsx # SVG illustration components (USAMap, Globe, etc.)
│   │   └── usa-states.js     # US state path data for map illustration
│   ├── App.jsx               # Root component, manages mode toggle and tweaks
│   ├── main.jsx              # React entry point, renders App to DOM
│   └── styles.css            # Global styles, Solarized palette, typography
├── index.html                # HTML template, loads fonts and main.jsx
├── vite.config.js            # Vite configuration with React plugin
├── package.json              # Dependencies and npm scripts
└── eslint.config.js          # ESLint configuration
```

### Key Files

| File | Description |
|------|-------------|
| `src/App.jsx` | Controls which mode displays (story/portfolio) and passes configuration tweaks like pacing, bitmoji size, and typography |
| `src/components/StoryMode.jsx` | Animated intro experience. Edit the `FRAMES` array to modify content — each frame has pose, position, speech bubble, and optional illustration |
| `src/components/Portfolio.jsx` | Static portfolio with sections for hero, experience timeline, project cards, skills grid, and contact links |
| `src/components/Illustrations.jsx` | Reusable SVG components rendered alongside bitmoji in StoryMode (USAMap, Globe, UniCard, CompanyCard, SkillPile) |
| `src/styles.css` | CSS custom properties for Solarized colors, three font families, and typography mode classes (`serif-heavy`, `sans-heavy`) |

## Story Mode Timing

Each frame in StoryMode can have its own display duration.

### Per-Frame Duration

Add a `duration` property (in seconds) to any frame in the `FRAMES` array:

```js
// src/components/StoryMode.jsx
const FRAMES = [
  {
    pose: 'waving',
    pos: { x: '50%', y: '88%' },
    bubble: { text: "Hi, I'm Bhavana", side: 'top' },
    duration: 3,  // Shows for 3 seconds
  },
  {
    poseFile: 'thinking',
    pos: { x: '22%', y: '92%' },
    bubble: { text: "A longer explanation...", side: 'right' },
    duration: 6,  // Shows for 6 seconds
  },
  // ...
];
```

### Fallback

If a frame doesn't have a `duration` property, it uses the global `tweaks.pacing` value (default: 4 seconds), configured in `App.jsx`.

## Photo Flip Animation

The hero section supports an optional 3D flip animation that transitions from the bitmoji to a real photo.

### Enabling

Add your photo to enable the flip animation:

```
public/photo/bhavana.jpg
```

**Requirements:**
- File must be named `bhavana.jpg`
- Portrait orientation recommended (similar aspect ratio to the blob shape)
- The image is cropped with `object-fit: cover` and positioned at `top center` — works best for headshots

### Behavior

When the photo exists:
1. Portfolio loads showing the bitmoji
2. After 800ms delay, flips (Y-axis rotation) to reveal the real photo
3. Hover over the image to flip back to bitmoji

### Disabling

Simply remove or rename `public/photo/bhavana.jpg`. The component checks for the image on load — if not found, it displays the bitmoji statically with no animation.

## Tech Stack

- React 18
- Vite 5
- CSS custom properties (Solarized palette)
- Google Fonts (Fraunces, Inter, JetBrains Mono)

