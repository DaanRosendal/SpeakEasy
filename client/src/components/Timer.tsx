import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlayIcon, PauseIcon, StopCircleIcon, RotateCcwIcon } from "lucide-react";
import { SpeechType, DEFAULT_TIMES } from "@/lib/constants";
import useCountdownTimer from "@/hooks/useCountdownTimer";

interface TimerProps {
  speechType: SpeechType;
  onStartSpeech?: () => void;
  onStopSpeech?: () => void;
  onSpeechComplete?: () => void;
  isSpeechActive: boolean;
}

export default function Timer({
  speechType,
  onStartSpeech,
  onStopSpeech,
  onSpeechComplete,
  isSpeechActive
}: TimerProps) {
  const {
    minutes,
    seconds,
    isRunning,
    isPaused,
    hideCountdown,
    timerColor,
    timeAlert,
    progress,
    setMinutes,
    setSeconds,
    setHideCountdown,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopTimer
  } = useCountdownTimer(speechType, onSpeechComplete);

  useEffect(() => {
    // Update timer defaults when speech type changes
    const defaultTimes = DEFAULT_TIMES[speechType];
    setMinutes(defaultTimes.minutes);
    setSeconds(defaultTimes.seconds);
  }, [speechType, setMinutes, setSeconds]);

  const handleStartSpeech = () => {
    startTimer();
    if (onStartSpeech) onStartSpeech();
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
        <Card className="bg-surface border-gray-700">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Timer Settings</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="minutes-input" className="block mb-2 text-sm font-medium">
                  Minutes
                </Label>
                <Input
                  id="minutes-input"
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  min={0}
                  max={60}
                  className="bg-surface border-gray-700"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="seconds-input" className="block mb-2 text-sm font-medium">
                  Seconds
                </Label>
                <Input
                  id="seconds-input"
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  min={0}
                  max={59}
                  className="bg-surface border-gray-700"
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
              
              <Button onClick={handleStartSpeech} className="px-6">
                <PlayIcon className="mr-2 h-4 w-4" />
                Start Speech
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative h-64 w-64 flex items-center justify-center">
        <svg className="absolute" width="240" height="240">
          <circle cx="120" cy="120" r="110" fill="none" stroke="#333333" strokeWidth="8" />
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="none"
            stroke={timerColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="691"
            strokeDashoffset={`${691 - (691 * (isNaN(progress) ? 1 : progress))}`}
            className="transition-all duration-1000"
          />
        </svg>
        
        <div className="flex flex-col items-center justify-center">
          <div className={`font-mono text-5xl font-semibold transition-opacity duration-300 ${hideCountdown && isRunning ? "opacity-0" : "opacity-100"}`}>
            {`${minutes}:${seconds.toString().padStart(2, '0')}`}
          </div>
          <AnimatePresence>
            {timeAlert && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center mt-2"
              >
                <p 
                  className={`text-lg font-medium ${
                    timerColor === "#4CAF50" ? "text-[#4CAF50]" : 
                    timerColor === "#FF9800" ? "text-[#FF9800]" : 
                    timerColor === "#F44336" ? "text-[#F44336]" : ""
                  }`}
                >
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
          className={isRunning ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-800 opacity-50"}
        >
          {isPaused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={resetTimer}
        >
          <RotateCcwIcon className="h-4 w-4" />
        </Button>
        <Button 
          variant="default" 
          size="icon" 
          onClick={handleStopSpeech}
        >
          <StopCircleIcon className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
