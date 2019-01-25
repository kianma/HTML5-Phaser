// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
	// Player params
	this.playerSpeed = 150;
	this.jumpSpeed = -600;
};

// load asset files for our game
gameScene.preload = function() {

	// load images
	this.load.image('ground', 'assets/images/ground.png');
	this.load.image('platform', 'assets/images/platform.png');
	this.load.image('block', 'assets/images/block.png');
	this.load.image('goal', 'assets/images/gorilla3.png');
	this.load.image('barrel', 'assets/images/barrel.png');

	// load spritesheets
	this.load.spritesheet('player', 'assets/images/player_spritesheet.png', {
		frameWidth: 28,
		frameHeight: 30,
		margin: 1,
		spacing: 1
	});

	this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', {
		frameWidth: 20,
		frameHeight: 21,
		margin: 1,
		spacing: 1
	});

	this.load.json('levelData', 'assets/json/levelData.json')
};

// executed once, after assets were loaded
gameScene.create = function() {
	// Anims
	this.anims.create({
		key: 'walking',
		frames: this.anims.generateFrameNames('player', {
			frames: [0, 1, 2]
		}),
		frameRate: 12,
		yoyo: true,
		repeat: -1
	});

	this.anims.create({
		key: 'burning',
		frames: this.anims.generateFrameNames('fire', {
			frames: [0, 1]
		}),
		frameRate: 4,
		repeat: -1
	});

	this.physics.world.bounds.width = 360;
	this.physics.world.bounds.height = 700;

	// Sprite Creation
	this.setupLevel();

	// Collision detection
	this.physics.add.collider(this.player, this.platforms);
	this.physics.add.collider(this.goal, this.platforms);

	// Enable cursor keys
	this.cursors = this.input.keyboard.createCursorKeys();

};

gameScene.update = function() {
	let onGround = this.player.body.blocked.down || this.player.body.touching.down;

	// Walk
	if (this.cursors.left.isDown)
	{
		this.player.body.setVelocityX(-this.playerSpeed);

		this.player.flipX = false;

		if (onGround && !this.player.anims.isPlaying)
		{
			this.player.anims.play('walking');
		}
	}
	else if (this.cursors.right.isDown)
	{
		this.player.body.setVelocityX(this.playerSpeed);

		this.player.flipX = true;

		if (onGround && !this.player.anims.isPlaying)
		{
			this.player.anims.play('walking');
		}
	}
	else
	{
		this.player.body.setVelocityX(0);

		this.player.anims.stop('walking');
		if (onGround)
		{
			this.player.setFrame(3);
		}
	}

	// Jump
	if (onGround && (this.cursors.space.isDown || this.cursors.up.isDown))
	{
		this.player.body.setVelocityY(this.jumpSpeed);

		this.player.anims.stop('walking');
		if (onGround)
		{
			this.player.setFrame(2);
		}
	}
};

gameScene.setupLevel = function() {
	this.levelData = this.cache.json.get('levelData');

	// Add Sprites to Physics
	this.platforms = this.add.group();
	for (let i = 0; i < this.levelData.platforms.length; i++)
	{
		let curr = this.levelData.platforms[i];
		let newObj;

		if (curr.numTiles === 1)
		{
			newObj = this.add.sprite(curr.x, curr.y, curr.key).setOrigin(0);
		}
		else
		{
			let width = this.textures.get(curr.key).get(0).width;
			let height = this.textures.get(curr.key).get(0).height;
			newObj = this.add.tileSprite(curr.x, curr.y, curr.numTiles * width, height, curr.key).setOrigin(0);
		}

		// Enable physics
		this.physics.add.existing(newObj, true);

		this.platforms.add(newObj);
	}

	this.fires = this.add.group();
	for (let i = 0; i < this.levelData.fires.length; i++)
	{
		let curr = this.levelData.fires[i];
		let newObj;

		newObj = this.add.sprite(curr.x, curr.y, 'fire').setOrigin(0);

		// Enable physics
		this.physics.add.existing(newObj);
		newObj.body.allowGravity = false;
		newObj.body.immovable = true;

		newObj.anims.play('burning');

		this.fires.add(newObj);
	}

	// Player
	this.player = this.add.sprite(this.levelData.player.x, this.levelData.player.y, 'player', 3);
	this.physics.add.existing(this.player);
	this.player.body.setCollideWorldBounds(true);

	// Goal
	this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
	this.physics.add.existing(this.goal);
};

// our game's configuration
let config = {
	type: Phaser.AUTO,
	width: 360,
	height: 640,
	scene: gameScene,
	title: 'Monster Kong',
	pixelArt: false,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 1000},
			debug: true
		}
	}
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
