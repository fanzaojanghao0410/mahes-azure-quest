import { Question } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DialogUIProps {
  npcName: string;
  text: string;
  question?: Question;
  onClose: () => void;
  onAnswerSelected?: (optionId: string) => void;
}

export const DialogUI = ({ npcName, text, question, onClose, onAnswerSelected }: DialogUIProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 p-6 bg-white/95 shadow-elegant animate-scale-in">
        {/* NPC Name */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-accent-secondary">{npcName}</h3>
        </div>

        {/* Dialog Text */}
        <div className="mb-6 p-4 bg-bg-secondary rounded-lg">
          <p className="text-text-primary text-lg leading-relaxed">{text}</p>
        </div>

        {/* Question Options */}
        {question && onAnswerSelected ? (
          <div className="space-y-3">
            <h4 className="font-semibold text-text-primary mb-3">{question.question}</h4>
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => onAnswerSelected(option.id)}
                className="w-full p-4 text-left rounded-lg border-2 border-accent-primary/20 hover:border-accent-primary hover:bg-accent-primary/10 transition-all duration-200 hover:scale-[1.02]"
              >
                <p className="text-text-primary font-medium">{option.text}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex justify-end">
            <Button onClick={onClose} className="bg-accent-primary hover:bg-accent-tertiary">
              Tutup
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
