"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="panel empty-state">
      <h1 className="text-2xl">Something went wrong</h1>
      <p className="muted mt-3">
        The page could not be loaded. Please try again.
      </p>
      <button className="button mt-5" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
