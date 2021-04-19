class MiniRocket extends Spaceship {
    constructor (scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame, pointValue);

        this.moveSpeed = game.settings.moveSpeed * 2;
        this.displayWidth = this.displayWidth / 3;
    }

    reset() {
        super.reset();
    }
    
    update() {
        super.update();
    }
}