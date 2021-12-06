import Phaser from 'phaser'
import VictoryScene from './victoryScene'

// source: youtube.com/watch?v=F3gI2EEFDRo (lecture material)
let game; 

const gameOptions = {
    characterGravity: 800,
    characterSpeed: 300
}

window.onload = function() {
    let config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 600
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: [PlayGame, VictoryScene]
    }
    game = new Phaser.Game(config);
    window.focus();
}

class PlayGame extends Phaser.Scene {
    constructor() {
        super('PlayGame');
    }
    preload () {
        //source: https://kenney.nl/assets/platformer-art-deluxe
        this.load.image('sand', 'assets/sand.png');
        this.load.image('spiketrap', 'assets/spikes.png');
        this.load.image('red_endflag', 'assets/flagRed.png');
        //source: https://kenney.nl/assets/background-elements-redux
        this.load.image('background', 'assets/backgroundColorDesert.png');
        //source: https://kenney.nl/assets/toon-characters-1
        this.load.spritesheet('character', 'assets/character_malePerson_sheet.png', {frameWidth: 96, frameHeight: 128});
    }
    
    create () {
        this.add.image(400, 300, 'background');
        this.platforms = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });
        this.traps = this.physics.add.group({
        });
        this.endflags = this.physics.add.group({
        });

        let x_pos = 0;
        for(let i=0;i<4;i++) {
            this.platforms.create(x_pos, 600, "sand");
            x_pos = x_pos + 70
        }
        x_pos = x_pos + 140
        this.platforms.create(x_pos, 600, "sand");
        x_pos = x_pos + 200
        this.traps.create(x_pos, 530, "spiketrap");
        for(let i=0;i<3;i++) {
            this.platforms.create(x_pos, 600, "sand");
            x_pos = x_pos + 70
        }
        x_pos = x_pos - 30
        this.endflags.create(x_pos, 530, "red_endflag");
        

        this.guideText = this.add.text(400, 150, "0", {fontSize: "35px", fill: "#000"}).setOrigin(0.5);
        this.guideText.setText("Get to the red flag!");

        this.character = this.physics.add.sprite(48, 450, "character");
        this.character.body.gravity.y = gameOptions.characterGravity;

        this.physics.add.collider(this.character, this.platforms);

        this.physics.add.overlap(this.character, this.traps, this.deathByTrap, null, this);
        this.physics.add.overlap(this.character, this.endflags, this.finishLevel, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("character", {start: 24, end: 26}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "turn",
            frames: [{ key: "character", frame: 0}],
            frameRate: 20,
        })

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("character", {start: 24, end: 26}),
            frameRate: 10,
            repeat: -1
        })

    }

    deathByTrap() {
        this.scene.start("PlayGame");
    }

    finishLevel() {
        this.scene.start("VictoryScene");

    }



    update() {
        if(this.cursors.left.isDown) {
            //flips the running animation
            this.character.setFlipX(true)

            this.character.body.velocity.x = -gameOptions.characterSpeed;
            this.character.anims.play("left", true);
        }
        else if(this.cursors.right.isDown) {
            this.character.setFlipX(false)
            this.character.body.velocity.x = gameOptions.characterSpeed;
            this.character.anims.play("right", true);
        }
        else {
            this.character.body.velocity.x = 0;
            this.character.anims.play("turn", true);
        }

        if(this.cursors.up.isDown && this.character.body.touching.down) {
            this.character.setVelocityY(-gameOptions.characterGravity/1.8);
        }


        if(this.character.y > game.config.height || this.character.y < 0) {
            this.scene.start("PlayGame");
        }

    }
    
}
