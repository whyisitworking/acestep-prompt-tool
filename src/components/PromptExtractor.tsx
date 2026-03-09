import { FIELDS, LANGUAGES } from "../utils/constants";
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
  const hasValidData = Object.keys(parsed).length > 0 && !!parsed["CAPTION"];
  
  const handleDownloadJson = () => {
    // Reverse map full language names to codes
    const reverseLangMap = Object.entries(LANGUAGES).reduce((acc, [code, name]) => {
      acc[name.toLowerCase()] = code;
      return acc;
    }, {} as Record<string, string>);

    const extractedLangName = (parsed["VOCAL LANGUAGE"] || "unknown").toLowerCase();
    const langCode = reverseLangMap[extractedLangName] || "unknown";

    const jsonToExport = {
      think: true,
      caption: parsed["CAPTION"] || "",
      lyrics: parsed["LYRICS"] || "",
      bpm: parseInt(parsed["BPM"] || "120", 10),
      duration: parseInt(parsed["DURATION (seconds)"] || "180", 10),
      keyscale: parsed["KEY SCALE"] || "",
      language: langCode,
      timesignature: parsed["TIME SIGNATURE"] || ""
    };

    const blob = new Blob([JSON.stringify(jsonToExport, null, 4)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Create dynamic filename
    let fileName = "acestep_prompt.json";
    if (jsonToExport.caption) {
      const words = jsonToExport.caption.split(/[\s,]+/).filter(Boolean).slice(0, 3);
      if (words.length > 0) {
        fileName = `${words.join("_").toLowerCase()}_prompt.json`;
      }
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tab-pane animate-fade-in">
      <div className="input-group">
        <label className="input-label">Paste LLM response</label>
        <textarea
          value={llmOutput}
          onChange={(e) => setLlmOutput(e.target.value)}
          placeholder="Paste the full response from your LLM here. Fields are extracted automatically below."
          className="text-input monospace-input textarea-lg"
        />
        
        <div className="download-action-container">
          <button
            onClick={handleDownloadJson}
            disabled={!hasValidData}
            className={`copy-btn ${hasValidData ? "copied" : ""}`}
            title={hasValidData ? "Download JSON File" : "Paste a valid response first"}
          >
            {hasValidData ? "Download JSON" : "Waiting for valid data..."}
          </button>
        </div>
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
