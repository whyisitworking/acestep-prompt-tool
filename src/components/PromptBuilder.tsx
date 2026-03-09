import { useState } from "react";
import { EXAMPLES, LANGUAGES } from "../utils/constants";

interface PromptBuilderProps {
  concept: string;
  setConcept: (val: string) => void;
  songStyle: string;
  setSongStyle: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  prompt: string;
}

export default function PromptBuilder({
  concept,
  setConcept,
  songStyle,
  setSongStyle,
  language,
  setLanguage,
  prompt,
}: PromptBuilderProps) {
  const [promptCopied, setPromptCopied] = useState(false);

  const handlePromptCopy = () => {
    navigator.clipboard.writeText(prompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  return (
    <div className="tab-pane animate-fade-in">
      <div className="input-group">
        <label className="input-label">Your song concept</label>
        <textarea
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="e.g. A melancholy late-night jazz song about a relationship drifting apart"
          className="text-input"
          style={{ minHeight: "80px" }}
        />
      </div>

      <div className="examples-container">
        <span className="examples-label">Try an example:</span>
        <div className="examples-grid">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setConcept(ex)}
              className="example-btn"
            >
              {ex.length > 48 ? ex.slice(0, 48) + "…" : ex}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group" style={{ marginTop: "24px" }}>
        <label className="input-label">Optional: Song Style & Influences</label>
        <textarea
          value={songStyle}
          onChange={(e) => setSongStyle(e.target.value)}
          placeholder="e.g. 80s synthwave, heavy 808s, bright brass, warm tape saturation... (Strongly steers the generated style)"
          className="text-input"
          style={{ minHeight: "60px" }}
        />
      </div>

      <div className="input-group" style={{ marginTop: "24px" }}>
        <label className="input-label">Vocal Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="text-input"
          style={{ width: "100%", padding: "12px", borderRadius: "12px" }}
        >
          <option value="automatic">Automatic (Infer from Concept & Lyrics)</option>
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="prompt-preview-container">
        <label className="input-label">Generated prompt</label>
        <div className="prompt-preview scrollbar-hide">
          {prompt}
        </div>
      </div>

      <button
        onClick={handlePromptCopy}
        className={`copy-prompt-btn ${promptCopied ? "success glass-panel" : "glass-panel"}`}
      >
        {promptCopied ? "Copied — now paste into your LLM ✓" : "Copy prompt"}
      </button>

      <p className="helper-text">
        Then come back to the <strong>Extract fields</strong> tab with the LLM's response.
      </p>
    </div>
  );
}
