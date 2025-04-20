import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompletionModal({ isOpen, onClose }: CompletionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gray-700 p-8 max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Well done!</h2>
          <p className="mb-6">You've completed your speech successfully.</p>
          <Button onClick={onClose} className="px-6">
            Close
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
