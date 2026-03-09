export default function Header() {
  return (
    <header className="app-header glass-panel">
      <div className="header-content">
        <div className="header-subtitle">ACE-Step 1.5</div>
        <h1 className="header-title">Song Prompt Builder</h1>
        <p className="header-description">
          Describe a song → copy a prompt → paste the LLM response → copy fields into ACE-Step.
        </p>
      </div>
    </header>
  );
}
