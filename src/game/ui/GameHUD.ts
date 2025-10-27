import Phaser from 'phaser';
import { gameManager } from '@/lib/gameManager';

export class GameHUD {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private xpBar!: Phaser.GameObjects.Graphics;
  private xpText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private karmaText!: Phaser.GameObjects.Text;
  private fragmentsText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create() {
    this.container = this.scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(999);

    const { width } = this.scene.cameras.main;

    // Background panel
    const panel = this.scene.add.graphics();
    panel.fillStyle(0x04314f, 0.8);
    panel.fillRoundedRect(10, 10, width - 20, 80, 8);
    this.container.add(panel);

    // Level text
    this.levelText = this.scene.add.text(20, 20, 'Level 1', {
      fontSize: '18px',
      color: '#ffd166',
      fontFamily: 'Poppins, sans-serif',
      fontStyle: 'bold'
    });
    this.container.add(this.levelText);

    // XP Bar
    const xpBarBg = this.scene.add.graphics();
    xpBarBg.fillStyle(0x2c5f7c, 1);
    xpBarBg.fillRoundedRect(20, 50, 200, 20, 4);
    this.container.add(xpBarBg);

    this.xpBar = this.scene.add.graphics();
    this.container.add(this.xpBar);

    this.xpText = this.scene.add.text(230, 50, '0 / 100 XP', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif'
    });
    this.container.add(this.xpText);

    // Karma display
    this.karmaText = this.scene.add.text(width - 220, 20, 'Karma: 50', {
      fontSize: '16px',
      color: '#4ecdc4',
      fontFamily: 'Poppins, sans-serif'
    });
    this.container.add(this.karmaText);

    // Fragments display
    this.fragmentsText = this.scene.add.text(width - 220, 50, '👑 0/6  🎗️ 0/6', {
      fontSize: '16px',
      color: '#ffd166',
      fontFamily: 'Poppins, sans-serif'
    });
    this.container.add(this.fragmentsText);
  }

  update() {
    const gameState = gameManager.loadGame() || gameManager.getInitialState();
    const player = (this.scene as any).getPlayer?.();
    
    if (player) {
      const stats = player.getStats();
      
      // Update level
      this.levelText.setText(`Level ${stats.level}`);
      
      // Update XP bar
      const xpPercent = stats.xp / stats.xpToNext;
      this.xpBar.clear();
      this.xpBar.fillStyle(0x67c7ff, 1);
      this.xpBar.fillRoundedRect(20, 50, 200 * xpPercent, 20, 4);
      
      this.xpText.setText(`${stats.xp} / ${stats.xpToNext} XP`);
    }

    // Update karma
    this.karmaText.setText(`Karma: ${gameState.stats.karma}`);

    // Update fragments
    const fragments = gameManager.getFragmentCount(gameState);
    this.fragmentsText.setText(`👑 ${fragments.crown}/6  🎗️ ${fragments.sash}/6`);
  }
}
