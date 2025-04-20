import { useState, useEffect, useCallback, useRef } from "react";
import { SpeechType } from "@/lib/constants";

export default function useSpeechTimer(
  speechType: SpeechType,
  onComplete?: () => void
) {
  // Default times based on speech type
  const getDefaultMinutes = useCallback(() => {
    switch (speechType) {
      case SpeechType.IMPROMPTU:
      case SpeechType.EVALUATIVE:
        return 2;
      case SpeechType.PREPARED:
        return 7;
      default:
        return 2;
    }
  }, [speechType]);

  const getDefaultSeconds = useCallback(() => {
    switch (speechType) {
      case SpeechType.IMPROMPTU:
      case SpeechType.EVALUATIVE:
        return 30;
      default:
        return 0;
    }
  }, [speechType]);

  const [minutes, setMinutes] = useState(getDefaultMinutes());
  const [seconds, setSeconds] = useState(getDefaultSeconds());
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hideCountdown, setHideCountdown] = useState(false);
  const [timerColor, setTimerColor] = useState("#FFFFFF");
  const [timeAlert, setTimeAlert] = useState<string | null>(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [progress, setProgress] = useState(1);
  
  const timerRef = useRef<number | null>(null);
  const alertTimeoutRef = useRef<number | null>(null);

  // Calculate total and remaining seconds when minutes or seconds change
  useEffect(() => {
    const total = (minutes * 60) + seconds;
    setTotalSeconds(total);
    setRemainingSeconds(total);
  }, [minutes, seconds]);

  // Update progress when remaining seconds change
  useEffect(() => {
    setProgress(remainingSeconds / totalSeconds);
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

  // Show time alert for a few seconds
  const showTimeAlert = useCallback((message: string) => {
    setTimeAlert(message);
    
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    
    alertTimeoutRef.current = window.setTimeout(() => {
      setTimeAlert(null);
      alertTimeoutRef.current = null;
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

  // Start the timer
  const startTimer = useCallback(() => {
    if (isRunning) return;
    
    // Reset to initial values
    const totalSecondsValue = (minutes * 60) + seconds;
    setTotalSeconds(totalSecondsValue);
    setRemainingSeconds(totalSecondsValue);
    setProgress(1);
    setTimerColor("#FFFFFF");
    
    setIsRunning(true);
    setIsPaused(false);
    
    timerRef.current = window.setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          // Timer complete
          clearInterval(timerRef.current!);
          setIsRunning(false);
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
    }, 1000);
  }, [isRunning, minutes, seconds, showTimeAlert, onComplete]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (!isRunning || isPaused) return;
    
    clearInterval(timerRef.current!);
    setIsPaused(true);
  }, [isRunning, isPaused]);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    if (!isRunning || !isPaused) return;
    
    setIsPaused(false);
    
    timerRef.current = window.setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          showTimeAlert("Time's up!");
          
          if (onComplete) {
            setTimeout(onComplete, 1000);
          }
          
          return 0;
        }
        
        const newValue = prev - 1;
        
        if (newValue === 60) {
          showTimeAlert("1 minute remaining");
        } else if (newValue === 30) {
          showTimeAlert("30 seconds remaining");
        }
        
        setMinutes(Math.floor(newValue / 60));
        setSeconds(newValue % 60);
        
        return newValue;
      });
    }, 1000);
  }, [isRunning, isPaused, showTimeAlert, onComplete]);

  // Reset the timer to initial state but keep it running
  const resetTimer = useCallback(() => {
    // Clear existing interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Reset to defaults based on speech type
    const mins = getDefaultMinutes();
    const secs = getDefaultSeconds();
    setMinutes(mins);
    setSeconds(secs);
    
    const totalSecondsValue = (mins * 60) + secs;
    setTotalSeconds(totalSecondsValue);
    setRemainingSeconds(totalSecondsValue);
    setProgress(1);
    setTimerColor("#FFFFFF");
    
    // If timer was running, restart it
    if (isRunning) {
      startTimer();
    }
  }, [getDefaultMinutes, getDefaultSeconds, isRunning, startTimer]);

  // Stop the timer completely
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRunning(false);
    setIsPaused(false);
    
    // Reset to defaults
    const mins = getDefaultMinutes();
    const secs = getDefaultSeconds();
    setMinutes(mins);
    setSeconds(secs);
    
    const totalSecondsValue = (mins * 60) + secs;
    setTotalSeconds(totalSecondsValue);
    setRemainingSeconds(totalSecondsValue);
    setProgress(1);
    setTimerColor("#FFFFFF");
  }, [getDefaultMinutes, getDefaultSeconds]);

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
