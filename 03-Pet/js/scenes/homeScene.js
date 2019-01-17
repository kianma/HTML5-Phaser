let homeScene = new Phaser.Scene('Home');

homeScene.create = function(){
	let bg = this.add.sprite(0, 0, 'backyard').setInteractive();
	bg.setOrigin(0, 0);

	let gameWidth = this.sys.game.config.width;
	let gameHeight = this.sys.game.config.height;

	let text = this.add.text(gameWidth/2, gameHeight/2, 'VIRTUAL PET', {
		font: '40px Arial',
		fill: '#FFFFFF'
	});
	text.setOrigin(0.5);
	text.depth = 1;

	let textBG = this.add.graphics();
	textBG.fillStyle(0x000000, 0.7);
	textBG.fillRect(gameWidth/2 - text.width/2 - 10, gameHeight/2 - text.height/2 - 10, text.width +20, text.height + 20);

	bg.on('pointerdown', function(){
		this.scene.start('Game');
	}, this);
};
