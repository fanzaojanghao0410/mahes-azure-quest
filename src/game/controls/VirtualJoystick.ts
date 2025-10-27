import Phaser from 'phaser';

export class VirtualJoystick {
  private scene: Phaser.Scene;
  private base!: Phaser.GameObjects.Image;
  private thumb!: Phaser.GameObjects.Image;
  private graphics!: Phaser.GameObjects.Graphics;
  
  public force: number = 0;
  public angle: number = 0;
  
  private isDragging: boolean = false;
  private radius: number = 60;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create() {
    const { width, height } = this.scene.cameras.main;
    
    // Create graphics for joystick
    this.graphics = this.scene.add.graphics();
    this.graphics.setScrollFactor(0);
    this.graphics.setDepth(1000);

    // Base circle
    this.graphics.fillStyle(0x67c7ff, 0.3);
    this.graphics.fillCircle(100, height - 100, this.radius);
    this.graphics.lineStyle(3, 0x67c7ff, 0.8);
    this.graphics.strokeCircle(100, height - 100, this.radius);

    // Thumb circle
    this.graphics.fillStyle(0x2b8af7, 0.8);
    this.graphics.fillCircle(100, height - 100, 30);

    // Make interactive
    const zone = this.scene.add.zone(100, height - 100, this.radius * 2, this.radius * 2)
      .setOrigin(0.5)
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000);

    zone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isDragging = true;
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        this.updateJoystick(pointer);
      }
    });

    this.scene.input.on('pointerup', () => {
      this.isDragging = false;
      this.force = 0;
      this.redraw();
    });
  }

  private updateJoystick(pointer: Phaser.Input.Pointer) {
    const { height } = this.scene.cameras.main;
    const baseX = 100;
    const baseY = height - 100;

    const dx = pointer.x - baseX;
    const dy = pointer.y - baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.angle = Math.atan2(dy, dx);
    this.force = Math.min(distance / this.radius, 1);

    this.redraw();
  }

  private redraw() {
    const { height } = this.scene.cameras.main;
    const baseX = 100;
    const baseY = height - 100;

    this.graphics.clear();

    // Base
    this.graphics.fillStyle(0x67c7ff, 0.3);
    this.graphics.fillCircle(baseX, baseY, this.radius);
    this.graphics.lineStyle(3, 0x67c7ff, 0.8);
    this.graphics.strokeCircle(baseX, baseY, this.radius);

    // Thumb position
    const thumbX = baseX + Math.cos(this.angle) * this.force * this.radius * 0.7;
    const thumbY = baseY + Math.sin(this.angle) * this.force * this.radius * 0.7;

    this.graphics.fillStyle(0x2b8af7, 0.8);
    this.graphics.fillCircle(thumbX, thumbY, 30);
  }
}
