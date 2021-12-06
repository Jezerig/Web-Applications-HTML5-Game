// source: https://phaser.io/examples/v3/view/game-objects/lights/change-scene

class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    preload() {
        this.load.image('background', 'assets/backgroundColorDesert.png');
        this.load.image('restart', 'assets/restart.png');
    }

    create() {
        this.add.image(400, 300, 'background');
        this.victoryText = this.add.text(400, 150, "0", {fontSize: "35px", fill: "#000"}).setOrigin(0.5);
        this.victoryText.setText("Congratulations! You won!");
        // Source: https://www.html5gamedevs.com/topic/36850-solvederror-thisaddbutton-is-not-a-function/
        this.restartButton = this.add.sprite(400, 300, 'restart').setInteractive();
        this.restartButton.on('pointerdown', actionOnClick);
    }
}

function actionOnClick () {
    // source: https://stackoverflow.com/questions/55264077/phaser-3-clickable-sprite-cant-start-scene
    this.scene.scene.start("PlayGame");
}
export default VictoryScene;