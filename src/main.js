/*  Brandon McDonald's Rocket patrol mod, finished April 19th 2021
 *  Implements Simultaneous 2P mode (30), Additional time for successful hits (20),
 *  A new, smaller spaceship that moves faster and is worth more points (20),
 *  Parallax scrolling (10), Time display (10), Post-firing control (5) [at half speed]
 *  Speed increase after 30 seconds, regardless of how much time is left on the clock (5).
 */

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

let starSpeed = 2;
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyF, keyR, keyA, keyD, keyLEFT, keyRIGHT, keySHIFT;