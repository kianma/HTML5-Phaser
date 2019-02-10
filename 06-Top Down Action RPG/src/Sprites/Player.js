import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y){
        super(scene, x, y, 'characters', 325);
        this.scene = scene;

        this.health = 3;
        this.hitDelay = false;
        this.direction = 'up';

        // Enable physics
        this.scene.physics.world.enable(this);

        //Add player to scene
        this.scene.add.existing(this);
        this.setScale(4);
    }

    update(cursors)
    {
        this.setVelocity(0);
        if(cursors.up.isDown)
        {
            this.direction = 'up';
            this.setVelocityY(-150);
        }
        else if (cursors.down.isDown)
        {
            this.direction = 'down';
            this.setVelocityY(150);
        }
        
        if(cursors.left.isDown)
        {
            this.direction = 'left';
            this.setVelocityX(-150);
        }
        else if (cursors.right.isDown)
        {
            this.direction = 'right';
            this.setVelocityX(150);
        }
    }

    loseHealth()
    {
        this.health--;
        this.scene.events.emit('loseHealth', this.health);
        if(this.health === 0)
        {
            this.scene.loadNextLevel(true);
        }
    }

    enemyCollision(player, enemy)
    {
        if(!this.hitDelay){
            this.loseHealth();
            this.hitDelay = true;
            this.tint = 0xFF0000;
            this.timeEvent = this.scene.time.addEvent({
                delay: 1200,
                callback: ()=>{
                    this.hitDelay = false;
                    this.tint = 0xFFFFFF;
                },
                callbackScope: this
            });
        }
    }
}