export enum SpeechType {
  IMPROMPTU = "impromptu",
  PREPARED = "prepared",
  EVALUATIVE = "evaluative",
}

export const DEFAULT_TIMES: Record<
  SpeechType,
  { minutes: number; seconds: number }
> = {
  [SpeechType.IMPROMPTU]: { minutes: 2, seconds: 30 },
  [SpeechType.PREPARED]: { minutes: 7, seconds: 0 },
  [SpeechType.EVALUATIVE]: { minutes: 2, seconds: 30 },
};

// Development mode flag
export const IS_DEV_MODE = process.env.NODE_ENV === "development";

// Color thresholds for shorter speeches (Impromptu & Evaluative - 2.5 minutes)
export const IMPROMPTU_AND_EVALUATIVE_THRESHOLDS = {
  GREEN: 60, // 1 minute
  ORANGE: 30, // 30 seconds
  RED: 0,
};

// Color thresholds for longer speeches (Prepared - 7 minutes)
export const PREPARED_THRESHOLDS = {
  GREEN: 120, // 2 minutes
  ORANGE: 60, // 1 minute
  RED: 0,
};

export const THEMES = [
  { id: "business", name: "Business & Leadership" },
  { id: "technology", name: "Technology & Innovation" },
  { id: "social", name: "Social Issues" },
  { id: "philosophy", name: "Philosophy & Ethics" },
  { id: "environment", name: "Environment & Sustainability" },
];
