# eFootball Coach — AI Tactical Advisor

> Your personal AI-powered eFootball 2026 coaching platform. Get personalized tactics, formations, and real-time AI advice built around your playstyle.

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google)](https://ai.google.dev/)

---

## Features

| Feature | Description |
|---|---|
| **Playstyle Assessment** | 2-step quiz to choose your playstyle and aggression level |
| **AI Tactical Coach** | Gemini AI gives formation advice, player instructions, and in-game tips |
| **Quick Coach Prompts** | One-tap suggested questions to get started fast |
| **Interactive Tactical Board** | Assign and visualize your squad on a live pitch |
| **Player Database** | Search 10,000+ eFootball 2026 players by name |
| **Saved Squad** | Squad persists in the browser between visits |
| **Share Setup** | Copy a link with your playstyle and aggression |
| **Fully Responsive** | Optimized for mobile, tablet, and desktop |

---

## Getting Started (local)

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/efootball-coach.git
cd efootball-coach
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required
GEMINI_API_KEY=your-gemini-api-key

# Optional — set to your live URL after deploy (used for sitemap / Open Graph)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Never commit `.env.local`** — it is gitignored. Only `.env.example` is safe to commit.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Push to GitHub (first time)

Your project is already a git repo on `main`. You need a GitHub remote, then push.

### Option A — GitHub website + terminal (simplest)

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `efootball-coach`
3. Keep it **Public** (or Private if you prefer)
4. Do **not** add a README, `.gitignore`, or license (you already have them)
5. Click **Create repository**
6. In your project folder, run (replace `YOUR_USERNAME`):

```bash
# Stage everything (secrets stay out via .gitignore)
git add .

# Commit
git commit -m "Prepare eFootball Coach for production deploy"

# Connect GitHub
git remote add origin https://github.com/YOUR_USERNAME/efootball-coach.git

# Push
git branch -M main
git push -u origin main
```

If GitHub asks you to sign in, use a [Personal Access Token](https://github.com/settings/tokens) as the password (or use GitHub CLI / SSH).

### Option B — GitHub CLI

```bash
# Install once (WSL/Ubuntu)
sudo apt update && sudo apt install gh -y
gh auth login

# Create the repo and push in one go
git add .
git commit -m "Prepare eFootball Coach for production deploy"
gh repo create efootball-coach --public --source=. --remote=origin --push
```

### What must not be pushed

| Path | Why |
|---|---|
| `.env.local` | Contains your Gemini API key |
| `node_modules/` | Reinstalled with `npm install` |
| `.next/` | Build output |
| `efootball-ai-coach/` | Unused nested prototype (ignored) |

The large player DB (`data/PlayersDB_*.jsonl`, ~35MB) **is included** on purpose so search works after deploy. GitHub allows it (under the 100MB limit).

---

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with **GitHub**
2. Import **`efootball-coach`**
3. Framework preset should be **Next.js** (auto-detected)
4. Add environment variables before deploying:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | Your key from [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `NEXT_PUBLIC_SITE_URL` | Leave blank for the first deploy, then set to your Vercel URL (e.g. `https://efootball-coach.vercel.app`) and redeploy |

5. Click **Deploy**
6. After it succeeds, open the live URL and test:
   - Home → Assessment → Coach
   - Player search
   - Ask the AI coach a question
7. (Recommended) In Vercel → Settings → Environment Variables, set `NEXT_PUBLIC_SITE_URL` to your live URL, then **Redeploy**

### Later updates

```bash
git add .
git commit -m "Your change message"
git push
```

Vercel will auto-redeploy from `main`.

---

## Project Structure

```
efootball-coach/
├── app/
│   ├── api/
│   │   ├── coach/route.ts      # AI coach API (Gemini + rate limit)
│   │   └── players/route.ts    # Player search API (cached index)
│   ├── assessment/page.tsx     # 2-step playstyle quiz
│   ├── coach/
│   │   ├── page.tsx            # Main coaching interface
│   │   └── TacticalBoard.tsx   # Interactive pitch board
│   ├── error.tsx / not-found.tsx
│   ├── robots.ts / sitemap.ts
│   ├── globals.css
│   └── layout.tsx
├── data/
│   ├── efootball-knowledge.ts
│   ├── formation.ts
│   ├── nationalities.ts
│   └── PlayersDB_20260919.jsonl
├── lib/rateLimit.ts
├── .env.example
└── next.config.ts
```

---

## App Flow

```
Home → Assessment (Playstyle + Aggression) → Coach Page
                                                ├── Tactical Board
                                                ├── Squad Builder (saved locally)
                                                └── AI Coach Chat (Gemini)
```

No sign-in required.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | App Router |
| [TypeScript 5](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Google Gemini AI](https://ai.google.dev/) | Coaching responses |

---

## Production checklist

- [ ] `GEMINI_API_KEY` set in Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` set to the live domain
- [ ] `npm run build` succeeds locally
- [ ] Player DB is in the repo / deploy
- [ ] `/api/coach` and `/api/players` work on the live site

---

## Notes

- **Player Database**: loaded once into memory for fast search.
- **AI Model**: `gemini-3.6-flash`.
- **API protection**: in-memory rate limits on coach and players APIs.
- **Not affiliated with KONAMI** — fan-made project.

---

## License

MIT — feel free to fork and customize.
