export default function CryptoLoading() {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Loading cryptocurrency data"
    >
      <p className="eyebrow mb-6">Loading market snapshot…</p>
      <div className="panel skeleton" />
      <p className="muted text-sm mt-4">
        Fetching the latest cryptocurrency data.
      </p>
    </section>
  );
}
