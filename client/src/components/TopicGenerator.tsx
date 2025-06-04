import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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

interface TopicGeneratorProps {
  onTopicSelect: (topic: string) => void;
  selectedTopic: string | null;
}

interface Theme {
  id: string;
  name: string;
}

const themes: Theme[] = [
  { id: "business", name: "Business & Leadership" },
  { id: "technology", name: "Technology & Innovation" },
  { id: "social", name: "Social Issues" },
  { id: "philosophy", name: "Philosophy & Ethics" },
  { id: "environment", name: "Environment & Sustainability" },
];

export default function TopicGenerator({
  onTopicSelect,
  selectedTopic,
}: TopicGeneratorProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>("technology");
  const [showTopics, setShowTopics] = useState(false);

  const {
    data: topics = [],
    refetch,
    isLoading,
  } = useQuery<string[]>({
    queryKey: [`/api/topics/${selectedTheme}`],
    enabled: false,
  });

  const handleThemeChange = useCallback((value: string) => {
    setSelectedTheme(value);
    setShowTopics(false);
  }, []);

  const handleGenerateTopics = useCallback(() => {
    refetch().then(() => setShowTopics(true));
  }, [refetch]);

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
      <Card className="bg-surface border-gray-700">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Topic Generator</h2>

          <div className="mb-4">
            <Label
              htmlFor="theme-selector"
              className="block mb-2 text-sm font-medium"
            >
              Select Theme
            </Label>
            <Select value={selectedTheme} onValueChange={handleThemeChange}>
              <SelectTrigger
                id="theme-selector"
                className="w-full bg-surface border-gray-700"
              >
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
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

          {showTopics && topics.length > 0 && (
            <div className="mt-4">
              <p className="text-sm mb-2">
                Select a topic for your impromptu speech:
              </p>
              <div className="space-y-2">
                {topics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`p-3 border border-gray-700 rounded-md cursor-pointer transition-all hover:bg-primary/10 ${
                      selectedTopic === topic
                        ? "bg-primary/20 border-primary"
                        : ""
                    }`}
                    onClick={() => handleTopicClick(topic)}
                  >
                    <p>{topic}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
