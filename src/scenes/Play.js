class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('stars', './assets/stars.png');

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
            'starfield').setOrigin(0,0);
        
        // Parallax stars
        this.starsfast = this.add.tileSprite(0, 0, game.config.width, game.config.height,
            'stars').setOrigin(0,0);
        this.starsslow = this.add.tileSprite(0, 0, game.config.width, game.config.height,
            'stars').setOrigin(0,0);
        
        // green ui background
        this.add.rectangle(0, borderUISize + borderPadding,
            game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0);
        
        // white border
        this.add.rectangle(0,0,game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width,
            borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0,0,borderUISize / 2, game.config.height, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize / 2, 0, borderUISize / 2, game.config.height,
            0xFFFFFF).setOrigin(0,0);

        // add rocket
        this.p1Rocket = new Rocket(this, game.config.width / 3, 0, 'rocket', 0, 1).setOrigin(0.5, 0);
        this.p2Rocket = new Rocket(this, 2 * game.config.width / 3, 0, 'rocket', 0, 2).setOrigin(0.5, 0);
        this.p1Rocket.reset(); // Note: I cant for the life of me get the height correct outside of reset().
        this.p2Rocket.reset();

        // add ships
        this.ship1 = new Spaceship (this, game.config.width + borderUISize * 6, borderUISize * 6,
                                    'spaceship', 0, 3);
        this.ship2 = new Spaceship (this, game.config.width + borderUISize * 10, borderUISize * 8,
                                    'spaceship', 0, 2);
        this.ship3 = new Spaceship (this, game.config.width + borderUISize * 2, borderUISize * 10,
                                    'spaceship', 0, 1);
        this.ship4 = new Spaceship (this, game.config.width + borderUISize * 4, borderUISize * 4,
                                    'spaceship', 0, 6); // I should set the origin, but i already lined things up
        this.ship4.scale = 0.5;
        this.ship4.setSpeed(game.settings.spaceshipSpeed * 2);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

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
        this.scoreConfiga = {
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
            borderUISize + borderPadding * 2, this.p1Score, this.scoreConfiga);

        this.p2Score = 0;/*
        let scoreConfigb = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding:{
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        }*/
        this.scoreConfiga.align = 'left';
        this.scoreRight = this.add.text(borderUISize * 15 + borderPadding,
            borderUISize + borderPadding * 2, this.p2Score, this.scoreConfiga);

        // Timer
        this.gameTime = game.settings.gameTimer / 1000;
        this.speedTimer = 30;
        this.scoreConfiga.align = 'center';
        this.timeLeft = this.add.text(borderUISize * 8 + borderPadding,
            borderUISize + borderPadding * 2, this.gameTime, this.scoreConfiga);
        this.scoreConfiga.fixedWidth = 0;
        this.timer = 0;

        
        // Invisible game over text
        this.gover = this.add.text(game.config.width/2, game.config.height/2 - 64, 
            'GAME OVER', this.scoreConfiga).setOrigin(0.5);
        this.gover.alpha = 0;

        this.resetti = this.add.text(game.config.width/2, game.config.height/2, 
            '(F)ire to Restart, or\nSHIFT to return to menu', this.scoreConfiga).setOrigin(0.5);
        this.resetti.alpha = 0;

        this.pawin = this.add.text(game.config.width/2, game.config.height/2 + 64,  
            'Player 1 wins!', this.scoreConfiga).setOrigin(0.5);
        this.pawin.alpha = 0;

        this.pbwin = this.add.text(game.config.width/2, game.config.height/2 + 64, 
            'Player 2 wins!', this.scoreConfiga).setOrigin(0.5);
        this.pbwin.alpha = 0;

        this.pdraw = this.add.text(game.config.width/2, game.config.height/2 + 64,  
            'Draw!', this.scoreConfiga).setOrigin(0.5);
        this.pdraw.alpha = 0;
        
        console.log("Who the hell orered all this goddamn crazy bread?");
    }

    // Thanks to https://gamedev.stackexchange.com/questions/182242/phaser-3-how-to-trigger-an-event-every-1-second
    // for this update function tip
    update(time, delta) {
        // Restart functionality
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)){
            this.gameOver = false;
            this.gover.alpha = 0;
            this.resetti.alpha = 0;
            this.pawin.alpha = 0;
            this.pbwin.alpha = 0;
            this.pdraw.alpha = 0;
            this.scene.restart();
        }
        else if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySHIFT)){
            this.gameOver = false;
            this.scene.start('menuScene')
        }

        // Starfield scrolling
        this.starfield.tilePositionX -= starSpeed;

        this.starsfast.tilePositionX -= starSpeed * 2;
        this.starsslow.tilePositionX -= starSpeed / 2;

        if(!this.gameOver){
            // update rocket
            this.p1Rocket.update();
            this.p2Rocket.update();
            
            // update ships
            this.ship1.update();
            this.ship2.update();
            this.ship3.update();
            this.ship4.update();

            // update timer here.
            this.timer += delta;
            while(this.timer >= 1000){
                this.gameTime -= 1;
                this.timeLeft.text = this.gameTime;
                this.timer -= 1000;
                if(this.speedTimer <= 0){
                    this.ship1.setSpeed(game.settings.spaceshipSpeed * 2);
                    this.ship2.setSpeed(game.settings.spaceshipSpeed * 2);
                    this.ship3.setSpeed(game.settings.spaceshipSpeed * 2);
                    this.ship4.setSpeed(game.settings.spaceshipSpeed * 4);
                }
                else{
                    this.speedTimer--;
                }
                if(this.gameTime <= 0){
                    this.gover.alpha = 1;
                    this.resetti.alpha = 1;
                    if(this.p1Score > this.p2Score){
                        this.pawin.alpha = 1;
                    }
                    else if(this.p1Score == this.p2Score){
                        this.pdraw.alpha = 1;
                    }
                    else{
                        this.pbwin.alpha = 1;
                    }
                    this.gameOver = true;
                }
            }

            // Check collisions
            this.collisionChecklist(this.p1Rocket, this);
            this.collisionChecklist(this.p2Rocket, this);
        }
        
        
    }

    collisionChecklist(rocket, scene){
        if(this.checkCollision(rocket, this.ship3)){
            rocket.reset();
            this.shipExplode(this.ship3, rocket);
        }
        if(this.checkCollision(rocket, this.ship2)){
            rocket.reset();
            this.shipExplode(this.ship2, rocket);
        }
        if(this.checkCollision(rocket, this.ship1)){
            rocket.reset();
            this.shipExplode(this.ship1, rocket);
        }
        if(this.checkCollision(rocket, this.ship4)){
            rocket.reset();
            this.shipExplode(this.ship4, rocket);
        }
    }

    checkCollision(rocket, ship){
        // AABB collision checking
        if(rocket.x < ship.x + ship.width   && 
           rocket.x + rocket.width > ship.x &&
           rocket.y < ship.y + ship.height  &&
           rocket.height + rocket.y > ship.y &&
           ship.alpha > 0) {
               return true;
           }
        return false;
    }

    shipExplode(ship, rocket){
        // Hide ship
        ship.alpha = 0;

        // Create boom on ship spot. Recycle ship
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0.5,0.5);
        if(ship.scale == 0.5){
            boom.scale = 0.5;
        }
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        // Score update
        if(rocket.getPlayer() == 1){
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score;
        }
        else{
            this.p2Score += ship.points;
            this.scoreRight.text = this.p2Score;
        }
        this.gameTime += 1;
        this.timeLeft.text = this.gameTime;

        // Your ears. Hand them over.
        this.sound.play('sfx_explosion');

    }
}