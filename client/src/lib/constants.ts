export enum SpeechType {
  IMPROMPTU = "impromptu",
  PREPARED = "prepared",
  EVALUATIVE = "evaluative",
  TEST = "test",
}

export const DEFAULT_TIMES = {
  [SpeechType.IMPROMPTU]: { minutes: 2, seconds: 30 },
  [SpeechType.PREPARED]: { minutes: 7, seconds: 0 },
  [SpeechType.EVALUATIVE]: { minutes: 2, seconds: 30 },
  [SpeechType.TEST]: { minutes: 0, seconds: 7 },
};

// Test mode times for development (7 seconds total)
export const TEST_MODE_TIMES = {
  [SpeechType.IMPROMPTU]: { minutes: 0, seconds: 7 },
  [SpeechType.PREPARED]: { minutes: 0, seconds: 7 },
  [SpeechType.EVALUATIVE]: { minutes: 0, seconds: 7 },
};

// Check if we're in development mode
export const IS_DEV_MODE = import.meta.env.DEV;

// Test mode color thresholds (for 7-second timer)
export const TEST_MODE_COLOR_THRESHOLDS = {
  GREEN: 5, // Green at 5 seconds remaining
  ORANGE: 3, // Orange at 3 seconds remaining
  RED: 0, // Red when time's up
};

// Production color thresholds (existing behavior)
export const PROD_MODE_COLOR_THRESHOLDS = {
  GREEN: 60, // Green at 1 minute remaining
  ORANGE: 30, // Orange at 30 seconds remaining
  RED: 0, // Red when time's up
};

export const THEMES = [
  { id: "business", name: "Business & Leadership" },
  { id: "technology", name: "Technology & Innovation" },
  { id: "social", name: "Social Issues" },
  { id: "philosophy", name: "Philosophy & Ethics" },
  { id: "environment", name: "Environment & Sustainability" },
];
