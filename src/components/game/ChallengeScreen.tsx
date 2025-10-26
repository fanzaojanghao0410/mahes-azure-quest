import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Question } from '@/types/game';
import { Clock, Lightbulb, AlertCircle } from 'lucide-react';

interface ChallengeScreenProps {
  question: Question;
  onAnswer: (optionId: string) => void;
  onUseHint: () => void;
  hintsAvailable: number;
}

export const ChallengeScreen = ({
  question,
  onAnswer,
  onUseHint,
  hintsAvailable
}: ChallengeScreenProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    if (question.timeLimit === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question.timeLimit]);

  const handleUseHint = () => {
    if (hintsAvailable > 0 && question.hints.length > 0) {
      setShowHint(true);
      setHintIndex((prev) => Math.min(prev + 1, question.hints.length - 1));
      onUseHint();
    }
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
    }
  };

  const timePercent = question.timeLimit > 0 ? (timeLeft / question.timeLimit) * 100 : 100;

  return (
    <div className="min-h-screen gradient-hero py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-morphism rounded-3xl p-6 md:p-10 shadow-lg scale-in">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold">
                  {question.type === 'puzzle' && '🧩 Puzzle'}
                  {question.type === 'moral' && '⚖️ Moral'}
                  {question.type === 'trivia' && '📚 Trivia'}
                  {question.type === 'event' && '🎭 Event'}
                </span>
                <span className="px-3 py-1 bg-gold/20 text-gold-foreground rounded-full text-sm font-bold">
                  Level {question.difficulty}
                </span>
              </div>

              {question.timeLimit > 0 && (
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5" />
                  <span className={`font-bold ${timeLeft < 10 ? 'text-destructive animate-pulse' : ''}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {question.timeLimit > 0 && (
              <Progress value={timePercent} className="h-2" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            {question.title}
          </h2>

          {/* Scenario */}
          {question.scenario && (
            <div className="mb-6 p-4 bg-card rounded-xl border-l-4 border-primary">
              <p className="text-foreground/90 leading-relaxed">{question.scenario}</p>
            </div>
          )}

          {/* Question */}
          <div className="mb-8">
            <p className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              {question.question}
            </p>
          </div>

          {/* Hint */}
          {showHint && question.hints.length > 0 && (
            <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-xl flex items-start gap-3 fade-in">
              <Lightbulb className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
              <p className="text-foreground">{question.hints[hintIndex]}</p>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`w-full p-4 md:p-5 text-left rounded-xl border-2 transition-all duration-300 ${
                  selectedOption === option.id
                    ? 'border-primary bg-primary/20 scale-[1.02] shadow-glow'
                    : 'border-border hover:border-primary/50 hover:bg-card/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedOption === option.id
                      ? 'border-primary bg-primary'
                      : 'border-border'
                  }`}>
                    {selectedOption === option.id && (
                      <div className="w-3 h-3 bg-primary-foreground rounded-full" />
                    )}
                  </div>
                  <span className="text-base md:text-lg font-medium text-foreground">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption}
              size="lg"
              className="flex-1 text-lg py-6 rounded-xl shadow-lg hover:shadow-glow bg-primary text-primary-foreground disabled:opacity-50"
            >
              Jawab
            </Button>

            {question.hints.length > 0 && (
              <Button
                onClick={handleUseHint}
                disabled={hintsAvailable === 0 || hintIndex >= question.hints.length - 1}
                variant="outline"
                size="lg"
                className="sm:w-auto text-lg py-6 rounded-xl border-2 border-gold/50 hover:border-gold hover:bg-gold/10"
              >
                <Lightbulb className="mr-2 w-5 h-5" />
                Petunjuk ({hintsAvailable})
              </Button>
            )}
          </div>

          {timeLeft === 0 && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-destructive font-medium">Waktu habis! Pilih jawaban dengan bijak.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
