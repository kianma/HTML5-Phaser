import 'phaser';

export default class UIScene extends Phaser.Scene 
{
    constructor(){
        super({
            key: 'UI',
            active: true
        });
    }

    init()
    {
        this.coinsCollected = 0;
    }

    create()
    {
        // Create score
        this.scoreText = this.add.text(12, 12, `Score: ${this.coinsCollected}`, {
            fontSize: '32px',
            fill: '#FFF'
        });
    
        // Create health
        this.healthText = this.add.text(12, 50, `Health: 3`, {
            fontSize: '32px',
            fill: '#FFF'
        });

        // Get a reference to game scene
        this.gameScene = this.scene.get('Game');

        this.gameScene.events.on('coinCollected', ()=>{
            this.scoreText.setText(`Score: ${++this.coinsCollected}`);
        });

        this.gameScene.events.on('loseHealth', (health)=>{
            this.healthText.setText(`Health: ${health}`);
        });

        this.gameScene.events.on('newGame', ()=>{
            this.coinsCollected = 0;
            this.scoreText.setText(`Score: ${this.coinsCollected}`);
            this.healthText.setText(`Health: 3`);
        });
    }
}