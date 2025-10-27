import { useState, useEffect } from 'react';
import { Question, QuestionOption } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DialogUIProps {
  npcName: string;
  question: Question;
  onAnswer: (option: QuestionOption) => void;
  onClose: () => void;
}

export const DialogUI = ({ npcName, question, onAnswer, onClose }: DialogUIProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const fullText = question.scenario || question.question;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setShowOptions(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center p-4 pointer-events-auto">
      <Card className="w-full max-w-3xl bg-background/95 backdrop-blur-md border-2 border-primary/20 p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-primary mb-2">{npcName}</h3>
          <div className="min-h-[100px] text-foreground whitespace-pre-wrap">
            {displayedText}
            {!showOptions && <span className="animate-pulse">▊</span>}
          </div>
        </div>

        {showOptions && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground mb-3">
              {question.question}
            </h4>
            {question.options.map((option) => (
              <Button
                key={option.id}
                onClick={() => onAnswer(option)}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4 px-6 hover:bg-primary/10 hover:border-primary transition-all"
              >
                {option.text}
              </Button>
            ))}
          </div>
        )}

        <Button
          onClick={onClose}
          variant="ghost"
          className="mt-4 w-full"
          size="sm"
        >
          Tutup [ESC]
        </Button>
      </Card>
    </div>
  );
};
