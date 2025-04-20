import { motion } from "framer-motion";
import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BoltIcon, FileTextIcon, StarHalfIcon } from "lucide-react";
import { SpeechType } from "@/lib/constants";

interface SpeechTypeSelectorProps {
  selectedType: SpeechType;
  onTypeChange: (type: SpeechType) => void;
}

export default function SpeechTypeSelector({
  selectedType,
  onTypeChange,
}: SpeechTypeSelectorProps) {
  const handleTypeChange = useCallback((value: string) => {
    onTypeChange(value as SpeechType);
  }, [onTypeChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-surface border-gray-700">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Select Speech Type</h2>
          <RadioGroup
            value={selectedType}
            onValueChange={handleTypeChange}
            className="flex flex-wrap gap-3"
          >
            <div className="speech-type-option">
              <RadioGroupItem
                value={SpeechType.IMPROMPTU}
                id="impromptu"
                className="sr-only"
              />
              <Label
                htmlFor="impromptu"
                className={`px-5 py-3 border border-gray-700 rounded-full cursor-pointer flex items-center transition-all ${
                  selectedType === SpeechType.IMPROMPTU ? "bg-primary text-black" : "bg-surface"
                }`}
              >
                <BoltIcon className="mr-2 h-4 w-4" />
                Impromptu (2.5 min)
              </Label>
            </div>

            <div className="speech-type-option">
              <RadioGroupItem
                value={SpeechType.PREPARED}
                id="prepared"
                className="sr-only"
              />
              <Label
                htmlFor="prepared"
                className={`px-5 py-3 border border-gray-700 rounded-full cursor-pointer flex items-center transition-all ${
                  selectedType === SpeechType.PREPARED ? "bg-primary text-black" : "bg-surface"
                }`}
              >
                <FileTextIcon className="mr-2 h-4 w-4" />
                Prepared (7 min)
              </Label>
            </div>

            <div className="speech-type-option">
              <RadioGroupItem
                value={SpeechType.EVALUATIVE}
                id="evaluative"
                className="sr-only"
              />
              <Label
                htmlFor="evaluative"
                className={`px-5 py-3 border border-gray-700 rounded-full cursor-pointer flex items-center transition-all ${
                  selectedType === SpeechType.EVALUATIVE ? "bg-primary text-black" : "bg-surface"
                }`}
              >
                <StarHalfIcon className="mr-2 h-4 w-4" />
                Evaluative (2.5 min)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
}
