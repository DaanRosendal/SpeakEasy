import { useState, useEffect, useRef, useCallback } from 'react';
import { SpeechType, DEFAULT_TIMES } from '@/lib/constants';

export default function useCountdownTimer(speechType: SpeechType, onComplete?: () => void) {
  // State for timer
  const [minutes, setMinutes] = useState<number>(DEFAULT_TIMES[speechType].minutes);
  const [seconds, setSeconds] = useState<number>(DEFAULT_TIMES[speechType].seconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hideCountdown, setHideCountdown] = useState<boolean>(false);
  const [timeAlert, setTimeAlert] = useState<string | null>(null);
  const [timerColor, setTimerColor] = useState<string>('#FFFFFF');
  
  // Calculate total and remaining time
  const [totalTime, setTotalTime] = useState<number>(minutes * 60 + seconds);
  const [remainingTime, setRemainingTime] = useState<number>(minutes * 60 + seconds);
  const [progress, setProgress] = useState<number>(1);
  
  // Refs for interval and timeout
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const alertTimeout = useRef<NodeJS.Timeout | null>(null);

  // Update total and remaining time when minutes/seconds change in settings
  useEffect(() => {
    if (!isRunning && !isPaused) {
      const total = minutes * 60 + seconds;
      setTotalTime(total);
      setRemainingTime(total);
      setProgress(1);
    }
  }, [minutes, seconds, isRunning, isPaused]);
  
  // Update timer default values when speech type changes
  useEffect(() => {
    if (!isRunning && !isPaused) {
      const defaultTime = DEFAULT_TIMES[speechType];
      setMinutes(defaultTime.minutes);
      setSeconds(defaultTime.seconds);
    }
  }, [speechType, isRunning, isPaused]);

  // Update timer color based on remaining time
  useEffect(() => {
    if (remainingTime <= 0) {
      setTimerColor('#F44336'); // Red - time's up
    } else if (remainingTime <= 30) {
      setTimerColor('#FF9800'); // Orange - 30 seconds left
    } else if (remainingTime <= 60) {
      setTimerColor('#4CAF50'); // Green - 1 minute left
    } else {
      setTimerColor('#FFFFFF'); // White - default
    }
  }, [remainingTime]);

  // Update progress based on remaining time
  useEffect(() => {
    if (totalTime > 0) {
      setProgress(remainingTime / totalTime);
    } else {
      setProgress(1);
    }
  }, [remainingTime, totalTime]);

  // Clean up intervals and timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (alertTimeout.current) clearTimeout(alertTimeout.current);
    };
  }, []);

  // Show time alert for a few seconds
  const showAlert = useCallback((message: string) => {
    setTimeAlert(message);
    
    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }
    
    alertTimeout.current = setTimeout(() => {
      setTimeAlert(null);
    }, 3000);
  }, []);

  // Timer tick function for interval
  const timerTick = useCallback(() => {
    setRemainingTime((prevTime) => {
      // Handle timer completion
      if (prevTime <= 1) {
        if (timerInterval.current) {
          clearInterval(timerInterval.current);
          timerInterval.current = null;
        }
        
        setIsRunning(false);
        setIsPaused(false);
        showAlert("Time's up!");
        
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
        
        return 0;
      }
      
      // Calculate new remaining time
      const newRemainingTime = prevTime - 1;
      
      // Show alerts at specific times
      if (newRemainingTime === 60) {
        showAlert('1 minute remaining');
      } else if (newRemainingTime === 30) {
        showAlert('30 seconds remaining');
      }
      
      // Update minutes and seconds display
      setMinutes(Math.floor(newRemainingTime / 60));
      setSeconds(newRemainingTime % 60);
      
      return newRemainingTime;
    });
  }, [onComplete, showAlert]);

  // Start the timer
  const startTimer = useCallback(() => {
    if (isRunning) return;
    
    // Calculate and set initial times
    const total = minutes * 60 + seconds;
    setTotalTime(total);
    setRemainingTime(total); 
    setProgress(1);
    
    // Update timer state
    setIsRunning(true);
    setIsPaused(false);
    
    // Clear existing interval if any
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    
    // Start new interval
    timerInterval.current = setInterval(timerTick, 1000);
    
    // Log that timer started (for debugging)
    console.log('Timer started', { total });
  }, [minutes, seconds, isRunning, timerTick]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (!isRunning || isPaused) return;
    
    // Clear the interval
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    
    setIsPaused(true);
    console.log('Timer paused', { remainingTime });
  }, [isRunning, isPaused, remainingTime]);

  // Resume the timer after pause
  const resumeTimer = useCallback(() => {
    if (!isRunning || !isPaused) return;
    
    setIsPaused(false);
    
    // Clear any existing interval just in case
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    
    // Start new interval
    timerInterval.current = setInterval(timerTick, 1000);
    console.log('Timer resumed', { remainingTime });
  }, [isRunning, isPaused, timerTick, remainingTime]);

  // Reset the timer to initial values
  const resetTimer = useCallback(() => {
    // Clear the interval
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    
    // Get default times for current speech type
    const defaultTime = DEFAULT_TIMES[speechType];
    setMinutes(defaultTime.minutes);
    setSeconds(defaultTime.seconds);
    
    // Reset timer state
    const total = defaultTime.minutes * 60 + defaultTime.seconds;
    setTotalTime(total);
    setRemainingTime(total);
    setProgress(1);
    setTimerColor('#FFFFFF');
    
    // If timer was running, restart it
    if (isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      timerInterval.current = setInterval(timerTick, 1000);
    }
    
    console.log('Timer reset', { total });
  }, [speechType, isRunning, timerTick]);

  // Stop the timer completely
  const stopTimer = useCallback(() => {
    // Clear the interval
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    
    // Reset timer state
    setIsRunning(false);
    setIsPaused(false);
    
    // Reset to default values for current speech type
    const defaultTime = DEFAULT_TIMES[speechType];
    setMinutes(defaultTime.minutes);
    setSeconds(defaultTime.seconds);
    
    const total = defaultTime.minutes * 60 + defaultTime.seconds;
    setTotalTime(total);
    setRemainingTime(total);
    setProgress(1);
    setTimerColor('#FFFFFF');
    
    console.log('Timer stopped');
  }, [speechType]);

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