import { FIELDS, LANGUAGES } from "./constants";

export function buildPrompt(concept: string, songStyle: string = "", language: string = "automatic"): string {
  const filledConcept = concept.trim() || "[No concept provided — infer a compelling direction from context]";
  
  const styleInstruction = songStyle.trim() 
    ? `\n\n## SONG STYLE / INFLUENCES\n\n${songStyle.trim()}\n\n**CRITICAL INSTRUCTION**: The user has provided specific style influences. You MUST strongly incorporate these style text influences into the CAPTION field and adapt the overall production approach to match this requested aesthetic.`
    : "";

  return `# ACE-Step 1.5 Studio-Quality Song Generation Prompt

You are an expert music producer and songwriter. Generate all required inputs to produce a professional, studio-quality song for the AI music system ACE-Step 1.5. Think carefully through each field before writing it.

## SONG CONCEPT

${filledConcept}${styleInstruction}

## YOUR TASK

Generate ALL fields below. Format your response EXACTLY as shown in OUTPUT FORMAT — plain labeled text blocks, no JSON, no markdown inside values.

---

## FIELD SPECIFICATIONS

### CAPTION (most important)
The global portrait of the song: genre, emotion, specific instruments with texture descriptors, vocal character, production/mixing style, era reference.
- 80–150 words, written as flowing prose (not a list)
- Do NOT include BPM numbers, key names, or time signatures — those go in their own fields
- Cover at least 6 of these dimensions: genre/subgenre, emotional atmosphere, instruments, vocal character, production style, era reference, tempo feel
- **CRITICAL**: Use specific texture words (e.g., warm, crisp, airy, punchy, muddy, raw). 'Specific beats vague' is the rule.
- **CRITICAL**: Do NOT include conflicting descriptors simultaneously (e.g. classical strings + hardcore metal) unless properly evolved over time.

### LYRICS
The temporal script: structure tags control sections, lyric text carries content, performance modifiers control delivery.
- Sections: [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Bridge], [Final Chorus], [Outro]
- Keep structure tags concise. One optional performance modifier per tag, separated by " - " (e.g. [Chorus - anthemic])
- Blank line between every section
- **CRITICAL**: 6–10 syllables per line; keep counts strictly consistent within matching positions across verses.
- UPPERCASE only at peak emotional moments to indicate vocal intensity.
- (Parentheses) for background/harmony vocals.
- No stacked modifiers on tags; put complex style details in Caption.
- **CRITICAL**: Ensure Lyrics match the Style and Emotion defined in Caption (No Conflicts).
- No AI-cliché phrases: "neon skies", "electric hearts", "endless dreams", "chase the light".
- Stick to a single consistent metaphor thread throughout the song.

### BPM
Single integer. Slow ballad 60–80 · Mid-tempo 85–110 · Upbeat 115–140 · Dance 120–145 · Fast 150+

### KEY SCALE
Format: "[Note] [Major/Minor]" — e.g. "A Minor", "Db Major", "F# Minor"

### TIME SIGNATURE
One of: 4/4 · 3/4 · 6/8 · 5/4 · 7/8

### VOCAL LANGUAGE
Language of the vocals.
${
  language === "automatic"
    ? "Determine the most appropriate language based on the lyrics or concept. Output the English name for it (e.g. English, Chinese)."
    : `**CRITICAL INSTRUCTION**: You MUST use exactly this language name: ${LANGUAGES[language]}`
}

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

export function parseOutput(raw: string): Record<string, string> {
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
