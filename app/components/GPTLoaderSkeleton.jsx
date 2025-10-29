import React from "react";

export default function GPTLoaderSkeleton() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-no-repeat bg-cover flex flex-col items-center justify-start text-gray-700">
      <header className="w-full max-w-7xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="h-10 w-32 rounded-lg bg-indigo-500/90 animate-pulse"
            aria-hidden="true"
          />
          <nav className="hidden md:flex gap-4">
            <div className="h-3 w-20 rounded bg-indigo-500/70 animate-pulse" />
            <div className="h-3 w-20 rounded bg-indigo-500/70 animate-pulse" />
            <div className="h-3 w-20 rounded bg-indigo-500/70 animate-pulse" />
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-28 rounded-lg bg-indigo-500/90 animate-pulse" />
          <div className="h-9 w-9 rounded-full bg-indigo-500/90 animate-pulse" />
        </div>
      </header>

      {/* Hero skeleton */}
      <main className="flex-1 w-full max-w-7xl px-6 py-8">
        <section className="rounded-2xl bg-gray-800 shadow-md p-8 flex flex-col md:flex-row items-start gap-8">
          <div className="flex-1">
            <div className="h-8 w-3/4 rounded-md bg-indigo-500 animate-pulse mb-4" />
            <div className="h-6 w-1/2 rounded-md bg-indigo-500/80 animate-pulse mb-6" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-indigo-500/60 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-indigo-500/60 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-indigo-500/60 animate-pulse" />
            </div>
            <div className="mt-6 flex gap-4">
              <div className="h-11 w-36 rounded-md bg-indigo-500/95 animate-pulse" />
              <div className="h-11 w-28 rounded-md bg-indigo-500/80 animate-pulse" />
            </div>
          </div>

          <div
            className="w-full md:w-1/3 h-56 rounded-lg bg-indigo-500/95 animate-pulse"
            aria-hidden="true"
          />
        </section>

        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <article
              key={i}
              className="rounded-xl bg-gray-800 p-4 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow"
              aria-hidden="true"
            >
              <div className="h-40 rounded-md bg-indigo-500/95 animate-pulse w-full" />
              <div className="h-4 w-3/4 rounded bg-indigo-500/80 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-indigo-500/70 animate-pulse" />
              <div className="mt-auto flex items-center justify-between">
                <div className="h-8 w-20 rounded bg-indigo-500/90 animate-pulse" />
                <div className="h-8 w-24 rounded bg-indigo-500/80 animate-pulse" />
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="w-full max-w-7xl px-6 py-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-28 rounded bg-indigo-500/95 animate-pulse" />
          <div className="h-6 w-36 rounded bg-indigo-500/70 animate-pulse hidden sm:block" />
        </div>
        <div className="flex gap-3">
          <div className="h-6 w-6 rounded-full bg-indigo-500/95 animate-pulse" />
          <div className="h-6 w-6 rounded-full bg-indigo-500/95 animate-pulse" />
          <div className="h-6 w-6 rounded-full bg-indigo-500/95 animate-pulse" />
        </div>
      </footer>

      <span className="sr-only" role="status" aria-live="polite">
        Loading, please wait...
      </span>
    </div>
  );
}
