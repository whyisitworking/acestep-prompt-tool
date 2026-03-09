import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Field {
  key: string;
  label: string;
  acestepField: string;
  tall: boolean;
}

interface CopyBoxProps {
  label: string;
  acestepField: string;
  value: string;
  tall: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FIELDS: Field[] = [
  { key: "CAPTION",            label: "Caption",        acestepField: "Caption",          tall: false },
  { key: "LYRICS",             label: "Lyrics",         acestepField: "Lyrics",           tall: true  },
  { key: "BPM",                label: "BPM",            acestepField: "BPM",              tall: false },
  { key: "KEY SCALE",          label: "Key Scale",      acestepField: "Key / Scale",      tall: false },
  { key: "TIME SIGNATURE",     label: "Time Signature", acestepField: "Time Signature",   tall: false },
  { key: "VOCAL LANGUAGE",     label: "Vocal Language", acestepField: "Vocal Language",   tall: false },
  { key: "DURATION (seconds)", label: "Duration",       acestepField: "Duration",         tall: false },
  { key: "REASONING",          label: "Reasoning",      acestepField: "— reference only", tall: false },
];

const EXAMPLES: string[] = [
  "A haunting late-night jazz song about a relationship falling apart in slow motion",
  "An explosive K-pop banger about chasing dreams against all odds",
  "A sun-soaked indie folk song about a summer road trip and finding yourself",
  "A cinematic orchestral piece with no vocals, for a final battle scene",
  "A 90s R&B slow jam about reconnecting with an old love",
  "A dark trap anthem about rising from hardship and proving doubters wrong",
];

const STEPS = [
  { n: "1", title: "Describe your song",        body: "Type anything — a feeling, a genre, a theme, a reference artist. Vague is fine." },
  { n: "2", title: "Copy the prompt",            body: "Click Copy prompt. Paste it into Claude, ChatGPT, or any capable LLM and run it." },
  { n: "3", title: "Paste the response",         body: "Copy the LLM's full response. Come back and paste it into the box on the Extract tab." },
  { n: "4", title: "Copy fields into ACE-Step",  body: "Each field appears in its own box. Click Copy next to each one and paste directly into ACE-Step 1.5." },
];

const TIPS = [
  "Caption quality drives ~70% of output quality. If results feel off, reword your concept and regenerate.",
  'For purely instrumental music, include "no vocals" in your concept.',
  "Avoid clashing aesthetics (e.g. intimate folk but also huge EDM drops) — pick one dominant direction.",
  "Run 4–8 generations with the same inputs, varying the random seed, before iterating on the prompt.",
];

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(concept: string): string {
  const filled = concept.trim() || "[No concept provided — infer a compelling direction from context]";
  return `# ACE-Step 1.5 Studio-Quality Song Generation Prompt

You are an expert music producer and songwriter. Generate all required inputs to produce a professional, studio-quality song for the AI music system ACE-Step 1.5. Think carefully through each field before writing it.

## SONG CONCEPT

${filled}

## YOUR TASK

Generate ALL fields below. Format your response EXACTLY as shown in OUTPUT FORMAT — plain labeled text blocks, no JSON, no markdown inside values.

---

## FIELD SPECIFICATIONS

### CAPTION (most important)
The global portrait of the song: genre, emotion, specific instruments with texture descriptors, vocal character, production/mixing style, era reference if relevant, tempo feel.
- 80–150 words, written as flowing prose (not a list)
- Do NOT include BPM numbers or key names — those go in their own fields
- Cover at least 6 of these dimensions: genre/subgenre, emotional atmosphere, instruments, vocal character, production style, era reference, tempo feel
- No conflicting descriptors simultaneously

### LYRICS
The temporal script: structure tags control sections, lyric text carries content, performance modifiers control delivery.
- Sections: [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Bridge], [Final Chorus], [Outro]
- One optional performance modifier per tag, separated by " - " (e.g. [Chorus - anthemic])
- Blank line between every section
- 6–10 syllables per line; keep counts consistent within matching positions across verses
- UPPERCASE only at peak emotional moments
- (Parentheses) for background/harmony vocals
- No stacked modifiers on tags; put style details in Caption
- No AI-cliché phrases: "neon skies", "electric hearts", "endless dreams", "chase the light"
- Single consistent metaphor thread throughout

### BPM
Single integer. Slow ballad 60–80 · Mid-tempo 85–110 · Upbeat 115–140 · Dance 120–145 · Fast 150+

### KEY SCALE
Format: "[Note] [Major/Minor]" — e.g. "A Minor", "Db Major", "F# Minor"

### TIME SIGNATURE
One of: 4/4 · 3/4 · 6/8 · 5/4 · 7/8

### VOCAL LANGUAGE
Language of the vocals — e.g. "English", "Mandarin", "Spanish". Use "Instrumental" if no vocals.

### DURATION (seconds)
Single integer. Demo 60–90 · Standard song 150–210 · Extended 240–300

### REASONING
3–5 sentences on your key creative decisions: genre choice, how Caption and Lyrics reinforce each other, the emotional arc, notable production choices.

---

## OUTPUT FORMAT

Use this exact format. No markdown inside values.

REASONING:
[3–5 sentence rationale]

CAPTION:
[Prose caption]

LYRICS:
[Full lyrics with structure tags and blank lines between sections]

BPM:
[Integer]

KEY SCALE:
[e.g. A Minor]

TIME SIGNATURE:
[e.g. 4/4]

VOCAL LANGUAGE:
[e.g. English]

DURATION (seconds):
[Integer]

---

## BEFORE SUBMITTING, VERIFY

- Caption covers 6+ musical dimensions
- BPM and key are NOT in Caption
- Lyrics have 6–8 labeled sections
- Each tag has at most one modifier
- Caption and Lyrics are stylistically coherent, no contradictions
- No AI-cliché phrases in lyrics`;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseOutput(raw: string): Record<string, string> {
  const result: Record<string, string> = {};
  const keys = FIELDS.map((f) => f.key);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const escaped = key.replace(/[()]/g, "\\$&");
    const startPattern = new RegExp(`${escaped}:\\s*\\n?`, "i");
    const startIndex = raw.search(startPattern);
    if (startIndex === -1) continue;
    const afterLabel = raw.slice(startIndex).replace(startPattern, "");
    let endIndex = afterLabel.length;
    if (nextKey) {
      const nextEscaped = nextKey.replace(/[()]/g, "\\$&");
      const nextPattern = new RegExp(`${nextEscaped}:`, "i");
      const nextIndex = afterLabel.search(nextPattern);
      if (nextIndex !== -1) endIndex = nextIndex;
    }
    result[key] = afterLabel.slice(0, endIndex).trim();
  }
  return result;
}

// ─── CopyBox ─────────────────────────────────────────────────────────────────

function CopyBox({ label, acestepField, value, tall }: CopyBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e2e2", letterSpacing: "0.02em" }}>
            {label}
          </span>
          <span style={{ fontSize: 11, color: "#4a4a4a" }}>→ ACE-Step: {acestepField}</span>
        </div>
        <button
          onClick={handleCopy}
          disabled={!value}
          style={{
            fontSize: 11,
            padding: "3px 10px",
            background: copied ? "#1a2e1a" : "#1e1e1e",
            border: "1px solid",
            borderColor: copied ? "#3a6b3a" : "#2e2e2e",
            borderRadius: 4,
            color: copied ? "#6abf6a" : value ? "#999" : "#3a3a3a",
            cursor: value ? "pointer" : "default",
            transition: "all 0.15s",
            fontFamily: "inherit",
          }}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <div
        style={{
          background: "#161616",
          border: "1px solid #252525",
          borderRadius: 6,
          padding: "10px 14px",
          minHeight: tall ? 160 : 40,
          maxHeight: tall ? 280 : 80,
          overflowY: "auto",
          fontSize: 13,
          lineHeight: 1.65,
          // Monospaced boxes get a warmer, brighter tone for legibility
          color: value ? (tall ? "#c8c8c8" : "#d4d4d4") : "#2e2e2e",
          fontFamily: tall ? "'Courier New', monospace" : "inherit",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {value || "Will appear here after you paste the LLM response on the Extract tab."}
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [concept, setConcept]           = useState("");
  const [llmOutput, setLlmOutput]       = useState("");
  const [tab, setTab]                   = useState<"build" | "extract" | "guide">("build");
  const [promptCopied, setPromptCopied] = useState(false);

  const prompt = buildPrompt(concept);
  const parsed = llmOutput ? parseOutput(llmOutput) : {};

  const handlePromptCopy = () => {
    navigator.clipboard.writeText(prompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#4a4a4a",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #252525",
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 14,
    lineHeight: 1.6,
    color: "#e2e2e2",
    background: "#161616",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  const tabBtn = (id: typeof tab): React.CSSProperties => ({
    background: "none",
    border: "none",
    borderBottom: tab === id ? "2px solid #e2e2e2" : "2px solid transparent",
    padding: "10px 0",
    marginRight: 28,
    fontSize: 13,
    fontWeight: tab === id ? 600 : 400,
    color: tab === id ? "#e2e2e2" : "#4a4a4a",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "color 0.15s",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #111; font-family: 'DM Sans', sans-serif; color: #e2e2e2; -webkit-font-smoothing: antialiased; }
        textarea:focus { border-color: #3a3a3a !important; outline: none; }
        textarea::placeholder { color: #2e2e2e; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#111" }}>

        {/* Header */}
        <header style={{ background: "#151515", borderBottom: "1px solid #1e1e1e", padding: "24px 0" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              ACE-Step 1.5
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "#e8e8e8", lineHeight: 1.2 }}>
              Song Prompt Builder
            </h1>
            <p style={{ marginTop: 6, fontSize: 13, color: "#555", lineHeight: 1.5 }}>
              Describe a song → copy a prompt → paste the LLM response → copy fields into ACE-Step.
            </p>
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 80px" }}>

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid #1e1e1e", marginBottom: 32, display: "flex" }}>
            <button style={tabBtn("build")}   onClick={() => setTab("build")}>Build prompt</button>
            <button style={tabBtn("extract")} onClick={() => setTab("extract")}>Extract fields</button>
            <button style={tabBtn("guide")}   onClick={() => setTab("guide")}>How it works</button>
          </div>

          {/* Wrapper with min-height prevents the slight layout jerk when
              switching to shorter-content tabs like "How it works" */}
          <div style={{ minHeight: 520 }}>

            {/* ── Build ── */}
            {tab === "build" && (
              <div>
                <label style={labelStyle}>Your song concept</label>
                <textarea
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="e.g. A melancholy late-night jazz song about a relationship drifting apart"
                  style={{ ...textareaStyle, minHeight: 80 }}
                />

                {/* Examples */}
                <div style={{ marginTop: 12, marginBottom: 32 }}>
                  <span style={{ fontSize: 11, color: "#3a3a3a", marginRight: 8 }}>Try an example:</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: 8 }}>
                    {EXAMPLES.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => setConcept(ex)}
                        style={{
                          padding: "4px 11px",
                          fontSize: 11,
                          background: "transparent",
                          border: "1px solid #222",
                          borderRadius: 20,
                          color: "#555",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.12s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a3a";
                          (e.currentTarget as HTMLButtonElement).style.color = "#bbb";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#222";
                          (e.currentTarget as HTMLButtonElement).style.color = "#555";
                        }}
                      >
                        {ex.length > 48 ? ex.slice(0, 48) + "…" : ex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt preview */}
                <label style={labelStyle}>Generated prompt</label>
                <div
                  style={{
                    background: "#161616",
                    border: "1px solid #252525",
                    borderRadius: 6,
                    padding: "14px 16px",
                    maxHeight: 300,
                    overflowY: "auto",
                    fontSize: 12,
                    lineHeight: 1.7,
                    // Lighter than before for monospace readability
                    color: "#888",
                    fontFamily: "'Courier New', monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    marginBottom: 14,
                  }}
                >
                  {prompt}
                </div>

                <button
                  onClick={handlePromptCopy}
                  style={{
                    width: "100%",
                    padding: "13px 20px",
                    background: promptCopied ? "#1a2e1a" : "#e8e8e8",
                    border: "1px solid",
                    borderColor: promptCopied ? "#3a6b3a" : "#e8e8e8",
                    borderRadius: 6,
                    color: promptCopied ? "#6abf6a" : "#111",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {promptCopied ? "Copied — now paste into your LLM ✓" : "Copy prompt"}
                </button>

                <p style={{ marginTop: 12, fontSize: 12, color: "#3a3a3a", textAlign: "center" }}>
                  Then come back to the{" "}
                  <strong style={{ color: "#555", fontWeight: 500 }}>Extract fields</strong>{" "}
                  tab with the LLM's response.
                </p>
              </div>
            )}

            {/* ── Extract ── */}
            {tab === "extract" && (
              <div>
                <label style={labelStyle}>Paste LLM response</label>
                <textarea
                  value={llmOutput}
                  onChange={(e) => setLlmOutput(e.target.value)}
                  placeholder="Paste the full response from your LLM here. Fields are extracted automatically below."
                  style={{
                    ...textareaStyle,
                    minHeight: 120,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    // Slightly lighter for monospace paste area
                    color: "#bbb",
                    marginBottom: 32,
                  }}
                />

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
            )}

            {/* ── Guide ── */}
            {tab === "guide" && (
              <div>
                <div style={{ marginBottom: 40 }}>
                  <label style={labelStyle}>Steps</label>
                  {STEPS.map((s) => (
                    <div key={s.n} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                      <div
                        style={{
                          flexShrink: 0,
                          width: 26, height: 26,
                          borderRadius: "50%",
                          background: "#e8e8e8",
                          color: "#111",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 600,
                          marginTop: 2,
                        }}
                      >
                        {s.n}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, color: "#e2e2e2" }}>{s.title}</div>
                        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.55 }}>{s.body}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label style={labelStyle}>Tips</label>
                  {TIPS.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                      <span style={{ color: "#2e2e2e", flexShrink: 0, marginTop: 1, fontSize: 14 }}>—</span>
                      <span style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>{/* end tab content wrapper */}
        </main>
      </div>
    </>
  );
}