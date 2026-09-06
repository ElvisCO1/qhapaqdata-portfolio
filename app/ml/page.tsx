import { SectionHeader, EmptyState, Pipeline } from "@/components/ui";
export const metadata = { title: "Machine Learning" };
export default function ML() {
  return (
    <>
      <SectionHeader
        eyebrow="PATTERNS, MODELS & EVIDENCE"
        title="Machine Learning"
        description="A growing space for regression, classification, clustering, and time-series research."
      />
      <div className="panel content-panel">
        <span className="eyebrow">PLANNED RESEARCH</span>
        <h2 className="mt-4">Cryptocurrency Time-Series Forecasting</h2>
        <p className="muted">
          A comparative study of RNN, LSTM, and GRU architectures. Evaluation
          will use temporal splits and report MAE, RMSE, training periods, and
          limitations.
        </p>
        <div className="tags">
          {["RNN", "LSTM", "GRU", "Temporal validation", "ONNX"].map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-7">
        <EmptyState title="Research in progress">
          No trained models or prediction results are published yet. Future
          experiments will document their methods and uncertainty.
        </EmptyState>
      </div>
      <div className="section-label">
        <h2 className="section-title">The data foundation</h2>
      </div>
      <Pipeline />
    </>
  );
}
