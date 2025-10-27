import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(0, 0, width, height, 0xf3fbff).setOrigin(0);

    // Title
    this.add.text(width / 2, height / 3, 'Mahes Adventure', {
      fontSize: '48px',
      color: '#04314f',
      fontFamily: 'Poppins, sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height / 3 + 60, 'Temukan Artefak Legendaris', {
      fontSize: '20px',
      color: '#2c5f7c',
      fontFamily: 'Inter, sans-serif'
    }).setOrigin(0.5);

    // Start button
    const startButton = this.add.rectangle(width / 2, height / 2 + 50, 200, 50, 0x67c7ff)
      .setInteractive({ useHandCursor: true });
    
    const startText = this.add.text(width / 2, height / 2 + 50, 'Mulai Petualangan', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Poppins, sans-serif'
    }).setOrigin(0.5);

    startButton.on('pointerover', () => {
      startButton.setFillStyle(0x2b8af7);
    });

    startButton.on('pointerout', () => {
      startButton.setFillStyle(0x67c7ff);
    });

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // How to play button
    const helpButton = this.add.rectangle(width / 2, height / 2 + 120, 200, 50, 0xe8f9ff)
      .setInteractive({ useHandCursor: true });
    
    const helpText = this.add.text(width / 2, height / 2 + 120, 'Cara Bermain', {
      fontSize: '18px',
      color: '#04314f',
      fontFamily: 'Poppins, sans-serif'
    }).setOrigin(0.5);

    helpButton.on('pointerover', () => {
      helpButton.setFillStyle(0xd0f0ff);
    });

    helpButton.on('pointerout', () => {
      helpButton.setFillStyle(0xe8f9ff);
    });
  }
}
