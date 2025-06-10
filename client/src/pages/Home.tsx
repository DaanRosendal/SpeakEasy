import { useState, useCallback } from "react";
import { Expand, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeechTypeSelector from "@/components/SpeechTypeSelector";
import TopicGenerator from "@/components/TopicGenerator";
import Timer from "@/components/Timer";
import SpeechCompletionScreen from "@/components/CompletionModal";
import { SpeechType } from "@/lib/constants";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const [speechType, setSpeechType] = useState<SpeechType>(
    SpeechType.IMPROMPTU
  );
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showTopicGenerator, setShowTopicGenerator] = useState(true);
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [isSpeechCompleted, setIsSpeechCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hideCountdown, setHideCountdown] = useState(false);
  const [customMinutes, setCustomMinutes] = useState<number | null>(null);
  const [customSeconds, setCustomSeconds] = useState<number | null>(null);

  const { toggleTheme, isDark } = useTheme();

  const handleSpeechTypeChange = useCallback((type: SpeechType) => {
    setSpeechType(type);
    setShowTopicGenerator(type === SpeechType.IMPROMPTU);
    setSelectedTopic(null);
    setCustomMinutes(null);
    setCustomSeconds(null);
  }, []);

  const handleTopicSelect = useCallback((topic: string | null) => {
    setSelectedTopic(topic);
  }, []);

  const handleStartSpeech = useCallback(() => {
    if (speechType === SpeechType.IMPROMPTU && !selectedTopic) {
      return; // Don't start if no topic is selected for impromptu
    }
    setIsSpeechActive(true);
  }, [speechType, selectedTopic]);

  const handleSpeechComplete = useCallback(() => {
    // Stop the speech and show completion screen
    setIsSpeechActive(false);
    setIsSpeechCompleted(true);
  }, []);

  const handleNewSpeech = useCallback(() => {
    setIsSpeechCompleted(false);
    // Reset to initial state for a new speech
    setSelectedTopic(null);
    setHideCountdown(false);
  }, []);

  const handleRepeatSpeech = useCallback(() => {
    setIsSpeechCompleted(false);
    // Keep all current settings and start the same speech again
    setIsSpeechActive(true);
  }, []);

  const handleStopSpeech = useCallback(() => {
    setIsSpeechActive(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {isSpeechCompleted ? (
        <SpeechCompletionScreen
          speechType={speechType}
          selectedTopic={selectedTopic}
          onNewSpeech={handleNewSpeech}
          onRepeatSpeech={handleRepeatSpeech}
        />
      ) : (
        <div className="max-w-3xl w-full relative">
          {/* Header */}
          <header className="flex justify-between items-center mb-6 relative z-20">
            <div className="flex items-center">
              <h1 className="text-3xl font-semibold text-primary">
                <svg
                  className="inline-block mr-2 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                </svg>
                SpeakEasy
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-foreground relative z-20"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-foreground relative z-20"
              >
                <Expand className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main>
            {!isSpeechActive ? (
              <div className="animate-fade-in space-y-6">
                <SpeechTypeSelector
                  selectedType={speechType}
                  onTypeChange={handleSpeechTypeChange}
                />

                {showTopicGenerator && (
                  <TopicGenerator
                    onTopicSelect={handleTopicSelect}
                    selectedTopic={selectedTopic}
                  />
                )}

                <Timer
                  speechType={speechType}
                  onStartSpeech={handleStartSpeech}
                  onStopSpeech={handleStopSpeech}
                  onSpeechComplete={handleSpeechComplete}
                  isSpeechActive={isSpeechActive}
                  hideCountdown={hideCountdown}
                  setHideCountdown={setHideCountdown}
                  selectedTopic={selectedTopic}
                  customMinutes={customMinutes}
                  customSeconds={customSeconds}
                  setCustomMinutes={setCustomMinutes}
                  setCustomSeconds={setCustomSeconds}
                />
              </div>
            ) : (
              <div className="animate-scale-in flex flex-col items-center justify-center">
                {speechType === SpeechType.IMPROMPTU && selectedTopic && (
                  <div className="mb-8 text-center">
                    <h3 className="text-lg text-muted-foreground mb-2">
                      Your Topic
                    </h3>
                    <p className="text-2xl font-medium">{selectedTopic}</p>
                  </div>
                )}

                <Timer
                  speechType={speechType}
                  onStartSpeech={handleStartSpeech}
                  onStopSpeech={handleStopSpeech}
                  onSpeechComplete={handleSpeechComplete}
                  isSpeechActive={isSpeechActive}
                  hideCountdown={hideCountdown}
                  setHideCountdown={setHideCountdown}
                  selectedTopic={selectedTopic}
                  customMinutes={customMinutes}
                  customSeconds={customSeconds}
                  setCustomMinutes={setCustomMinutes}
                  setCustomSeconds={setCustomSeconds}
                />
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
