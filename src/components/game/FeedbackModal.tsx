import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

interface FeedbackModalProps {
  isCorrect: boolean;
  feedback: string;
  rewards: {
    score: number;
    karma: number;
    item?: string;
  };
  onContinue: () => void;
}

export const FeedbackModal = ({
  isCorrect,
  feedback,
  rewards,
  onContinue
}: FeedbackModalProps) => {
  const { width, height } = useWindowSize();
  const hasFragmentReward = rewards.item?.includes('fragment');

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {hasFragmentReward && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          colors={['#67c7ff', '#ffd166', '#4ecdc4', '#ffffff']}
        />
      )}
      
      <div className="glass-morphism rounded-3xl p-8 md:p-12 max-w-2xl w-full scale-in shadow-glow">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {isCorrect ? (
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center shadow-glow">
              <CheckCircle2 className="w-12 h-12 text-success-foreground" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          {isCorrect ? '✨ Luar Biasa!' : '💭 Hampir Benar!'}
        </h2>

        {/* Feedback */}
        <p className="text-lg text-center text-foreground/90 mb-8 leading-relaxed">
          {feedback}
        </p>

        {/* Rewards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {rewards.score !== 0 && (
            <div className="glass-morphism rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className={`text-2xl font-bold ${rewards.score > 0 ? 'text-gold' : 'text-destructive'}`}>
                {rewards.score > 0 ? '+' : ''}{rewards.score}
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          )}

          {rewards.karma !== 0 && (
            <div className="glass-morphism rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">❤️</div>
              <div className={`text-2xl font-bold ${rewards.karma > 0 ? 'text-success' : 'text-destructive'}`}>
                {rewards.karma > 0 ? '+' : ''}{rewards.karma}
              </div>
              <div className="text-sm text-muted-foreground">Karma</div>
            </div>
          )}

          {rewards.item && (
            <div className="glass-morphism rounded-xl p-4 text-center col-span-2 md:col-span-1">
              <div className="text-3xl mb-2">
                {rewards.item.includes('crown') && '👑'}
                {rewards.item.includes('sash') && '🎗️'}
                {rewards.item === 'hint' && '💡'}
              </div>
              <div className="text-xl font-bold text-primary">
                {rewards.item.includes('fragment') && 'Fragmen!'}
                {rewards.item === 'hint' && 'Petunjuk!'}
              </div>
              <div className="text-sm text-muted-foreground">
                {rewards.item.includes('crown') && 'Mahkota'}
                {rewards.item.includes('sash') && 'Selempang'}
                {rewards.item === 'hint' && 'Bonus'}
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          size="lg"
          className="w-full text-lg py-6 rounded-xl shadow-lg hover:shadow-glow bg-primary text-primary-foreground"
        >
          Lanjutkan Petualangan
        </Button>
      </div>
    </div>
  );
};
