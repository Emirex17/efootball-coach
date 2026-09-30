"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import TacticalBoard, { type Player } from "./TacticalBoard";
import { POSITION_NAMES } from "@/data/formation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SQUAD_STORAGE_KEY = "efootball-coach-squad";

const SUGGESTED_QUESTIONS = [
  "Recommend the best formation and instructions for my playstyle",
  "How should I set up Fluid Formation for attack and defense?",
  "Which defensive instructions fit my squad and aggression?",
  "How do I counter Possession Game opponents?",
  "Give me in-game attacking and defending tips for my setup",
];

function loadSavedSquad(): Player[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SQUAD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function CoachContent() {
  const params = useSearchParams();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [squadReady, setSquadReady] = useState(false);
  const [playerSearch, setPlayerSearch] = useState("");
  const teamPlaystyle = params.get("teamPlaystyle");
  const aggression = params.get("aggression");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"squad" | "chat">("squad");
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    setPlayers(loadSavedSquad());
    setSquadReady(true);
  }, []);

  useEffect(() => {
    if (!squadReady) return;
    try {
      localStorage.setItem(SQUAD_STORAGE_KEY, JSON.stringify(players));
    } catch {
      // ignore quota / private mode
    }
  }, [players, squadReady]);

  const fetchPlayers = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/players?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        setSearchResults([]);
        return;
      }
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchPlayers(playerSearch), 300);
    return () => clearTimeout(timer);
  }, [playerSearch, fetchPlayers]);

  async function handleSubmit(overrideQuestion?: string) {
    const currentQuestion = (overrideQuestion ?? question).trim();
    if (!currentQuestion || isSubmitting) return;
    setIsSubmitting(true);
    setQuestion("");

    setMessages((prev) => [...prev, { role: "user", content: currentQuestion }]);
    setSidebarTab("chat");

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          teamPlaystyle,
          aggression,
          players,
        }),
      });

      let coachReply = "No response received from coach.";
      try {
        const text = await response.text();
        if (text && text.trim().length > 0) {
          const data = JSON.parse(text);
          coachReply = data.answer || coachReply;
        } else {
          coachReply = "Server returned an empty response. Please try again.";
        }
      } catch {
        coachReply = "The coach service is momentarily busy. Please try asking again.";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: coachReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble analyzing that tactical setup. Please try again.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleRemovePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearSquad = () => {
    setPlayers([]);
    try {
      localStorage.removeItem(SQUAD_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleShareSetup = async () => {
    const url = new URL(window.location.href);
    if (teamPlaystyle) url.searchParams.set("teamPlaystyle", teamPlaystyle);
    if (aggression) url.searchParams.set("aggression", aggression);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <main className="hero-bg noise-texture min-h-dvh">
      {/* Top Navigation Bar */}
      <header className="nav-blur sticky top-0 z-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 gap-3">
          <Link href="/assessment" className="btn-ghost text-sm shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hide-xs">Adjust</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-3.5 h-3.5">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-[var(--text-primary)] hide-sm">
              eFootball <span className="gradient-text">Coach</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            {teamPlaystyle && (
              <span className="badge badge-green hide-xs">{teamPlaystyle}</span>
            )}
            {aggression && (
              <span className="badge badge-blue hide-sm">{aggression}</span>
            )}
            <button
              type="button"
              onClick={handleShareSetup}
              className="btn-ghost text-xs px-2 py-1.5"
              title="Copy shareable link"
            >
              {copyFeedback ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </header>

      {!teamPlaystyle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>
              No playstyle selected yet. Take the quick assessment for personalized tactics.
            </span>
            <Link href="/assessment" className="btn-secondary text-xs shrink-0">
              Start Assessment
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 lg:sticky lg:top-20">
            <TacticalBoard
              players={players}
              teamPlaystyle={teamPlaystyle}
              aggression={aggression}
              onRemovePlayer={handleRemovePlayer}
              onSelectPlayerForQuestion={(name) => {
                setQuestion(
                  `Coach, how should I best utilize ${name} in our ${teamPlaystyle || "custom"} system?`
                );
                setSidebarTab("chat");
              }}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-0">
            <div className="glass-card rounded-b-none border-b-0 p-1.5 flex gap-1">
              <button
                type="button"
                id="tab-squad"
                onClick={() => setSidebarTab("squad")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                  sidebarTab === "squad"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Squad
                  {players.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                      {players.length}
                    </span>
                  )}
                </span>
              </button>
              <button
                type="button"
                id="tab-chat"
                onClick={() => setSidebarTab("chat")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                  sidebarTab === "chat"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.79" />
                  </svg>
                  AI Coach
                  {messages.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                      {messages.filter((m) => m.role === "assistant").length}
                    </span>
                  )}
                </span>
              </button>
            </div>

            <div className="glass-card rounded-t-none">
              {sidebarTab === "squad" && (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-[var(--text-primary)]">Build Your Squad</h2>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Search the eFootball 2026 database · saved on this device
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {players.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearSquad}
                          className="text-[11px] text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                      <div className="badge badge-green">{players.length} / 11</div>
                    </div>
                  </div>

                  <div className="relative">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                    </svg>
                    <input
                      id="player-search-input"
                      type="text"
                      placeholder="Search player (e.g. Messi, Rodri, Mbappé)…"
                      value={playerSearch}
                      onChange={(e) => setPlayerSearch(e.target.value)}
                      className="input-field pl-9"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent spinner inline-block" />
                      </div>
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="rounded-xl border border-[var(--border-subtle)] overflow-hidden">
                      <div className="px-3 py-2 bg-[var(--bg-glass)] border-b border-[var(--border-subtle)]">
                        <span className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                          Results
                        </span>
                      </div>
                      <div className="max-h-52 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                        {searchResults.map((player) => {
                          const isAdded = players.some((p) => p.id === player.id);
                          return (
                            <button
                              key={player.id}
                              type="button"
                              disabled={isAdded}
                              onClick={() => {
                                if (isAdded) return;
                                setPlayers((prev) => [
                                  ...prev,
                                  {
                                    id: player.id,
                                    name: player.name,
                                    position: player.position,
                                    positions: player.positions,
                                    rating: player.rating,
                                    starRating: player.starRating,
                                    nationalities: player.nationalities,
                                    age: player.age,
                                    height: player.height,
                                    weight: player.weight,
                                    strongFoot: player.strongFoot,
                                    strongHand: player.strongHand,
                                  },
                                ]);
                                setPlayerSearch("");
                                setSearchResults([]);
                              }}
                              className={`w-full px-3 py-2.5 text-left flex items-center justify-between gap-2 text-xs transition-colors ${
                                isAdded
                                  ? "opacity-40 cursor-not-allowed bg-transparent"
                                  : "hover:bg-emerald-500/5 cursor-pointer"
                              }`}
                            >
                              <div className="truncate">
                                <span className="font-bold text-[var(--text-primary)]">{player.name}</span>
                                <span className="text-[var(--text-muted)] ml-2 font-mono">
                                  [{POSITION_NAMES[player.position] || "N/A"}]
                                </span>
                              </div>
                              <span
                                className={`shrink-0 font-bold ${
                                  isAdded ? "text-[var(--text-muted)]" : "text-emerald-400"
                                }`}
                              >
                                {isAdded ? "Added" : player.rating ? `${player.rating}★` : "+ Add"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {players.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                        Selected Squad ({players.length})
                      </div>
                      <div className="space-y-1.5 max-h-64 overflow-y-auto">
                        {players.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] text-xs"
                          >
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0">
                              {POSITION_NAMES[player.position] || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[var(--text-primary)] truncate">{player.name}</p>
                              <p className="text-[var(--text-muted)] text-[11px]">
                                {player.rating ? `${player.rating}★` : ""}{" "}
                                {player.nationalities?.join(", ") || ""}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePlayer(player.id)}
                              className="shrink-0 w-6 h-6 rounded-lg hover:bg-rose-500/15 text-[var(--text-muted)] hover:text-rose-400 flex items-center justify-center transition-colors"
                              title="Remove player"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {players.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-3xl mb-2">⚽</div>
                      <p className="text-sm text-[var(--text-muted)]">
                        Search for players to populate your squad
                      </p>
                    </div>
                  )}
                </div>
              )}

              {sidebarTab === "chat" && (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs">
                          🧠
                        </span>
                        Ask Your AI Coach
                      </h2>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Tactical tweaks, player roles, counter tactics, formation advice
                      </p>
                    </div>
                    {messages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMessages([])}
                        className="text-[11px] text-[var(--text-muted)] hover:text-rose-400 transition-colors shrink-0"
                      >
                        Clear chat
                      </button>
                    )}
                  </div>

                  {messages.length === 0 && !isSubmitting && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        Quick questions
                      </p>
                      <div className="flex flex-col gap-2">
                        {SUGGESTED_QUESTIONS.map((q) => (
                          <button
                            key={q}
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleSubmit(q)}
                            className="text-left text-xs px-3 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:border-emerald-500/30 hover:text-[var(--text-primary)] transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.length > 0 && (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                            msg.role === "user"
                              ? "bg-emerald-500/10 border border-emerald-500/20 ml-4"
                              : "bg-[var(--bg-glass)] border border-[var(--border-subtle)] mr-4"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span
                              className={`badge text-[10px] py-0.5 ${
                                msg.role === "user" ? "badge-green" : "badge-blue"
                              }`}
                            >
                              {msg.role === "user" ? "You" : "Coach"}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-[var(--text-secondary)]">{msg.content}</p>
                        </div>
                      ))}
                      {isSubmitting && (
                        <div className="p-3.5 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] mr-4">
                          <div className="flex items-center gap-2">
                            <span className="badge badge-blue text-[10px] py-0.5">Coach</span>
                            <span className="text-[var(--text-muted)] text-xs">Analyzing…</span>
                          </div>
                          <div className="flex gap-1 mt-2.5">
                            {[0, 1, 2].map((d) => (
                              <div
                                key={d}
                                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                                style={{ animationDelay: `${d * 0.15}s` }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <textarea
                      id="coach-question-input"
                      placeholder="e.g. Which defensive instructions should I assign to my DMF? How do I counter wide counter attacks?"
                      className="input-field resize-none h-28 text-sm leading-relaxed"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[11px] text-[var(--text-muted)]">Ctrl/Cmd + Enter to send</span>
                      <button
                        id="submit-question-btn"
                        type="button"
                        disabled={isSubmitting || !question.trim()}
                        onClick={() => handleSubmit()}
                        className="btn-primary text-sm px-5 py-2.5"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent spinner" />
                            Thinking…
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Ask Coach
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Coach() {
  return (
    <Suspense
      fallback={
        <div className="hero-bg min-h-dvh flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent spinner mx-auto mb-4" />
            <p className="text-[var(--text-muted)] text-sm">Loading Tactical Board…</p>
          </div>
        </div>
      }
    >
      <CoachContent />
    </Suspense>
  );
}
