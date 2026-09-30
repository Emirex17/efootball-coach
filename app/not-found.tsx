import Link from "next/link";

export default function NotFound() {
  return (
    <main className="hero-bg noise-texture min-h-dvh flex flex-col items-center justify-center px-4 text-center">
      <div className="glass-card max-w-md p-8 sm:p-10">
        <p className="text-5xl font-black gradient-text mb-3">404</p>
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Page not found
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          That route doesn&apos;t exist. Head back and build your tactics.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary text-sm">
            Home
          </Link>
          <Link href="/assessment" className="btn-secondary text-sm">
            Start Assessment
          </Link>
        </div>
      </div>
    </main>
  );
}
