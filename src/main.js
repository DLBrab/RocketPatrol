let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

let starSpeed = 1;
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keySpace, keyR, keyLEFT, keyRIGHT;