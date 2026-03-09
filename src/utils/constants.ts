export interface Field {
  key: string;
  label: string;
  acestepField: string;
  tall: boolean;
}

export interface CopyBoxProps {
  label: string;
  acestepField: string;
  value: string;
  tall: boolean;
}

export const FIELDS: Field[] = [
  { key: "CAPTION",            label: "Caption",        acestepField: "Caption",          tall: false },
  { key: "LYRICS",             label: "Lyrics",         acestepField: "Lyrics",           tall: true  },
  { key: "BPM",                label: "BPM",            acestepField: "BPM",              tall: false },
  { key: "KEY SCALE",          label: "Key Scale",      acestepField: "Key / Scale",      tall: false },
  { key: "TIME SIGNATURE",     label: "Time Signature", acestepField: "Time Signature",   tall: false },
  { key: "VOCAL LANGUAGE",     label: "Vocal Language", acestepField: "Vocal Language",   tall: false },
  { key: "DURATION (seconds)", label: "Duration",       acestepField: "Duration",         tall: false },
  { key: "REASONING",          label: "Reasoning",      acestepField: "— reference only", tall: false },
];

export const EXAMPLES: string[] = [
  "A haunting late-night jazz song about drifting apart",
  "An explosive K-pop banger about chasing dreams",
  "A sun-soaked indie folk song about a summer road trip",
];

export const STEPS = [
  { n: "1", title: "Describe your song",        body: "Type anything — a feeling, a genre, a theme, a reference artist. Vague is fine." },
  { n: "2", title: "Copy the prompt",            body: "Click Copy prompt. Paste it into Claude, ChatGPT, or any capable LLM and run it." },
  { n: "3", title: "Paste the response",         body: "Copy the LLM's full response. Come back and paste it into the box on the Extract tab." },
  { n: "4", title: "Copy fields into ACE-Step",  body: "Each field appears in its own box. Click Copy next to each one and paste directly into ACE-Step 1.5." },
];

export const TIPS = [
  "Caption quality drives ~70% of output quality. If results feel off, reword your concept and regenerate.",
  'For purely instrumental music, include "no vocals" in your concept.',
  "Avoid clashing aesthetics (e.g. intimate folk but also huge EDM drops) — pick one dominant direction.",
  "Run 4–8 generations with the same inputs, varying the random seed, before iterating on the prompt.",
];

export const LANGUAGES: Record<string, string> = {
  ar: "Arabic",
  az: "Azerbaijani",
  bg: "Bulgarian",
  bn: "Bengali",
  ca: "Catalan",
  cs: "Czech",
  da: "Danish",
  de: "German",
  el: "Greek",
  en: "English",
  es: "Spanish",
  fa: "Persian",
  fi: "Finnish",
  fr: "French",
  he: "Hebrew",
  hi: "Hindi",
  hr: "Croatian",
  ht: "Haitian Creole",
  hu: "Hungarian",
  id: "Indonesian",
  is: "Icelandic",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  la: "Latin",
  lt: "Lithuanian",
  ms: "Malay",
  ne: "Nepali",
  nl: "Dutch",
  no: "Norwegian",
  pa: "Punjabi",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  sa: "Sanskrit",
  sk: "Slovak",
  sr: "Serbian",
  sv: "Swedish",
  sw: "Swahili",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  tl: "Tagalog",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  vi: "Vietnamese",
  yue: "Cantonese",
  zh: "Chinese",
  unknown: "Unknown",
};
