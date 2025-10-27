import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load character sprite
    this.load.image('mahes', '/src/assets/sprites/mahes_spritesheet.png');
    
    // Load NPC sprites
    this.load.image('npc_mentor', '/src/assets/sprites/npc_mentor.png');
    
    // Load tileset
    this.load.image('school_tiles', '/src/assets/maps/school_tileset.png');
    
    // Load UI elements
    this.load.image('joystick_base', '/src/assets/ui/joystick_base.png');
    this.load.image('joystick_knob', '/src/assets/ui/joystick_knob.png');
    
    // Create loading text
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const loadingText = this.add.text(width / 2, height / 2, 'Memuat...', {
      fontSize: '24px',
      color: '#2b8af7',
    });
    loadingText.setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      loadingText.setText(`Memuat... ${Math.floor(value * 100)}%`);
    });
  }

  create() {
    this.scene.start('GameScene');
  }
}
