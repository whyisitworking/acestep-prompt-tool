type TabType = "build" | "extract" | "guide";

interface TabsProps {
  tab: TabType;
  setTab: (tab: TabType) => void;
}

export default function Tabs({ tab, setTab }: TabsProps) {
  return (
    <div className="tabs-container">
      <div className="tabs-wrapper bordered-glass-panel">
        <button
          className={`tab-btn ${tab === "build" ? "active" : ""}`}
          onClick={() => setTab("build")}
        >
          Build prompt
        </button>
        <button
          className={`tab-btn ${tab === "extract" ? "active" : ""}`}
          onClick={() => setTab("extract")}
        >
          Extract fields
        </button>
        <button
          className={`tab-btn ${tab === "guide" ? "active" : ""}`}
          onClick={() => setTab("guide")}
        >
          How it works
        </button>
      </div>
    </div>
  );
}
