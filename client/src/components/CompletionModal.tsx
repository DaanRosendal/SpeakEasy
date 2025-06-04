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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-surface border-gray-700">
            <CardContent className="pt-12 pb-12 text-center">
              {/* Success Icon */}
              <div className="text-8xl mb-6">🎉</div>

              {/* Congratulations Message */}
              <h1 className="text-4xl font-bold text-primary mb-4">
                Well Done!
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                You've completed your {speechType} speech successfully.
              </p>

              {/* Show topic if it was an impromptu speech */}
              {speechType === SpeechType.IMPROMPTU && selectedTopic && (
                <div className="bg-gray-800 rounded-lg p-4 mb-8">
                  <p className="text-sm text-muted-foreground mb-1">
                    Your topic was:
                  </p>
                  <p className="text-lg font-medium text-primary">
                    "{selectedTopic}"
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={onRepeatSpeech}
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  <RotateCcwIcon className="mr-3 h-5 w-5" />
                  Repeat Speech
                </Button>

                <Button
                  onClick={onNewSpeech}
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  <HomeIcon className="mr-3 h-5 w-5" />
                  New Speech
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                Choose "Repeat Speech" to practice the same speech again, or
                "New Speech" to start fresh.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
