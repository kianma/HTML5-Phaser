let loadingScene = new Phaser.Scene('Loading');

loadingScene.preload = function(){
	let logo = this.add.sprite(this.sys.game.config.width/2, 250, 'logo');
	let bgBar = this.add.graphics();
	let barWidth = 250;
	let barHeight = 30;

	bgBar.setPosition(this.sys.game.config.width/2 - barWidth/2, this.sys.game.config.height/2 - barHeight/2);
	bgBar.fillStyle(0xF5F5F5, 1);
	bgBar.fillRect(0,0,barWidth, barHeight);

	let progressBar = this.add.graphics();
	progressBar.setPosition(this.sys.game.config.width/2 - barWidth/2, this.sys.game.config.height/2 - barHeight/2);

	this.load.on('progress', function(value){
		progressBar.clear();
		progressBar.fillStyle(0x9AD98D, 1);
		progressBar.fillRect(0, 0, value * barWidth, barHeight);
	}, this);

	// load assets
	this.load.image('backyard', 'assets/images/backyard.png');
	this.load.image('apple', 'assets/images/apple.png');
	this.load.image('candy', 'assets/images/candy.png');
	this.load.image('rotate', 'assets/images/rotate.png');
	this.load.image('toy', 'assets/images/rubber_duck.png');

	// Spritesheet
	this.load.spritesheet('pet', 'assets/images/pet.png', {
		frameWidth: 97,
		frameHeight: 83,
		margin: 1,
		spacing: 1
	});

	// TESTING ONLY
	for (let i = 0; i< 100; i++){
		this.load.image('test' + i, 'assets/images/candy.png');
	}
};

loadingScene.create = function(){
	this.anims.create({
		key: 'funnyfaces',
		frames: this.anims.generateFrameNames('pet', {frames: [1, 2, 3]}),
		frameRate: 7,
		yoyo: true,
		repeat: 0 // -1: repeat forever
	});

	this.scene.start('Home');
};
