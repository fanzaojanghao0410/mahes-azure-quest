import Phaser from 'phaser';

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public xp = 0;
  public level = 1;
  public karma = 50;
  public crownFragments = 0;
  public sashFragments = 0;
  private speed = 160;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'mahes');
    this.sprite.setDisplaySize(48, 48);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);
  }

  update(velocityX: number, velocityY: number) {
    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      const normalizer = Math.sqrt(2);
      velocityX /= normalizer;
      velocityY /= normalizer;
    }

    // Apply velocity
    this.sprite.setVelocity(
      velocityX * this.speed,
      velocityY * this.speed
    );

    // Simple animation based on movement
    if (velocityX !== 0 || velocityY !== 0) {
      // Moving - could add walking animation here
      this.sprite.setAlpha(1);
    } else {
      // Idle
      this.sprite.setAlpha(0.95);
    }
  }

  addXP(amount: number, scene: Phaser.Scene) {
    this.xp += amount;
    
    // Check for level up (every 100 XP)
    const newLevel = Math.floor(this.xp / 100) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.showLevelUp(scene);
    }
  }

  addKarma(amount: number) {
    this.karma = Math.max(0, Math.min(100, this.karma + amount));
  }

  addFragment(type: 'crown' | 'sash') {
    if (type === 'crown') {
      this.crownFragments = Math.min(6, this.crownFragments + 1);
    } else {
      this.sashFragments = Math.min(6, this.sashFragments + 1);
    }
  }

  private showLevelUp(scene: Phaser.Scene) {
    // Create level up text
    const text = scene.add.text(
      this.sprite.x,
      this.sprite.y - 60,
      `Level Up! ${this.level}`,
      {
        fontSize: '24px',
        color: '#ffd166',
        fontStyle: 'bold',
        stroke: '#2b8af7',
        strokeThickness: 4,
      }
    );
    text.setOrigin(0.5);

    // Animate and destroy
    scene.tweens.add({
      targets: text,
      y: text.y - 40,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });

    // Particle effect
    const particles = scene.add.particles(this.sprite.x, this.sprite.y, 'joystick_knob', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.3, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      quantity: 20,
    });

    scene.time.delayedCall(1000, () => {
      particles.destroy();
    });
  }
}
