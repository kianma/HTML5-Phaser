import 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, frame){
        super(scene, x, y, 'characters', frame);
        this.scene = scene;

        this.health = 3;

        // Enable physics
        this.scene.physics.world.enable(this);

        //Add player to scene
        this.scene.add.existing(this);
        this.setScale(4);

        // move enemy
       this.timeEvent = this.scene.time.addEvent({
            delay: 3000,
            callback: this.move,
            loop: true,
            callbackScope: this
        });
    }

    loseHealth()
    {
        this.health--;
        this.tint = 0xFF0000;
        if(this.health === 0)
        {
            this.timeEvent.destroy();
            this.destroy();
        }
        else
        {
            this.scene.time.addEvent({
                delay: 200,
                callback: ()=>{
                    this.tint = 0xFFFFFF;
                }
            });
        }
    }

    move()
    {
        const randNum = Math.floor((Math.random()*4) + 1);
        switch (randNum)
        {
            case 1:
                this.setVelocityX(100);
                break;
            case 2:
                this.setVelocityX(-100);
                break;
            case 3:
                this.setVelocityY(100);
                break;
            case 4:
                this.setVelocityY(-100);
                break;
            default: 
                this.setVelocityX(100)
        }

        this.scene.time.addEvent({
            delay: 500,
            callback: ()=>{
                this.setVelocity(0);
            },
            callbackScope: this
        });
    }
}