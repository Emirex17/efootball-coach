"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: "22+", label: "Formations" },
  { value: "6", label: "Playstyles" },
  { value: "AI", label: "Powered Coach" },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "Tell Us Your Playstyle",
    description: "Answer quick questions about how you prefer to play. Quick Counter, Possession, Long Ball — you pick it.",
    step: "01",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    accent: "text-emerald-400",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.79c0-.05-.01-.1-.01-.15A2.5 2.5 0 0 1 8 11.5c0-.05.01-.1.01-.15A2.5 2.5 0 0 1 9.5 7V2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.79c0-.05.01-.1.01-.15A2.5 2.5 0 0 0 16 11.5c0-.05-.01-.1-.01-.15A2.5 2.5 0 0 0 14.5 7V2Z" />
      </svg>
    ),
    title: "AI Generates Your Tactics",
    description: "Gemini AI analyzes your style and builds the perfect formation, instructions, and player roles for your squad.",
    step: "02",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
    accent: "text-blue-400",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
    title: "Dominate the Game",
    description: "Follow your personalized tactical setup, ask your coach real-time questions, and climb the rankings.",
    step: "03",
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/20",
    accent: "text-amber-400",
  },
];

const PLAYSTYLES = [
  { name: "Quick Counter", emoji: "⚡", desc: "Fast transitions" },
  { name: "Possession", emoji: "🎯", desc: "Ball control" },
  { name: "Long Ball", emoji: "🏹", desc: "Direct play" },
  { name: "Outwide", emoji: "🔄", desc: "Wing play" },
  { name: "Overload", emoji: "💥", desc: "Numerical advantage" },
  { name: "Long Ball Counter", emoji: "🛡️", desc: "Defend & strike" },
];

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-black gradient-text mb-1">{value}</div>
      <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold">{label}</div>
    </div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-blur" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md group-hover:shadow-emerald-500/40 transition-shadow">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4.5 h-4.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3 C14 7 17 9 21 9" />
                <path d="M21 15 C17 15 14 17 12 21" />
                <path d="M3 9 C7 9 10 7 12 3" />
                <path d="M12 21 C10 17 7 15 3 15" />
                <path d="M3 9 L3 15" />
                <path d="M21 9 L21 15" />
              </svg>
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-[var(--text-primary)]">
              eFootball <span className="gradient-text">Coach</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            <a href="#how-it-works" className="btn-ghost text-sm">How it works</a>
            <a href="#playstyles" className="btn-ghost text-sm">Playstyles</a>
            <Link href="/coach" className="btn-ghost text-sm">Tactical Board</Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/assessment" className="btn-primary text-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0 hide-xs">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <main className="hero-bg noise-texture" ref={heroRef}>
      <NavBar />

      {/* ── Hero Section ── */}
      <section className="relative pt-32 sm:pt-40 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative blobs */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 mb-6 fade-up">
            <span className="badge badge-green">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1 glow-pulse" />
              eFootball 2026 Ready
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 fade-up-delay-1">
            Your Personal
            <br />
            <span className="gradient-text">AI Football Coach</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed fade-up-delay-2">
            Get <strong className="text-[var(--text-primary)]">personalized tactics</strong> built around your playstyle.
            Build your squad, set formations, and get real-time AI advice to{" "}
            <strong className="text-emerald-400">dominate eFootball 2026</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-up-delay-3">
            <Link href="/assessment" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Build My Tactics
            </Link>
            <Link href="/coach" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <rect x="2" y="3" width="20" height="18" rx="2" />
                <line x1="12" y1="3" x2="12" y2="21" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Tactical Board
            </Link>
          </div>

          {/* Trust indicators */}
          <p className="mt-5 text-xs text-[var(--text-muted)] fade-up-delay-4">
            Free to use · No credit card required · Powered by Gemini AI
          </p>
        </div>

        {/* Stats row */}
        <div className="relative z-10 max-w-xl mx-auto mt-16 sm:mt-20 fade-up-delay-4">
          <div className="glass-card p-6 sm:p-8">
            <div className="grid grid-cols-3 divide-x divide-[var(--border-subtle)]">
              {STATS.map((s) => (
                <AnimatedCounter key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge badge-green mb-4">How it works</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Three steps to
              <span className="gradient-text"> tactical mastery</span>
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto">
              Tell us how you play. We'll generate tactics that fit your game in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {FEATURES.map((f) => (
              <div key={f.step} className="glass-card glass-card-hover p-6 sm:p-7 relative overflow-hidden group">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative z-10">
                  {/* Step number */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} border ${f.border} flex items-center justify-center ${f.accent}`}>
                      {f.icon}
                    </div>
                    <span className={`text-4xl font-black ${f.accent} opacity-20`}>{f.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Playstyles ── */}
      <section id="playstyles" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge badge-blue mb-4">Playstyles</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Pick your <span className="gradient-text">style</span>,
              <br />
              we'll build the tactics
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {PLAYSTYLES.map((ps) => (
              <Link
                key={ps.name}
                href={`/assessment`}
                className="glass-card glass-card-hover p-5 sm:p-6 group cursor-pointer"
              >
                <div className="text-3xl mb-3">{ps.emoji}</div>
                <div className="font-bold text-[var(--text-primary)] text-sm sm:text-base leading-tight">{ps.name}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{ps.desc}</div>
                <div className="mt-4 flex items-center gap-1 text-emerald-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Build tactics
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 sm:p-14 text-center relative overflow-hidden">
            {/* Inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 65%)" }}
            />
            <div className="relative z-10">
              <div className="text-4xl mb-5">🏆</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-4">
                Ready to find your
                <span className="gradient-text"> perfect tactics?</span>
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                Take the 2-step assessment and let your AI coach build a setup designed for your game.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/assessment" className="btn-primary text-base px-8 py-3.5">
                  Start Assessment — It's Free
                </Link>
                <Link href="/coach" className="btn-secondary text-base px-8 py-3.5">
                  Open Tactical Board
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border-subtle)] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" className="w-3.5 h-3.5">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <span className="font-semibold text-[var(--text-secondary)]">eFootball Coach</span>
            <span>· Not affiliated with KONAMI</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/assessment" className="hover:text-[var(--text-secondary)] transition-colors">Assessment</Link>
            <Link href="/coach" className="hover:text-[var(--text-secondary)] transition-colors">Tactical Board</Link>
            <a href="https://www.konami.com/efootball" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-secondary)] transition-colors">Official eFootball</a>
          </div>
        </div>
      </footer>
    </main>
  );
}