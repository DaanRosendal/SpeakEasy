import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shuffle } from "lucide-react";
import { THEMES } from "@/lib/constants";
import { getRandomTopics, type Theme } from "@/data/topics";

interface TopicGeneratorProps {
  onTopicSelect: (topic: string | null) => void;
  selectedTopic: string | null;
}

export default function TopicGenerator({
  onTopicSelect,
  selectedTopic,
}: TopicGeneratorProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>("technology");
  const [topics, setTopics] = useState<string[]>([]);
  const [showTopics, setShowTopics] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleThemeChange = useCallback((value: string) => {
    setSelectedTheme(value);
    setShowTopics(false);
    setTopics([]);
    setAnimationKey((prev) => prev + 1);
  }, []);

  const handleGenerateTopics = useCallback(() => {
    setIsLoading(true);

    // Clear the selected topic when generating new topics
    onTopicSelect(null);

    // Add a small delay to simulate loading for better UX
    setTimeout(() => {
      try {
        const newTopics = getRandomTopics(selectedTheme as Theme, 3);
        setTopics(newTopics);
        setShowTopics(true);

        // If topics are already showing, increment animation key for smooth transition
        if (showTopics) {
          setAnimationKey((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error generating topics:", error);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  }, [selectedTheme, showTopics, onTopicSelect]);

  const handleTopicClick = useCallback(
    (topic: string) => {
      onTopicSelect(topic);
    },
    [onTopicSelect]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="bg-card border-border border-2">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Topic Generator
          </h2>

          <div className="mb-4">
            <Label
              htmlFor="theme-selector"
              className="block mb-2 text-sm font-medium text-foreground"
            >
              Select Theme
            </Label>
            <Select value={selectedTheme} onValueChange={handleThemeChange}>
              <SelectTrigger
                id="theme-selector"
                className="w-full bg-background border-border text-foreground"
              >
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {THEMES.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerateTopics}
            className="w-full justify-center"
            disabled={isLoading}
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Generate Topics
          </Button>

          <AnimatePresence mode="wait">
            {showTopics && topics.length > 0 && (
              <motion.div
                key={animationKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <p className="text-sm mb-2">
                  Select a topic for your impromptu speech:
                </p>
                <div className="space-y-2">
                  {topics.map((topic, index) => (
                    <motion.div
                      key={`${animationKey}-${index}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.05,
                        exit: { delay: (topics.length - 1 - index) * 0.02 },
                      }}
                      className={`p-3 border-2 rounded-md cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${
                        selectedTopic === topic
                          ? "bg-primary/20 border-primary text-foreground"
                          : "border-border bg-card text-foreground"
                      }`}
                      onClick={() => handleTopicClick(topic)}
                    >
                      <p>{topic}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
