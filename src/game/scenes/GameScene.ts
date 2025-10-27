import Phaser from 'phaser';
import { VirtualJoystick } from '../controls/VirtualJoystick';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { gameManager } from '@/lib/gameManager';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private joystick!: VirtualJoystick;
  private npcs: NPC[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: any;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private interactButton!: Phaser.GameObjects.Container;
  private nearbyNPC: NPC | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Create background
    this.add.rectangle(400, 300, 800, 600, 0xe8f9ff);
    
    // Add floor tiles
    const tileSize = 32;
    for (let y = 0; y < 600; y += tileSize) {
      for (let x = 0; x < 800; x += tileSize) {
        const tile = this.add.rectangle(x + tileSize/2, y + tileSize/2, tileSize - 2, tileSize - 2, 0xdaf4ff);
        tile.setStrokeStyle(1, 0xc0e7f7);
      }
    }

    // Create player
    this.player = new Player(this, 400, 300);
    
    // Create NPCs
    this.createNPCs();
    
    // Setup controls
    this.setupControls();
    
    // Setup camera
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 800, 600);
    
    // Listen for game events
    this.game.events.on('answerSelected', this.handleAnswerSelected, this);
    this.game.events.on('dialogClosed', this.handleDialogClosed, this);
  }

  private createNPCs() {
    // Get questions from gameManager
    const questions = gameManager.getQuestions();
    
    // Create mentor NPC
    const mentorQuestions = questions.filter(q => q.region === 'pulau_awan').slice(0, 3);
    const mentor = new NPC(this, 300, 200, 'npc_mentor', 'Guru Bijak', mentorQuestions);
    this.npcs.push(mentor);
    
    // Create more NPCs with different questions
    const studentQuestions = questions.filter(q => q.region === 'hutan_biru').slice(0, 3);
    const student = new NPC(this, 500, 400, 'npc_mentor', 'Teman Sejati', studentQuestions);
    this.npcs.push(student);
  }

  private setupControls() {
    // Keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    // Virtual joystick for mobile
    this.joystick = new VirtualJoystick(this, 100, 500);
    
    // Interact button (mobile)
    this.createInteractButton();
  }

  private createInteractButton() {
    const buttonX = 700;
    const buttonY = 500;
    
    const button = this.add.circle(buttonX, buttonY, 40, 0x67c7ff, 0.8);
    const buttonText = this.add.text(buttonX, buttonY, 'E', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5);
    
    this.interactButton = this.add.container(0, 0, [button, buttonText]);
    this.interactButton.setScrollFactor(0);
    this.interactButton.setDepth(100);
    this.interactButton.setAlpha(0.5);
    
    button.setInteractive({ useHandCursor: true });
    button.on('pointerdown', () => this.handleInteract());
  }

  private handleInteract() {
    if (this.nearbyNPC) {
      this.nearbyNPC.interact(this.player);
    }
  }

  private handleAnswerSelected(optionId: string) {
    if (this.nearbyNPC) {
      this.nearbyNPC.handleAnswer(optionId, this.player);
      this.updateStats();
    }
  }

  private handleDialogClosed() {
    // Resume game
    this.physics.resume();
  }

  private updateStats() {
    this.game.events.emit('updateStats', {
      xp: this.player.xp,
      level: this.player.level,
      karma: this.player.karma,
      crownFragments: this.player.crownFragments,
      sashFragments: this.player.sashFragments,
    });
  }

  update() {
    // Get input from keyboard or joystick
    let velocityX = 0;
    let velocityY = 0;
    
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -1;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = 1;
    }
    
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocityY = -1;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocityY = 1;
    }
    
    // Override with joystick if active
    const joystickForce = this.joystick.getForce();
    if (joystickForce.x !== 0 || joystickForce.y !== 0) {
      velocityX = joystickForce.x;
      velocityY = joystickForce.y;
    }
    
    // Update player
    this.player.update(velocityX, velocityY);
    
    // Check for nearby NPCs
    this.checkNearbyNPCs();
    
    // Handle interact key
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.handleInteract();
    }
  }

  private checkNearbyNPCs() {
    this.nearbyNPC = null;
    
    for (const npc of this.npcs) {
      const distance = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        npc.sprite.x,
        npc.sprite.y
      );
      
      if (distance < 80) {
        this.nearbyNPC = npc;
        this.interactButton.setAlpha(1);
        npc.showIndicator();
        return;
      } else {
        npc.hideIndicator();
      }
    }
    
    this.interactButton.setAlpha(0.5);
  }
}
