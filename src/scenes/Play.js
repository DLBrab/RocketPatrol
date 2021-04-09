class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

    }
    create() {
        //place starfieldd
        this.starfield = this.add.tileSprite(0,0,game.config.width, game.config.height, 
            'starfield').setOrigin(0,0)
        // green ui background
        this.add.rectangle(0, borderUISize + borderPadding,
            game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0);
        this.add.rectangle(0,0,game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width,
            borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0,0,borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height,
            0xFFFFFF).setOrigin(0,0);

        // add rocket
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize,
            'rocket')

        // add ships
        this.ship1 = new Spaceship (this, 100, 200, 'spaceship').setOrigin(0,0);
        this.ship2 = new Spaceship (this, 100, 200, 'spaceship').setOrigin(0,0);
        this.ship3 = new Spaceship (this, 100, 200, 'spaceship').setOrigin(0,0);
        
        // define keys
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        this.starfield.tilePositionX -= starSpeed;

        // update rocket
        this.p1Rocket.update();

        this.ship1.update();
        this.ship2.update();
        this.ship3.update();

        if(false){
            if(rocket.x + rocket.width / 2 > ship.x &&
               rocket.x - rocket.width / 2< ship.x + ship.width / 2 &&
               rocket.y + rocket.height / 2> ship.y && 
               rocket.y - rocket.height / 2 < ship.y + ship.height / 2){
                   ship.alpha = 0;
                   // play kaboom animation & sound
                   // score++;
                   rocket.reset();
                   ship.reset();
               }
        }
    }
}