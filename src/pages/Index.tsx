import { useState, useEffect } from 'react';
import { GameState, Question, QuestionOption } from '@/types/game';
import { gameManager } from '@/lib/gameManager';
import { LandingPage } from '@/components/game/LandingPage';
import { PlayerSetup } from '@/components/game/PlayerSetup';
import { RegionMap } from '@/components/game/RegionMap';
import { GameHUD } from '@/components/game/GameHUD';
import { ChallengeScreen } from '@/components/game/ChallengeScreen';
import { FeedbackModal } from '@/components/game/FeedbackModal';
import { EndingScreen } from '@/components/game/EndingScreen';
import { Leaderboard } from '@/components/game/Leaderboard';
import { useToast } from '@/hooks/use-toast';

type GamePhase = 'landing' | 'setup' | 'map' | 'challenge' | 'feedback' | 'ending' | 'leaderboard';

const Index = () => {
  const [phase, setPhase] = useState<GamePhase>('landing');
  const [gameState, setGameState] = useState<GameState>(gameManager.getInitialState());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<QuestionOption | null>(null);
  const { toast } = useToast();

  // Load saved game on mount
  useEffect(() => {
    const saved = gameManager.loadGame();
    if (saved) {
      setGameState(saved);
    }
  }, []);

  // Auto-save game state
  useEffect(() => {
    if (phase !== 'landing' && phase !== 'setup') {
      gameManager.saveGame(gameState);
    }
  }, [gameState, phase]);

  const handleStartGame = () => {
    const saved = gameManager.loadGame();
    if (saved) {
      setGameState(saved);
      setPhase('map');
    } else {
      setPhase('setup');
    }
  };

  const handlePlayerSetup = (player: typeof gameState.player) => {
    const newState = {
      ...gameState,
      player,
      stats: {
        ...gameState.stats,
        startTime: Date.now()
      }
    };
    setGameState(newState);
    gameManager.saveGame(newState);
    setPhase('map');
    
    toast({
      title: `Selamat datang, ${player.name}! 🌟`,
      description: 'Petualanganmu dimulai. Semoga beruntung!'
    });
  };

  const handleSelectRegion = (regionId: number) => {
    // Get region questions
    const regionMap = {
      1: 'pulau_awan',
      2: 'hutan_biru',
      3: 'kota_tepi_laut'
    };
    
    const questions = gameManager.getQuestionsByRegion(regionMap[regionId as keyof typeof regionMap]);
    const uncompletedQuestions = questions.filter(
      q => !gameState.progress.completedChallenges.includes(q.id)
    );

    if (uncompletedQuestions.length === 0) {
      // Region completed, unlock next
      if (regionId < 3 && !gameState.progress.unlockedRegions.includes(regionId + 1)) {
        const newState = {
          ...gameState,
          progress: {
            ...gameState.progress,
            currentRegion: regionId + 1,
            unlockedRegions: [...gameState.progress.unlockedRegions, regionId + 1]
          }
        };
        setGameState(newState);
        
        toast({
          title: '🎉 Region Selesai!',
          description: `Region ${regionId + 1} telah terbuka!`
        });
      } else if (regionId === 3) {
        // All regions completed, show ending
        handleGameComplete();
      }
      return;
    }

    // Start first uncompleted question
    setCurrentQuestion(uncompletedQuestions[0]);
    setPhase('challenge');
  };

  const handleAnswer = (optionId: string) => {
    if (!currentQuestion) return;

    const option = currentQuestion.options.find(o => o.id === optionId);
    if (!option) return;

    setCurrentAnswer(option);

    // Update game state
    let newState = gameState;
    
    // Add score
    newState = gameManager.updateScore(newState, option.effect.score);
    
    // Add karma
    newState = gameManager.updateKarma(newState, option.effect.karma);
    
    // Add item if any
    if (option.effect.item) {
      if (option.effect.item.startsWith('fragment')) {
        newState = gameManager.addFragment(newState, option.effect.item);
      } else if (option.effect.item === 'hint') {
        newState = {
          ...newState,
          inventory: {
            ...newState.inventory,
            hints: newState.inventory.hints + 1
          }
        };
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
    setPhase('feedback');
  };

  const handleUseHint = () => {
    const newState = gameManager.useHint(gameState);
    setGameState(newState);
  };

  const handleContinueFromFeedback = () => {
    setCurrentAnswer(null);
    setCurrentQuestion(null);
    
    // Check if all challenges completed
    if (gameState.progress.completedChallenges.length >= 24) {
      handleGameComplete();
    } else {
      setPhase('map');
    }
  };

  const handleGameComplete = () => {
    const endingType = gameManager.calculateEnding(
      gameState.stats.karma,
      gameManager.hasAllFragments(gameState)
    );

    const playTime = Math.floor((Date.now() - gameState.stats.startTime) / 1000);
    
    setGameState({
      ...gameState,
      stats: {
        ...gameState.stats,
        playTime
      }
    });

    setPhase('ending');
  };

  const handleSaveToLeaderboard = () => {
    const playTime = Math.floor((Date.now() - gameState.stats.startTime) / 1000);
    const endingType = gameManager.calculateEnding(
      gameState.stats.karma,
      gameManager.hasAllFragments(gameState)
    );

    gameManager.saveToLeaderboard({
      name: gameState.player.name,
      score: gameState.stats.score,
      karma: gameState.stats.karma,
      time: playTime,
      date: new Date().toISOString(),
      ending: endingType
    });

    toast({
      title: '💾 Tersimpan!',
      description: 'Skor kamu telah ditambahkan ke leaderboard'
    });
  };

  const handlePlayAgain = () => {
    setGameState(gameManager.getInitialState());
    setCurrentQuestion(null);
    setCurrentAnswer(null);
    setPhase('setup');
  };

  const handleShowLeaderboard = () => {
    setPhase('leaderboard');
  };

  const handleCloseLeaderboard = () => {
    setPhase(gameState.player.name ? 'map' : 'landing');
  };

  return (
    <>
      {phase === 'landing' && (
        <LandingPage
          onStartGame={handleStartGame}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}

      {phase === 'setup' && (
        <PlayerSetup onComplete={handlePlayerSetup} />
      )}

      {phase === 'map' && (
        <>
          <GameHUD gameState={gameState} />
          <RegionMap
            progress={gameState.progress}
            onSelectRegion={handleSelectRegion}
          />
        </>
      )}

      {phase === 'challenge' && currentQuestion && (
        <>
          <GameHUD gameState={gameState} />
          <ChallengeScreen
            question={currentQuestion}
            onAnswer={handleAnswer}
            onUseHint={handleUseHint}
            hintsAvailable={gameState.inventory.hints}
          />
        </>
      )}

      {phase === 'feedback' && currentAnswer && (
        <FeedbackModal
          isCorrect={currentAnswer.isCorrect}
          feedback={currentAnswer.effect.feedback}
          rewards={{
            score: currentAnswer.effect.score,
            karma: currentAnswer.effect.karma,
            item: currentAnswer.effect.item
          }}
          onContinue={handleContinueFromFeedback}
        />
      )}

      {phase === 'ending' && (
        <EndingScreen
          endingType={gameManager.calculateEnding(
            gameState.stats.karma,
            gameManager.hasAllFragments(gameState)
          )}
          stats={{
            score: gameState.stats.score,
            karma: gameState.stats.karma,
            time: gameState.stats.playTime,
            hintsUsed: gameState.stats.hintsUsed
          }}
          onPlayAgain={handlePlayAgain}
          onSaveToLeaderboard={handleSaveToLeaderboard}
        />
      )}

      {phase === 'leaderboard' && (
        <Leaderboard
          entries={gameManager.getLeaderboard()}
          onClose={handleCloseLeaderboard}
        />
      )}
    </>
  );
};

export default Index;
