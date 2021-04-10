// Player Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        // add to scene
        scene.add.existing(this);
        this.sfxRocket = scene.sound.add('sfx_rocket');
        this.isFiring = false;
        this.moveSpeed = game.settings.playerSpeed;
    }
    
    update () {
        // LR Movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width){
                this.x -= this.moveSpeed;
            }
            if(keyRIGHT.isDown&& this.x <= game.config.width - borderUISize - this.width){
                this.x += this.moveSpeed;
            }
        }

        // Fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;

            // cute blip?
            this.sfxRocket.play();
        }

        // Move up when fired
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding){
            this.y -= this.moveSpeed;
        }

        // Reset on miss
        if(this.y < borderUISize * 3 + borderPadding){
            this.reset();
        }
    }

    // Reset rocket to ground
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}