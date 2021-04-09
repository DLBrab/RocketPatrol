// Adds innocent spaceships that were minding their own business to massacre
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        // add to scene
        scene.add.existing(this);
        this.moveSpeed = 3;
    }
    
    reset(){
        this.x = game.config.width;
        this.alpha = 1;
    }

    update(){
        this.x -= this.moveSpeed;

        if(this.x < this.width) {
            this.reset()
        }
    }
}