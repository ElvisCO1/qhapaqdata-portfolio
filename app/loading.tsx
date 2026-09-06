export default function Loading() {
  return (
    <div role="status" aria-label="Loading page">
      <p className="eyebrow mb-6">Loading QhapaqData…</p>
      <div className="panel skeleton" />
    </div>
  );
}
