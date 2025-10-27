import Phaser from 'phaser';
import { VirtualJoystick } from '../controls/VirtualJoystick';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { GameHUD } from '../ui/GameHUD';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private joystick!: VirtualJoystick;
  private npcs!: Phaser.GameObjects.Group;
  private hud!: GameHUD;
  private currentArea: string = 'school';

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // Background
    const bg = this.add.image(800, 600, 'region1_bg');
    bg.setDisplaySize(1600, 1200);
    bg.setAlpha(0.3);

    // Create player
    this.player = new Player(this, 400, 300);
    
    // Create NPCs
    this.createNPCs();

    // Camera follow player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

    // Virtual joystick for mobile
    if (this.sys.game.device.os.android || this.sys.game.device.os.iOS || window.innerWidth < 768) {
      this.joystick = new VirtualJoystick(this);
    }

    // Keyboard controls
    this.input.keyboard?.createCursorKeys();

    // HUD overlay
    this.hud = new GameHUD(this);

    // Interaction key
    this.input.keyboard?.on('keydown-E', () => {
      this.checkNPCInteraction();
    });
  }

  update() {
    if (this.joystick) {
      this.player.updateMovement(this.joystick.force, this.joystick.angle);
    } else {
      const cursors = this.input.keyboard?.createCursorKeys();
      if (cursors) {
        this.player.updateKeyboardMovement(cursors);
      }
    }

    // Update HUD
    this.hud.update();
  }

  private createNPCs() {
    this.npcs = this.add.group({
      classType: NPC,
      runChildUpdate: true
    });

    // Create mentor NPC
    const mentor = new NPC(this, 600, 300, 'npc_mentor', 'Guru Biru', 'moral_001');
    this.npcs.add(mentor);

    // Create more NPCs for different regions
    const friend = new NPC(this, 800, 400, 'npc_mentor', 'Sahabat', 'moral_002');
    this.npcs.add(friend);

    const stranger = new NPC(this, 400, 600, 'npc_mentor', 'Petualang', 'puzzle_001');
    this.npcs.add(stranger);
  }

  private checkNPCInteraction() {
    const nearbyNPC = this.npcs.getChildren().find((npc: any) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.x,
        npc.y
      );
      return distance < 80;
    });

    if (nearbyNPC) {
      (nearbyNPC as NPC).interact();
    }
  }

  public getPlayer(): Player {
    return this.player;
  }
}
