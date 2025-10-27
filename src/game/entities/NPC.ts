import Phaser from 'phaser';
import { gameManager } from '@/lib/gameManager';

export class NPC extends Phaser.Physics.Arcade.Sprite {
  private npcName: string;
  private questionId: string;
  private hasInteracted: boolean = false;
  private interactionIndicator!: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    name: string,
    questionId: string
  ) {
    super(scene, x, y, texture);
    
    this.npcName = name;
    this.questionId = questionId;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setImmovable(true);
    this.setScale(0.6);

    // Name label
    const nameText = scene.add.text(x, y - 60, name, {
      fontSize: '14px',
      color: '#04314f',
      backgroundColor: '#ffffff',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);

    // Interaction indicator
    this.interactionIndicator = scene.add.text(x, y - 80, '[ E ]', {
      fontSize: '12px',
      color: '#67c7ff',
      backgroundColor: '#04314f',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setVisible(false);

    // Check if already completed
    const gameState = gameManager.loadGame();
    if (gameState?.progress.completedChallenges.includes(this.questionId)) {
      this.hasInteracted = true;
      this.setTint(0x888888);
    }
  }

  update() {
    // Show interaction prompt when player is near
    const player = (this.scene as any).getPlayer?.();
    if (player) {
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        player.x,
        player.y
      );
      
      this.interactionIndicator.setVisible(!this.hasInteracted && distance < 80);
    }
  }

  interact() {
    if (this.hasInteracted) {
      this.showCompletedDialog();
      return;
    }

    const question = gameManager.getQuestionById(this.questionId);
    if (!question) {
      console.error('Question not found:', this.questionId);
      return;
    }

    // Emit event to show dialog
    this.scene.events.emit('show-question-dialog', {
      npc: this.npcName,
      question: question,
      onComplete: () => {
        this.hasInteracted = true;
        this.setTint(0x888888);
      }
    });
  }

  private showCompletedDialog() {
    this.scene.events.emit('show-simple-dialog', {
      npc: this.npcName,
      text: 'Terima kasih sudah membantu! Semoga perjalananmu lancar.'
    });
  }
}
