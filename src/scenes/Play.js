class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        })
    }
    create() {
        // place starfieldd
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
        this.p1Rocket = new Rocket(this, game.config.width / 2, 0, 'rocket').setOrigin(0.5, 0);
        this.p1Rocket.reset(); // Note: I cant for the life of me get the height correct outside of reset().

        // add ships
        this.ship1 = new Spaceship (this, game.config.width + borderUISize * 6, borderUISize * 4,
                                    'spaceship', 0, 3).setOrigin(0,0);
        this.ship2 = new Spaceship (this, game.config.width + borderUISize * 10, borderUISize * 6,
                                    'spaceship', 0, 2).setOrigin(0,0);
        this.ship3 = new Spaceship (this, game.config.width + borderUISize * 2, borderUISize * 8,
                                    'spaceship', 0, 1).setOrigin(0,0);
        
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 9,
                first: 0
            }),
            frameRate: 30
        })

        // Score
        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding:{
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding,
            borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        
        // Timer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 
                'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text((game.config.width/2, game.config.height/2 + 64, 
                '(F)ire to Restart', scoreConfig)).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

    }

    update() {
        // Restart functionality
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.gameOver = false;
            this.scene.restart();
        }

        // Starfield scrolling
        this.starfield.tilePositionX -= starSpeed;

        if(!this.gameOver){
            // update rocket
            this.p1Rocket.update();
            
            // update ships
            this.ship1.update();
            this.ship2.update();
            this.ship3.update();
        }
        

        // Check collisions
        if(this.checkCollision(this.p1Rocket, this.ship3)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship3);
        }
        if(this.checkCollision(this.p1Rocket, this.ship2)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship2);
        }
        if(this.checkCollision(this.p1Rocket, this.ship1)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship1);
        }
    }

    checkCollision(rocket, ship){
        // AABB collision checking
        if(rocket.x < ship.x + ship.width   && 
           rocket.x + rocket.width > ship.x &&
           rocket.y < ship.y + ship.height  &&
           rocket.height + rocket.y > ship.y) {
               return true;
           }
        return false;
    }

    shipExplode(ship){
        // Hide ship
        ship.alpha = 0;

        // Create boom on ship spot. Recycle ship
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        // Score update
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        // Your ears. Hand them over.
        this.sound.play('sfx_explosion');

    }
}