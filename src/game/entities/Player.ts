import Phaser from 'phaser';
import { gameManager } from '@/lib/gameManager';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private speed: number = 160;
  private stats = {
    level: 1,
    xp: 0,
    xpToNext: 100,
    heart: 5,
    mind: 5,
    bravery: 5
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'mahes_idle');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setScale(0.8);
    
    // Load stats from game state
    this.loadStats();
  }

  updateMovement(force: number, angle: number) {
    if (force > 0.1) {
      const velocityX = Math.cos(angle) * force * this.speed;
      const velocityY = Math.sin(angle) * force * this.speed;
      
      this.setVelocity(velocityX, velocityY);
    } else {
      this.setVelocity(0, 0);
    }
  }

  updateKeyboardMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    let velocityX = 0;
    let velocityY = 0;

    if (cursors.left?.isDown) velocityX = -this.speed;
    if (cursors.right?.isDown) velocityX = this.speed;
    if (cursors.up?.isDown) velocityY = -this.speed;
    if (cursors.down?.isDown) velocityY = this.speed;

    this.setVelocity(velocityX, velocityY);
  }

  addXP(amount: number) {
    this.stats.xp += amount;
    
    if (this.stats.xp >= this.stats.xpToNext) {
      this.levelUp();
    }
    
    this.saveStats();
  }

  private levelUp() {
    this.stats.level++;
    this.stats.xp -= this.stats.xpToNext;
    this.stats.xpToNext = Math.floor(this.stats.xpToNext * 1.5);
    
    // Emit level up event
    this.scene.events.emit('player-levelup', this.stats.level);
  }

  getStats() {
    return { ...this.stats };
  }

  addStatPoint(stat: 'heart' | 'mind' | 'bravery') {
    this.stats[stat]++;
    this.saveStats();
  }

  private loadStats() {
    const gameState = gameManager.loadGame();
    if (gameState?.player) {
      // Load from game state if available
      const savedStats = (gameState as any).playerStats;
      if (savedStats) {
        this.stats = savedStats;
      }
    }
  }

  private saveStats() {
    const gameState = gameManager.loadGame() || gameManager.getInitialState();
    (gameState as any).playerStats = this.stats;
    gameManager.saveGame(gameState);
  }
}
