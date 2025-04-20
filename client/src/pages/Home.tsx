import { useState, useCallback } from "react";
import { Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeechTypeSelector from "@/components/SpeechTypeSelector";
import TopicGenerator from "@/components/TopicGenerator";
import Timer from "@/components/Timer";
import CompletionModal from "@/components/CompletionModal";
import { SpeechType } from "@/lib/constants";

export default function Home() {
  const [speechType, setSpeechType] = useState<SpeechType>(SpeechType.IMPROMPTU);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showTopicGenerator, setShowTopicGenerator] = useState(true);
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSpeechTypeChange = useCallback((type: SpeechType) => {
    setSpeechType(type);
    setShowTopicGenerator(type === SpeechType.IMPROMPTU);
  }, []);

  const handleTopicSelect = useCallback((topic: string) => {
    setSelectedTopic(topic);
  }, []);

  const handleStartSpeech = useCallback(() => {
    if (speechType === SpeechType.IMPROMPTU && !selectedTopic) {
      return; // Don't start if no topic is selected for impromptu
    }
    setIsSpeechActive(true);
  }, [speechType, selectedTopic]);

  const handleStopSpeech = useCallback(() => {
    setIsSpeechActive(false);
  }, []);

  const handleSpeechComplete = useCallback(() => {
    setIsCompletionModalOpen(true);
  }, []);

  const handleCloseCompletionModal = useCallback(() => {
    setIsCompletionModalOpen(false);
    setIsSpeechActive(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
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
      <div className="max-w-3xl w-full relative">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
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
              Oratio
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen}
            className="text-foreground"
          >
            <Expand className="h-5 w-5" />
          </Button>
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
                isSpeechActive={false}
              />
            </div>
          ) : (
            <div className="animate-scale-in flex flex-col items-center justify-center">
              {speechType === SpeechType.IMPROMPTU && selectedTopic && (
                <div className="mb-8 text-center">
                  <h3 className="text-lg text-muted-foreground mb-2">Your Topic</h3>
                  <p className="text-2xl font-medium">{selectedTopic}</p>
                </div>
              )}
              
              <Timer 
                speechType={speechType} 
                onStopSpeech={handleStopSpeech}
                onSpeechComplete={handleSpeechComplete}
                isSpeechActive={true}
              />
            </div>
          )}
          
          <CompletionModal 
            isOpen={isCompletionModalOpen} 
            onClose={handleCloseCompletionModal} 
          />
        </main>
      </div>
    </div>
  );
}
