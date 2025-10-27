import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load loading bar assets
    this.createLoadingBar();
    
    // Load game assets
    this.load.image('mahes_idle', '/src/assets/sprites/mahes_idle.png');
    this.load.image('npc_mentor', '/src/assets/sprites/npc_mentor.png');
    this.load.image('school_tileset', '/src/assets/maps/school_tileset.png');
    this.load.image('joystick_base', '/src/assets/ui/joystick.png');
    
    // Load regions backgrounds
    this.load.image('region1_bg', '/src/assets/region1_bg.jpg');
    this.load.image('region2_bg', '/src/assets/region2_bg.jpg');
    this.load.image('region3_bg', '/src/assets/region3_bg.jpg');
  }

  create() {
    this.scene.start('MenuScene');
  }

  private createLoadingBar() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x67c7ff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
  }
}
