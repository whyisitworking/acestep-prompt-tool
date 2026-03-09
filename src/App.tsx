import { useState } from "react";
import "./index.css";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import PromptBuilder from "./components/PromptBuilder";
import PromptExtractor from "./components/PromptExtractor";
import Guide from "./components/Guide";
import { buildPrompt, parseOutput } from "./utils/promptGenerator";

export default function App() {
  const [concept, setConcept] = useState("");
  const [songStyle, setSongStyle] = useState("");
  const [language, setLanguage] = useState("automatic");
  const [lyricsDepth, setLyricsDepth] = useState<"literal" | "balanced" | "metaphorical">("balanced");
  const [llmOutput, setLlmOutput] = useState("");
  const [tab, setTab] = useState<"build" | "extract" | "guide">("build");

  const prompt = buildPrompt(concept, songStyle, language, lyricsDepth);
  const parsed = llmOutput ? parseOutput(llmOutput) : {};

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <Tabs tab={tab} setTab={setTab} />

        <div className="tab-content-wrapper glass-panel shadow-lg">
          {tab === "build" && (
            <PromptBuilder
              concept={concept}
              setConcept={setConcept}
              songStyle={songStyle}
              setSongStyle={setSongStyle}
              language={language}
              setLanguage={setLanguage}
              lyricsDepth={lyricsDepth}
              setLyricsDepth={setLyricsDepth}
              prompt={prompt}
            />
          )}

          {tab === "extract" && (
            <PromptExtractor
              llmOutput={llmOutput}
              setLlmOutput={setLlmOutput}
              parsed={parsed}
            />
          )}

          {tab === "guide" && <Guide />}
        </div>
      </main>

      <footer className="app-footer">
        Made with ❤️ by Suhel Chakraborty
      </footer>
    </div>
  );
}