import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PlayIcon,
  PauseIcon,
  Square,
  RotateCcwIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { SpeechType, DEFAULT_TIMES } from "@/lib/constants";
import useCountdownTimer from "@/hooks/useCountdownTimer";

interface TimerProps {
  speechType: SpeechType;
  onStartSpeech?: () => void;
  onStopSpeech?: () => void;
  onSpeechComplete?: () => void;
  isSpeechActive: boolean;
  hideCountdown?: boolean;
  setHideCountdown?: (value: boolean) => void;
  selectedTopic?: string | null;
  customMinutes?: number | null;
  customSeconds?: number | null;
  setCustomMinutes?: (value: number) => void;
  setCustomSeconds?: (value: number) => void;
}

export default function Timer({
  speechType,
  onStartSpeech,
  onStopSpeech,
  onSpeechComplete,
  isSpeechActive,
  hideCountdown: parentHideCountdown,
  setHideCountdown: parentSetHideCountdown,
  selectedTopic,
  customMinutes,
  customSeconds,
  setCustomMinutes,
  setCustomSeconds,
}: TimerProps) {
  const {
    minutes: hookMinutes,
    seconds: hookSeconds,
    isRunning,
    isPaused,
    hideCountdown: hookHideCountdown,
    timerColor,
    timeAlert,
    progress,
    setMinutes: hookSetMinutes,
    setSeconds: hookSetSeconds,
    setHideCountdown: hookSetHideCountdown,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopTimer,
  } = useCountdownTimer(
    speechType,
    onSpeechComplete,
    customMinutes ?? undefined,
    customSeconds ?? undefined
  );

  // Use parent hideCountdown if provided, otherwise use hook's state
  const hideCountdown = parentHideCountdown ?? hookHideCountdown;
  const setHideCountdown = parentSetHideCountdown ?? hookSetHideCountdown;

  // For display and input, use hook's state (which reflects the actual timer state)
  // But for settings updates, update both hook and parent state
  const minutes = hookMinutes;
  const seconds = hookSeconds;

  // Create wrapper setters that update both hook and parent state
  const setMinutes = useCallback(
    (value: number) => {
      hookSetMinutes(value);
      if (setCustomMinutes) {
        setCustomMinutes(value);
      }
    },
    [hookSetMinutes, setCustomMinutes]
  );

  const setSeconds = useCallback(
    (value: number) => {
      hookSetSeconds(value);
      if (setCustomSeconds) {
        setCustomSeconds(value);
      }
    },
    [hookSetSeconds, setCustomSeconds]
  );

  // Check if start button should be disabled
  const isStartDisabled = speechType === SpeechType.IMPROMPTU && !selectedTopic;
  const disabledTooltip = "Please select a topic for your impromptu speech";

  // Start timer when speech becomes active
  useEffect(() => {
    if (isSpeechActive && !isRunning) {
      startTimer();
    }
  }, [isSpeechActive, isRunning, startTimer]);

  // Convert hex color to RGB for background overlay, handle CSS variables
  const getColorRgb = (color: string) => {
    // Handle hex colors
    if (color.startsWith("#")) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
    }

    // Handle specific colors we know
    if (color === "#4CAF50") {
      return { r: 76, g: 175, b: 80 }; // Green
    } else if (color === "#F39C12") {
      return { r: 243, g: 156, b: 18 }; // Matches #F39C12
    } else if (color === "#F44336") {
      return { r: 244, g: 67, b: 54 }; // Red
    }

    // Return null for CSS variables - no background overlay
    return null;
  };

  const handleStartSpeech = () => {
    // Call the onStartSpeech callback first (if provided) to check if speech should start
    if (onStartSpeech) {
      onStartSpeech();
      // Only start timer after the speech is actually activated
      // The timer will be started via the isSpeechActive prop change
    } else {
      // If no callback provided, start timer directly
      startTimer();
    }
  };

  const handleStopSpeech = () => {
    stopTimer();
    if (onStopSpeech) onStopSpeech();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  if (!isSpeechActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="bg-card border-border border-2">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Timer Settings
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label
                  htmlFor="minutes-input"
                  className="block mb-2 text-sm font-medium text-foreground"
                >
                  Minutes
                </Label>
                <Input
                  id="minutes-input"
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  min={0}
                  max={60}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="flex-1">
                <Label
                  htmlFor="seconds-input"
                  className="block mb-2 text-sm font-medium text-foreground"
                >
                  Seconds
                </Label>
                <Input
                  id="seconds-input"
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  min={0}
                  max={59}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  id="hide-countdown"
                  checked={hideCountdown}
                  onCheckedChange={setHideCountdown}
                />
                <Label htmlFor="hide-countdown" className="text-sm">
                  Hide countdown
                </Label>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block">
                      <Button
                        onClick={handleStartSpeech}
                        className="px-6"
                        disabled={isStartDisabled}
                      >
                        <PlayIcon className="mr-2 h-4 w-4" />
                        Start Speech
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {isStartDisabled && (
                    <TooltipContent>
                      <p>{disabledTooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const rgb = getColorRgb(timerColor);

  return (
    <>
      {/* Full-page background color overlay - only show when we have a color */}
      {rgb && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
            transition: "background 1s ease-in",
          }}
        />
      )}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center relative z-10"
      >
        <div className="relative h-64 w-64 flex items-center justify-center">
          <svg className="absolute" width="240" height="240">
            {/* Base circle - always visible */}
            <circle
              cx="120"
              cy="120"
              r="110"
              fill="none"
              stroke={hideCountdown ? timerColor : "hsl(var(--muted))"}
              strokeWidth="8"
              className="transition-all duration-1000"
            />
            {/* Progress circle - hidden when hideCountdown is true */}
            <circle
              cx="120"
              cy="120"
              r="110"
              fill="none"
              stroke={timerColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="691"
              strokeDashoffset={`${
                691 - 691 * (isNaN(progress) ? 1 : progress)
              }`}
              className={`transition-all duration-1000 ${
                hideCountdown ? "opacity-0" : "opacity-100"
              }`}
            />
          </svg>

          <div className="flex flex-col items-center justify-center">
            <div
              className={`font-mono text-5xl font-semibold transition-opacity duration-300 ${
                hideCountdown ? "opacity-0" : "opacity-100"
              }`}
            >
              {`${minutes}:${seconds.toString().padStart(2, "0")}`}
            </div>
            <AnimatePresence>
              {timeAlert && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center mt-2"
                >
                  <p className="text-lg font-medium text-foreground">
                    {timeAlert}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={handlePauseResume}
            disabled={!isRunning}
          >
            {isPaused ? (
              <PlayIcon className="h-4 w-4" />
            ) : (
              <PauseIcon className="h-4 w-4" />
            )}
          </Button>
          <Button variant="secondary" size="icon" onClick={resetTimer}>
            <RotateCcwIcon className="h-4 w-4" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setHideCountdown(!hideCountdown)}
                >
                  {hideCountdown ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hideCountdown ? "Show countdown" : "Hide countdown"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="secondary" size="icon" onClick={handleStopSpeech}>
            <Square className="h-4 w-4 fill-current" />
          </Button>
        </div>
      </motion.div>
    </>
  );
}
