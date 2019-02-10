import 'phaser';

export default class Portal extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y){
        super(scene, x, y, 'portal');
        this.scene = scene;

        // Enable physics
        this.scene.physics.world.enable(this);

        //Add portal to scene
        this.scene.add.existing(this);
    }
}