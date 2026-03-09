import { useState } from "react";
import type { CopyBoxProps } from "../utils/constants";

export default function CopyBox({ label, acestepField, value, tall }: CopyBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="copy-box-container">
      <div className="copy-box-header">
        <div className="copy-box-labels">
          <span className="copy-box-label">{label}</span>
          <span className="copy-box-sublabel">→ ACE-Step: {acestepField}</span>
        </div>
        <button
          onClick={handleCopy}
          disabled={!value}
          className={`copy-btn ${copied ? "copied" : ""} ${!value ? "disabled" : ""}`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <div
        className={`copy-box-content ${tall ? "tall" : "short"} ${value ? "filled" : "empty"}`}
      >
        {value || "Will appear here after you paste the LLM response on the Extract tab."}
      </div>
    </div>
  );
}
