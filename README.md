# FOSS Club SIT - Precision Radial Timer ⏱️

An ultra-sleek, cyberpunk-inspired radial event timer designed specifically for hackathons, lightning talks, project demos, and keynote sessions at **FOSS Club SIT**.

Built with Next.js 15, Tailwind CSS, WebGL shaders, Canvas ASCII effects, and Web Audio API synthesized cybernetic sound effects.

---

## ✨ Features

- **Phase 1: Cinematic Intro**
  - Retro Matrix emerald background with dynamic `GradientASCII` shader.
  - Multi-line balanced `ASCIIText` canvas animation cycling through 8 custom FOSS Club SIT prompts at 2.0s intervals.
  - Clean floating display with zero extraneous UI cards.

- **Phase 2: Precision Radial Timer (FocusLock Dial)**
  - Dual translucent glass plates (`86%` and `68%`) with nested backdrop blur.
  - 60 luxury hairline tick marks with 5-minute major accents.
  - 3.5px neon progress arc with rotating lead jewel dot.
  - Bold, tabular clean digits centered with responsive scaling (`clamp(3.2rem, 8vw, 4.4rem)`).
  - Ambient glowing halo and one-by-one startup reveal sequence.
  - **Urgent Red Mode**: In the final 2 minutes (`<= 120s`), the entire dial (digits, progress arc, ticks, jewel, glass rim) and the Dither background wave transition into crimson red (`#ef4444` / `#ff3b30`).
  - Interactive click to pause / resume with cybernetic feedback.

- **Phase 3: Time's Up & Overtime Tracking**
  - Ambient `AeroShards` floating emerald glass background.
  - Free-floating `"TIME'S UP"` title with smooth fade-in.
  - **Live Overtime Corner Clock**: A live-counting clock at the top-left corner (`+00:01`, `+00:02`...) with pulsing red beacon to help moderators track elapsed overtime during presentations.
  - One-click `"RESTART"` button to cycle cleanly back to the introductory sequence.

- **Audio Synthesizer**
  - 100% Web Audio API procedural synthesis (no external audio assets required).
  - Subtle ticks on minute boundaries and urgent countdown warning ticks in final 10 seconds.
  - Tonal alarm on time up and warp sound on restart.
  - Sound toggle in settings.

- **Configuration Modal**
  - Custom minutes and seconds duration input.
  - Quick presets: 1m, 5m, 10m (Default), 15m, 20m, 30m, 45m, 60m.
  - Direct phase switcher for rapid testing (Intro, Timer, Times Up).

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Abhishek-Hardaha/Timer.git
cd Timer

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript & React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Visual FX**: WebGL2 Dither shader, Canvas ASCII Text, AeroShards, 3D CSS
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🌐 Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push this repository to GitHub.
2. Import the repository into your Vercel dashboard.
3. Vercel will automatically detect Next.js and deploy with optimal defaults.

---

## 📄 License

MIT © [FOSS Club SIT](https://github.com/Abhishek-Hardaha/Timer)
