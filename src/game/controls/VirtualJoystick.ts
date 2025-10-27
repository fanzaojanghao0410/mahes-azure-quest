import Phaser from 'phaser';

export class VirtualJoystick {
  private scene: Phaser.Scene;
  private base: Phaser.GameObjects.Image;
  private knob: Phaser.GameObjects.Image;
  private isDragging = false;
  private forceX = 0;
  private forceY = 0;
  private maxDistance = 50;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // Create base
    this.base = scene.add.image(x, y, 'joystick_base');
    this.base.setDisplaySize(120, 120);
    this.base.setScrollFactor(0);
    this.base.setDepth(100);
    this.base.setAlpha(0.6);

    // Create knob
    this.knob = scene.add.image(x, y, 'joystick_knob');
    this.knob.setDisplaySize(60, 60);
    this.knob.setScrollFactor(0);
    this.knob.setDepth(101);
    this.knob.setAlpha(0.8);

    // Make knob interactive
    this.knob.setInteractive({ draggable: true, useHandCursor: true });

    // Setup drag events
    this.knob.on('dragstart', () => {
      this.isDragging = true;
      this.base.setAlpha(0.8);
      this.knob.setAlpha(1);
    });

    this.knob.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      const baseX = this.base.x;
      const baseY = this.base.y;
      
      const angle = Math.atan2(dragY - baseY, dragX - baseX);
      const distance = Math.min(
        Phaser.Math.Distance.Between(baseX, baseY, dragX, dragY),
        this.maxDistance
      );

      this.knob.x = baseX + Math.cos(angle) * distance;
      this.knob.y = baseY + Math.sin(angle) * distance;

      // Calculate force (-1 to 1)
      this.forceX = (this.knob.x - baseX) / this.maxDistance;
      this.forceY = (this.knob.y - baseY) / this.maxDistance;
    });

    this.knob.on('dragend', () => {
      this.isDragging = false;
      
      // Animate knob back to center
      scene.tweens.add({
        targets: this.knob,
        x: this.base.x,
        y: this.base.y,
        duration: 100,
        ease: 'Power1',
      });

      this.forceX = 0;
      this.forceY = 0;
      this.base.setAlpha(0.6);
      this.knob.setAlpha(0.8);
    });
  }

  getForce(): { x: number; y: number } {
    return { x: this.forceX, y: this.forceY };
  }

  destroy() {
    this.base.destroy();
    this.knob.destroy();
  }
}
