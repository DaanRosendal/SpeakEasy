export enum SpeechType {
  IMPROMPTU = "impromptu",
  PREPARED = "prepared",
  EVALUATIVE = "evaluative"
}

export const DEFAULT_TIMES = {
  [SpeechType.IMPROMPTU]: { minutes: 2, seconds: 30 },
  [SpeechType.PREPARED]: { minutes: 7, seconds: 0 },
  [SpeechType.EVALUATIVE]: { minutes: 2, seconds: 30 }
};

export const THEMES = [
  { id: "business", name: "Business & Leadership" },
  { id: "technology", name: "Technology & Innovation" },
  { id: "social", name: "Social Issues" },
  { id: "philosophy", name: "Philosophy & Ethics" },
  { id: "environment", name: "Environment & Sustainability" }
];
