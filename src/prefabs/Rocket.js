// Player Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, frame);

        // add to scene
        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;
    }

    reset() {
        this.y = game.config.height-borderUISize-borderPadding;
        this.isFiring = true;
    }
    
    update () {
        // LR movement
        if (this.isFiring) {
            this.y -= this.moveSpeed;
            if(this.y < borderUISize * 2) {
                this.reset()
            }
        }
        else {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width){
                this.x -= this.moveSpeed;
            }
            if(keyRIGHT.isDown&& this.x <= game.config.width - borderUISize - this.width){
                this.x += this.moveSpeed;
            }
            if(Phaser.Input.Keyboard.JustDown(keySpace)) {
                this.isFiring = true;

            }
        }
    }
}