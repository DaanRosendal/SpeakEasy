import { useState, useEffect, useCallback, useRef } from "react";
import { SpeechType, DEFAULT_TIMES } from "@/lib/constants";

const useSpeechTimer = (
  speechType: SpeechType,
  onComplete?: () => void
) => {
  // Default times based on speech type from constants
  const getDefaultTime = useCallback(() => {
    return DEFAULT_TIMES[speechType];
  }, [speechType]);

  const [minutes, setMinutes] = useState(getDefaultTime().minutes);
  const [seconds, setSeconds] = useState(getDefaultTime().seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hideCountdown, setHideCountdown] = useState(false);
  const [timerColor, setTimerColor] = useState("#FFFFFF");
  const [timeAlert, setTimeAlert] = useState<string | null>(null);
  const [totalSeconds, setTotalSeconds] = useState(getDefaultTime().minutes * 60 + getDefaultTime().seconds);
  const [remainingSeconds, setRemainingSeconds] = useState(getDefaultTime().minutes * 60 + getDefaultTime().seconds);
  const [progress, setProgress] = useState(1);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total seconds when minutes or seconds change in settings
  useEffect(() => {
    if (!isRunning && !isPaused) {
      const total = (minutes * 60) + seconds;
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setProgress(1);
    }
  }, [minutes, seconds, isRunning, isPaused]);

  // Update progress when remaining seconds change
  useEffect(() => {
    if (totalSeconds > 0) {
      setProgress(remainingSeconds / totalSeconds);
    } else {
      setProgress(1);
    }
  }, [remainingSeconds, totalSeconds]);

  // Clean up intervals and timeouts on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  // Update default times when speech type changes
  useEffect(() => {
    if (!isRunning && !isPaused) {
      const defaultTime = getDefaultTime();
      setMinutes(defaultTime.minutes);
      setSeconds(defaultTime.seconds);
      setTotalSeconds(defaultTime.minutes * 60 + defaultTime.seconds);
      setRemainingSeconds(defaultTime.minutes * 60 + defaultTime.seconds);
    }
  }, [speechType, getDefaultTime, isRunning, isPaused]);

  // Show time alert for a few seconds
  const showTimeAlert = useCallback((message: string) => {
    setTimeAlert(message);
    
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    
    alertTimeoutRef.current = setTimeout(() => {
      setTimeAlert(null);
    }, 3000);
  }, []);

  // Update timer color based on remaining time
  useEffect(() => {
    if (remainingSeconds <= 0) {
      setTimerColor("#F44336"); // Red - time's up
    } else if (remainingSeconds <= 30) {
      setTimerColor("#FF9800"); // Orange - 30 seconds left
    } else if (remainingSeconds <= 60) {
      setTimerColor("#4CAF50"); // Green - 1 minute left
    } else {
      setTimerColor("#FFFFFF"); // White - default
    }
  }, [remainingSeconds]);

  // Create timer tick function
  const timerTick = useCallback(() => {
    setRemainingSeconds(prev => {
      if (prev <= 1) {
        // Timer complete
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRunning(false);
        setIsPaused(false);
        showTimeAlert("Time's up!");
        
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
        
        return 0;
      }
      
      const newValue = prev - 1;
      
      // Show alerts at specific times
      if (newValue === 60) {
        showTimeAlert("1 minute remaining");
      } else if (newValue === 30) {
        showTimeAlert("30 seconds remaining");
      }
      
      // Update display time
      setMinutes(Math.floor(newValue / 60));
      setSeconds(newValue % 60);
      
      return newValue;
    });
  }, [onComplete, showTimeAlert]);

  // Start the timer
  const startTimer = useCallback(() => {
    if (isRunning) return;
    
    // Calculate total seconds from current minutes and seconds
    const totalSecondsValue = (minutes * 60) + seconds;
    setTotalSeconds(totalSecondsValue);
    setRemainingSeconds(totalSecondsValue);
    setProgress(1);
    setTimerColor("#FFFFFF");
    
    setIsRunning(true);
    setIsPaused(false);
    
    // Clear any existing timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer
    timerRef.current = setInterval(timerTick, 1000);
  }, [minutes, seconds, isRunning, timerTick]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (!isRunning || isPaused) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsPaused(true);
  }, [isRunning, isPaused]);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    if (!isRunning || !isPaused) return;
    
    setIsPaused(false);
    
    // Clear any existing interval just in case
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer
    timerRef.current = setInterval(timerTick, 1000);
  }, [isRunning, isPaused, timerTick]);

  // Reset the timer to initial state
  const resetTimer = useCallback(() => {
    // Clear existing interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset to defaults based on speech type
    const defaultTime = getDefaultTime();
    const mins = defaultTime.minutes;
    const secs = defaultTime.seconds;
    
    setMinutes(mins);
    setSeconds(secs);
    
    const totalSecondsValue = (mins * 60) + secs;
    setTotalSeconds(totalSecondsValue);
    setRemainingSeconds(totalSecondsValue);
    setProgress(1);
    setTimerColor("#FFFFFF");
    
    // If timer was running, restart it
    if (isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      timerRef.current = setInterval(timerTick, 1000);
    }
  }, [getDefaultTime, isRunning, timerTick]);

  // Stop the timer completely
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRunning(false);
    setIsPaused(false);
    
    // Reset to defaults
    const defaultTime = getDefaultTime();
    const mins = defaultTime.minutes;
    const secs = defaultTime.seconds;
    
    setMinutes(mins);
    setSeconds(secs);
    
    const totalSecondsValue = (mins * 60) + secs;
    setTotalSeconds(totalSecondsValue);
    setRemainingSeconds(totalSecondsValue);
    setProgress(1);
    setTimerColor("#FFFFFF");
  }, [getDefaultTime, timerTick]);

  return {
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
  };
}

export default useSpeechTimer;
