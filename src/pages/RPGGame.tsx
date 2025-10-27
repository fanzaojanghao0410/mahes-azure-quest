import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { BootScene } from '@/game/scenes/BootScene';
import { MenuScene } from '@/game/scenes/MenuScene';
import { GameScene } from '@/game/scenes/GameScene';
import { DialogUI } from '@/game/ui/DialogUI';
import { FeedbackModal } from '@/components/game/FeedbackModal';
import { Question, QuestionOption, GameState } from '@/types/game';
import { gameManager } from '@/lib/gameManager';
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

const RPGGame = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentNPC, setCurrentNPC] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<QuestionOption | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameState, setGameState] = useState<GameState>(gameManager.getInitialState());
  const { toast } = useToast();
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Load game state
    const saved = gameManager.loadGame();
    if (saved) {
      setGameState(saved);
    }

    // Initialize Phaser game
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: [BootScene, MenuScene, GameScene],
      backgroundColor: '#f3fbff',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    gameRef.current = new Phaser.Game(config);

    // Listen for game events
    const handleShowDialog = (data: any) => {
      setCurrentNPC(data.npc);
      setCurrentQuestion(data.question);
      setShowDialog(true);
      gameRef.current?.scene.pause('GameScene');
    };

    gameRef.current.events.on('show-question-dialog', handleShowDialog);

    return () => {
      if (gameRef.current) {
        gameRef.current.events.off('show-question-dialog', handleShowDialog);
        gameRef.current.destroy(true);
      }
    };
  }, []);

  const handleAnswer = (option: QuestionOption) => {
    if (!currentQuestion) return;

    setCurrentAnswer(option);
    setShowDialog(false);

    // Update game state
    let newState = gameState;
    
    // Add score
    newState = gameManager.updateScore(newState, option.effect.score);
    
    // Add karma
    newState = gameManager.updateKarma(newState, option.effect.karma);
    
    // Add XP to player
    const player = (gameRef.current?.scene.getScene('GameScene') as any)?.getPlayer?.();
    if (player) {
      player.addXP(option.effect.score);
    }
    
    // Add item if any
    if (option.effect.item) {
      if (option.effect.item.startsWith('fragment')) {
        newState = gameManager.addFragment(newState, option.effect.item);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }

    // Mark question as completed
    newState = {
      ...newState,
      progress: {
        ...newState.progress,
        completedChallenges: [...newState.progress.completedChallenges, currentQuestion.id]
      }
    };

    setGameState(newState);
    gameManager.saveGame(newState);
    setShowFeedback(true);

    toast({
      title: option.isCorrect ? '✓ Benar!' : '○ Dijawab',
      description: `+${option.effect.score} XP, Karma ${option.effect.karma > 0 ? '+' : ''}${option.effect.karma}`
    });
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setCurrentAnswer(null);
    setCurrentQuestion(null);
    gameRef.current?.scene.resume('GameScene');
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setCurrentQuestion(null);
    gameRef.current?.scene.resume('GameScene');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div id="phaser-container" className="w-full h-full" />
      
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      {showDialog && currentQuestion && (
        <DialogUI
          npcName={currentNPC}
          question={currentQuestion}
          onAnswer={handleAnswer}
          onClose={handleCloseDialog}
        />
      )}

      {showFeedback && currentAnswer && (
        <FeedbackModal
          isCorrect={currentAnswer.isCorrect}
          feedback={currentAnswer.effect.feedback}
          rewards={{
            score: currentAnswer.effect.score,
            karma: currentAnswer.effect.karma,
            item: currentAnswer.effect.item
          }}
          onContinue={handleContinue}
        />
      )}

      {/* Controls hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-muted-foreground z-[100] pointer-events-none">
        {window.innerWidth < 768 ? (
          <span>Gunakan joystick untuk bergerak • Tekan NPC untuk berinteraksi</span>
        ) : (
          <span>Arrow Keys / WASD untuk bergerak • E untuk berinteraksi dengan NPC</span>
        )}
      </div>
    </div>
  );
};

export default RPGGame;
