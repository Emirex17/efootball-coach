"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <main className="hero-bg noise-texture min-h-dvh flex flex-col items-center justify-center px-4 text-center">
      <div className="glass-card max-w-md p-8 sm:p-10">
        <p className="text-5xl font-black text-rose-400 mb-3">!</p>
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          An unexpected error occurred. You can try again or return home.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={reset} className="btn-primary text-sm">
            Try again
          </button>
          <Link href="/" className="btn-secondary text-sm">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
