import Phaser from 'phaser';
import { Question } from '@/types/game';
import { Player } from './Player';

export class NPC {
  public sprite: Phaser.GameObjects.Image;
  private name: string;
  private questions: Question[];
  private currentQuestionIndex = 0;
  private indicator?: Phaser.GameObjects.Text;
  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    name: string,
    questions: Question[]
  ) {
    this.scene = scene;
    this.name = name;
    this.questions = questions;

    this.sprite = scene.add.image(x, y, texture);
    this.sprite.setDisplaySize(64, 64);
    this.sprite.setDepth(10);

    // Create interaction indicator
    this.indicator = scene.add.text(x, y - 50, '💬', {
      fontSize: '24px',
    });
    this.indicator.setOrigin(0.5);
    this.indicator.setVisible(false);
  }

  interact(player: Player) {
    if (this.currentQuestionIndex >= this.questions.length) {
      // No more questions
      this.showDialog('Terima kasih sudah membantu! Semoga perjalananmu sukses.');
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    
    // Pause physics
    this.scene.physics.pause();
    
    // Show question dialog through game events
    this.scene.game.events.emit('showDialog', {
      npcName: this.name,
      text: question.scenario || question.question,
      question: question,
    });
  }

  handleAnswer(optionId: string, player: Player) {
    const question = this.questions[this.currentQuestionIndex];
    const option = question.options.find(opt => opt.id === optionId);

    if (option) {
      // Apply effects
      player.addXP(option.effect.score, this.scene);
      player.addKarma(option.effect.karma);

      // Check for item rewards
      if (option.effect.item) {
        if (option.effect.item.includes('crown')) {
          player.addFragment('crown');
        } else if (option.effect.item.includes('sash')) {
          player.addFragment('sash');
        }
      }

      // Move to next question
      this.currentQuestionIndex++;

      // Show feedback
      this.showFeedback(option.effect.feedback, player);
    }

    // Resume physics
    this.scene.physics.resume();
  }

  private showDialog(text: string) {
    this.scene.game.events.emit('showDialog', {
      npcName: this.name,
      text: text,
    });
  }

  private showFeedback(feedback: string, player: Player) {
    const text = this.scene.add.text(
      this.sprite.x,
      this.sprite.y - 80,
      feedback,
      {
        fontSize: '16px',
        color: '#2b8af7',
        backgroundColor: '#ffffff',
        padding: { x: 10, y: 5 },
      }
    );
    text.setOrigin(0.5);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 3000,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });
  }

  showIndicator() {
    if (this.indicator) {
      this.indicator.setVisible(true);
      
      // Bounce animation
      this.scene.tweens.add({
        targets: this.indicator,
        y: this.sprite.y - 55,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  hideIndicator() {
    if (this.indicator) {
      this.indicator.setVisible(false);
      this.scene.tweens.killTweensOf(this.indicator);
      this.indicator.y = this.sprite.y - 50;
    }
  }
}
