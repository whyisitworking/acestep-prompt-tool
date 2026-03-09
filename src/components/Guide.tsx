import { STEPS, TIPS } from "../utils/constants";

export default function Guide() {
  return (
    <div className="tab-pane animate-fade-in">
      <div className="guide-section">
        <label className="input-label">Steps</label>
        <div className="steps-list">
          {STEPS.map((s) => (
            <div key={s.n} className="step-item">
              <div className="step-number bordered-glass-panel">{s.n}</div>
              <div className="step-content">
                <h3 className="step-title">{s.title}</h3>
                <p className="step-body">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="guide-section mt-2-5">
        <label className="input-label">Tips</label>
        <div className="tips-list">
          {TIPS.map((tip, i) => (
            <div key={i} className="tip-item bordered-glass-panel">
              <span className="tip-bullet">—</span>
              <span className="tip-text">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
