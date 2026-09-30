"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type TeamPlaystyle =
  | "Quick Counter"
  | "Possession"
  | "Long Ball"
  | "Long Ball Counter"
  | "Overload"
  | "Outwide";

type AggressionLevel = "Very Aggressive" | "Balanced" | "Defensive";

type AssessmentAnswers = {
  teamPlaystyle: TeamPlaystyle | "";
  aggression: AggressionLevel | "";
};

const playstyleOptions: {
  title: TeamPlaystyle;
  description: string;
  emoji: string;
  color: string;
  border: string;
  selectedBg: string;
}[] = [
  {
    title: "Quick Counter",
    description: "Fast transitions, direct attacks and aggressive forward movement.",
    emoji: "⚡",
    color: "from-yellow-500/10 to-yellow-500/5",
    border: "border-yellow-500/30",
    selectedBg: "bg-yellow-500/10",
  },
  {
    title: "Possession",
    description: "Maintain control of the ball with short passes and methodical build-up play.",
    emoji: "🎯",
    color: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/30",
    selectedBg: "bg-blue-500/10",
  },
  {
    title: "Long Ball",
    description: "Direct aerial passes into the attacking third to bypass midfield pressure.",
    emoji: "🏹",
    color: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-500/30",
    selectedBg: "bg-orange-500/10",
  },
  {
    title: "Long Ball Counter",
    description: "Defend deep then launch quick counter attacks with long passes.",
    emoji: "🛡️",
    color: "from-purple-500/10 to-purple-500/5",
    border: "border-purple-500/30",
    selectedBg: "bg-purple-500/10",
  },
  {
    title: "Overload",
    description: "Bunch your players near the ball for short, quick passing and numerical superiority.",
    emoji: "💥",
    color: "from-rose-500/10 to-rose-500/5",
    border: "border-rose-500/30",
    selectedBg: "bg-rose-500/10",
  },
  {
    title: "Outwide",
    description: "Use the full width of the pitch with wingers and overlapping fullbacks.",
    emoji: "🔄",
    color: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/30",
    selectedBg: "bg-emerald-500/10",
  },
];

const aggressionOptions: {
  title: AggressionLevel;
  description: string;
  emoji: string;
  intensity: number;
  color: string;
  border: string;
}[] = [
  {
    title: "Very Aggressive",
    description: "Press high up the pitch and win the ball back immediately after losing it.",
    emoji: "🔥",
    intensity: 3,
    color: "from-rose-500/10 to-rose-500/5",
    border: "border-rose-500/30",
  },
  {
    title: "Balanced",
    description: "A solid mix of defensive structure and progressive build-up play.",
    emoji: "⚖️",
    intensity: 2,
    color: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/30",
  },
  {
    title: "Defensive",
    description: "Focus on protecting your goal with a compact, hard-to-break structure.",
    emoji: "🏰",
    intensity: 1,
    color: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/30",
  },
];

function IntensityDots({ level, max = 3 }: { level: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i < level ? "bg-emerald-400" : "bg-[var(--border-subtle)]"
          }`}
        />
      ))}
    </div>
  );
}

export default function Assessment() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    teamPlaystyle: "",
    aggression: "",
  });
  const [step, setStep] = useState(1);

  const handleGenerateTactics = () => {
    const params = new URLSearchParams({
      teamPlaystyle: answers.teamPlaystyle,
      aggression: answers.aggression,
    });
    router.push(`/coach?${params.toString()}`);
  };

  const progressPercent = step === 1 ? 50 : 100;

  return (
    <main className="hero-bg noise-texture min-h-dvh flex flex-col items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div
        className="fixed -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-2xl relative z-10">
        {/* Back link */}
        <div className="mb-6 fade-up">
          <Link href="/" className="btn-ghost text-sm inline-flex">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Progress header */}
        <div className="glass-card p-6 sm:p-8 fade-up-delay-1">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="badge badge-green">Step {step} of 2</span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                {step === 1 ? "Choose Playstyle" : "Choose Aggression"}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-400">{progressPercent}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question */}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] mb-2">
            {step === 1
              ? "What type of football do you prefer?"
              : "How aggressive should your approach be?"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {step === 1
              ? "Choose the style that best describes how you want to control the game."
              : "Pick the intensity and defensive structure that fits your game."}
          </p>

          {/* Options grid */}
          <div className={`grid gap-3 ${step === 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
            {step === 1
              ? playstyleOptions.map((opt) => {
                  const isSelected = answers.teamPlaystyle === opt.title;
                  return (
                    <button
                      key={opt.title}
                      id={`playstyle-${opt.title.replace(/\s+/g, "-").toLowerCase()}`}
                      type="button"
                      onClick={() => setAnswers({ ...answers, teamPlaystyle: opt.title })}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer group relative overflow-hidden ${
                        isSelected
                          ? `${opt.selectedBg} ${opt.border} ring-1 ring-emerald-500/50`
                          : "border-[var(--border-subtle)] hover:border-[rgba(255,255,255,0.15)] bg-[var(--bg-glass)]"
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? "opacity-100" : ""}`} />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl">{opt.emoji}</span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">{opt.title}</h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{opt.description}</p>
                      </div>
                    </button>
                  );
                })
              : aggressionOptions.map((opt) => {
                  const isSelected = answers.aggression === opt.title;
                  return (
                    <button
                      key={opt.title}
                      id={`aggression-${opt.title.replace(/\s+/g, "-").toLowerCase()}`}
                      type="button"
                      onClick={() => setAnswers({ ...answers, aggression: opt.title })}
                      className={`p-5 rounded-xl border text-left transition-all cursor-pointer group relative overflow-hidden ${
                        isSelected
                          ? `${opt.border} ring-1 ring-emerald-500/50 bg-[var(--bg-glass)]`
                          : "border-[var(--border-subtle)] hover:border-[rgba(255,255,255,0.15)] bg-[var(--bg-glass)]"
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                      <div className="relative z-10 flex items-center gap-4">
                        <span className="text-3xl shrink-0">{opt.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-[var(--text-primary)]">{opt.title}</h3>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{opt.description}</p>
                          <div className="mt-2">
                            <IntensityDots level={opt.intensity} />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
          </div>

          {/* Currently selected indicator */}
          {(step === 1 ? answers.teamPlaystyle : answers.aggression) && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[var(--text-muted)]">Selected:</span>
              <span className="font-semibold text-emerald-400">
                {step === 1 ? answers.teamPlaystyle : answers.aggression}
              </span>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary flex-shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            )}

            {step === 1 ? (
              <button
                id="next-step-btn"
                type="button"
                disabled={!answers.teamPlaystyle}
                onClick={() => setStep(2)}
                className="btn-primary flex-1"
              >
                Next Step
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <button
                id="generate-tactics-btn"
                type="button"
                disabled={!answers.aggression}
                onClick={handleGenerateTactics}
                className="btn-primary flex-1"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Generate My Tactics
              </button>
            )}
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`rounded-full transition-all duration-300 ${
                s === step
                  ? "w-6 h-2 bg-emerald-500"
                  : s < step
                  ? "w-2 h-2 bg-emerald-500/60"
                  : "w-2 h-2 bg-[var(--border-subtle)]"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}