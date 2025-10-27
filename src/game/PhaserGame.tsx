import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { BootScene } from './scenes/BootScene';
import { DialogUI } from './ui/DialogUI';
import { GameHUD } from './ui/GameHUD';
import { Question } from '@/types/game';

export const PhaserGame = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [dialog, setDialog] = useState<{
    npcName: string;
    text: string;
    question?: Question;
  } | null>(null);
  const [gameStats, setGameStats] = useState({
    xp: 0,
    level: 1,
    karma: 50,
    crownFragments: 0,
    sashFragments: 0,
  });

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [BootScene, GameScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: '#f3fbff',
    };

    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);

      // Listen for custom events from game scenes
      gameRef.current.events.on('showDialog', (data: any) => {
        setDialog(data);
      });

      gameRef.current.events.on('updateStats', (stats: any) => {
        setGameStats(stats);
      });
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleCloseDialog = () => {
    setDialog(null);
    // Notify game to resume
    if (gameRef.current) {
      gameRef.current.events.emit('dialogClosed');
    }
  };

  const handleAnswerSelected = (optionId: string) => {
    if (gameRef.current && dialog?.question) {
      gameRef.current.events.emit('answerSelected', optionId);
    }
    handleCloseDialog();
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div id="game-container" className="w-full h-full" />
      
      <GameHUD stats={gameStats} />
      
      {dialog && (
        <DialogUI
          npcName={dialog.npcName}
          text={dialog.text}
          question={dialog.question}
          onClose={handleCloseDialog}
          onAnswerSelected={handleAnswerSelected}
        />
      )}
    </div>
  );
};
