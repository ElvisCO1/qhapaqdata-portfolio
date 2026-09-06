export function LastUpdated({ timestamp }: { timestamp: string }) {
  const date = new Date(timestamp);
  return (
    <div className="demo-note">
      <span className="status-dot" />
      Latest market snapshot
      <span className="muted">
        Last updated:{" "}
        <time dateTime={timestamp}>
          {date.toISOString().replace("T", " ").slice(0, 19)} UTC
        </time>
      </span>
    </div>
  );
}
