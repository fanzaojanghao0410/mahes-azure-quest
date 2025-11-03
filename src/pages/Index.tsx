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
    // Update current region
    const newState = {
      ...gameState,
      progress: {
        ...gameState.progress,
        currentRegion: regionId
      }
    };
    setGameState(newState);

    // Get region questions based on formal region names
    const regionMap = {
      1: 'emerald_forest',
      2: 'luminara_city',
      3: 'mount_resolute',
      4: 'valley_of_wisdom'
    };
    
    const questions = gameManager.getQuestionsByRegion(regionMap[regionId as keyof typeof regionMap]);
    const uncompletedQuestions = questions.filter(
      q => !newState.progress.completedChallenges.includes(q.id)
    );

    if (uncompletedQuestions.length === 0) {
      // Region completed
      toast({
        title: '✅ Region Selesai!',
        description: 'Semua pertanyaan di region ini telah diselesaikan. Pilih region lain atau lanjutkan petualangan!',
        duration: 3000
      });
      
      // Unlock next region if not already unlocked
      if (regionId < 4 && !newState.progress.unlockedRegions.includes(regionId + 1)) {
        const updatedState = {
          ...newState,
          progress: {
            ...newState.progress,
            unlockedRegions: [...newState.progress.unlockedRegions, regionId + 1]
          }
        };
        setGameState(updatedState);
        
        toast({
          title: '🎉 Region Baru Terbuka!',
          description: `Selamat! Region ${regionId + 1} sekarang dapat diakses!`,
          duration: 4000
        });
      } else if (regionId === 4 && newState.progress.completedChallenges.length >= 20) {
        // All regions completed, show ending
        setTimeout(() => handleGameComplete(), 1000);
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
    
    // Get current region questions
    const regionMap = {
      1: 'emerald_forest',
      2: 'luminara_city',
      3: 'mount_resolute',
      4: 'valley_of_wisdom'
    };
    
    const currentRegionQuestions = gameManager.getQuestionsByRegion(
      regionMap[gameState.progress.currentRegion as keyof typeof regionMap]
    );
    
    const uncompletedInRegion = currentRegionQuestions.filter(
      q => !gameState.progress.completedChallenges.includes(q.id)
    );

    // If there are more questions in this region, show the next one
    if (uncompletedInRegion.length > 0) {
      setCurrentQuestion(uncompletedInRegion[0]);
      setPhase('challenge');
    } else {
      // Region completed, return to map
      setCurrentQuestion(null);
      setPhase('map');
      
      toast({
        title: '🎊 Region Selesai!',
        description: 'Semua pertanyaan di region ini telah diselesaikan. Lanjutkan petualangan!',
        duration: 3000
      });
      
      // Check if all challenges completed
      if (gameState.progress.completedChallenges.length >= 20) {
        setTimeout(() => handleGameComplete(), 1500);
      }
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
    <div className="min-h-screen">
      {phase === 'landing' && (
        <div className="page-transition">
          <LandingPage
            onStartGame={handleStartGame}
            onShowLeaderboard={handleShowLeaderboard}
          />
        </div>
      )}

      {phase === 'setup' && (
        <div className="page-transition">
          <PlayerSetup onComplete={handlePlayerSetup} />
        </div>
      )}

      {phase === 'map' && (
        <div className="page-transition">
          <GameHUD gameState={gameState} />
          <RegionMap
            progress={gameState.progress}
            onSelectRegion={handleSelectRegion}
          />
        </div>
      )}

      {phase === 'challenge' && currentQuestion && (
        <div className="page-transition">
          <GameHUD gameState={gameState} />
          <ChallengeScreen
            question={currentQuestion}
            onAnswer={handleAnswer}
            onUseHint={handleUseHint}
            hintsAvailable={gameState.inventory.hints}
          />
        </div>
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
        <div className="page-transition">
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
        </div>
      )}

      {phase === 'leaderboard' && (
        <Leaderboard
          entries={gameManager.getLeaderboard()}
          onClose={handleCloseLeaderboard}
        />
      )}
    </div>
  );
};

export default Index;
