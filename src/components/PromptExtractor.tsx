import { FIELDS } from "../utils/constants";
import CopyBox from "./CopyBox";

interface PromptExtractorProps {
  llmOutput: string;
  setLlmOutput: (val: string) => void;
  parsed: Record<string, string>;
}

export default function PromptExtractor({
  llmOutput,
  setLlmOutput,
  parsed,
}: PromptExtractorProps) {
  return (
    <div className="tab-pane animate-fade-in">
      <div className="input-group">
        <label className="input-label">Paste LLM response</label>
        <textarea
          value={llmOutput}
          onChange={(e) => setLlmOutput(e.target.value)}
          placeholder="Paste the full response from your LLM here. Fields are extracted automatically below."
          className="text-input monospace-input"
          style={{ minHeight: "120px", marginBottom: "32px" }}
        />
      </div>

      <div className="extracted-fields-grid">
        {FIELDS.map((f) => (
          <CopyBox
            key={f.key}
            label={f.label}
            acestepField={f.acestepField}
            value={parsed[f.key] || ""}
            tall={f.tall}
          />
        ))}
      </div>
    </div>
  );
}
