import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { RotateCcwIcon, HomeIcon } from "lucide-react";
import { SpeechType } from "@/lib/constants";

interface SpeechCompletionScreenProps {
  speechType: SpeechType;
  selectedTopic: string | null;
  onNewSpeech: () => void;
  onRepeatSpeech: () => void;
}

export default function SpeechCompletionScreen({
  speechType,
  selectedTopic,
  onNewSpeech,
  onRepeatSpeech,
}: SpeechCompletionScreenProps) {
  return (
    <div className="h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-2xl w-full max-h-full overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card border-border border-2">
            <CardContent className="pt-8 pb-8 text-center">
              {/* Success Icon */}
              <div className="text-6xl mb-4">🎉</div>

              {/* Congratulations Message */}
              <h1 className="text-3xl font-bold text-primary mb-3">
                Well Done!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                You've completed your {speechType} speech successfully.
              </p>

              {/* Show topic if it was an impromptu speech */}
              {speechType === SpeechType.IMPROMPTU && selectedTopic && (
                <div className="bg-muted rounded-lg p-3 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">
                    Your topic was:
                  </p>
                  <p className="text-base font-medium text-primary">
                    "{selectedTopic}"
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={onRepeatSpeech}
                  variant="outline"
                  className="flex items-center"
                >
                  <RotateCcwIcon className="mr-2 h-4 w-4" />
                  Practice Again
                </Button>
                <Button onClick={onNewSpeech} className="flex items-center">
                  <HomeIcon className="mr-2 h-4 w-4" />
                  New Speech
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
