// Player Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, frame);

        // add to scene
        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;
    }

    update () {
        // LR movement
        if(!this.isFiring){
            if(keyLEFT.isDown && this.x >= borderUISize + this.width){
                this.x -= this.moveSpeed;
            }
            if(keyRIGHT.isDown&& this.x <= game.config.width - borderUISize - this.width){
                this.x += this.moveSpeed;
            }
        }
    }
}