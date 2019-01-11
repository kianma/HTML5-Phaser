// Create new scene
let gameScene = new Phaser.Scene('Game');

// Initialize
gameScene.init = function() {
	this.playerSpeed = 3;
	this.enemyMinSpeed = 1;
	this.enemyMaxSpeed = 3;

	// Enemy bounds
	this.enemyMinY = 80;
	this.enemyMaxY = 280;

	this.isTerminating = false;
};

// Preloader
gameScene.preload = function() {
	this.load.image('background', 'assets/background.png');
	this.load.image('player', 'assets/player.png');
	this.load.image('dragon', 'assets/dragon.png');
	this.load.image('treasure', 'assets/treasure.png');
};

// Create
gameScene.create = function() {
	// Background
	let bg = this.add.sprite(0, 0, 'background');
//	bg.setOrigin(0, 0); // change origin

	// game sizes
	let gameWidth = this.sys.game.config.width;
	let gameHeight = this.sys.game.config.height;
	bg.setPosition(gameWidth / 2, gameHeight / 2); // change position

	// Player
	this.player = this.add.sprite(40, gameHeight / 2, 'player');

	// Setting the Scale
	this.player.setScale(0.5);
//	this.player.scaleX=1;
//	this.player.scaleY=1;
//	this.player.displayWidth=100; // Pixels
//	this.player.displayHeight=100; // Pixels

	// Dragons
	this.dragons = this.add.group({
		key: 'dragon',
		repeat: 5,
		setXY: {
			x: 80,
			y: 100,
			stepX: 85,
			stepY: 20
		}
	});

//	this.dragon = this.add.sprite(120, gameHeight / 2, 'dragon');

	// Flipping the sprite
//	this.dragon.flipX = true;
//	this.dragon.flipY = false;

	// Rotating the sprite
//	this.dragon.setAngle(45);
//	this.dragon.angle = 45;
//	this.dragon.rotation = Math.PI / 4;
//	this.dragon.setRotation(Math.PI / 4);

//	this.dragons.add(this.dragon);
	Phaser.Actions.ScaleXY(this.dragons.getChildren(), -0.5, -0.5);

	Phaser.Actions.Call(this.dragons.getChildren(), function(dragon) {
		dragon.flipX = true;

		// Enemy speed
		let dir = Math.random() < 0.5 ? 1 : -1; // random direction
		let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
		dragon.speed = dir * speed;
	}, this);

	// Treasure
	this.treasure = this.add.sprite(gameWidth - 80, gameHeight / 2, 'treasure');
	this.treasure.setScale(0.6);
};

// Update -> called up to 60x/sec
gameScene.update = function() {
	// Make player grow
//	if (this.player.scaleX < 2)
//	{
//		this.player.scaleX += 0.01;
//		this.player.scaleY += 0.01;
//	}
	// Do not execute on game over
	if (this.isTerminating)
	{
		return;
	}

	// Move player
	if (this.input.activePointer.isDown)
	{
		this.player.x += this.playerSpeed;
	}

	// Collision check
	let playerRect = this.player.getBounds();
	let treasureRect = this.treasure.getBounds();

	if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect))
	{
		console.log("goal");

		// Restart the scene
//		this.scene.manager.bootScene(this);
		this.scene.restart();
		return;
	}

	let dragons = this.dragons.getChildren();
	let numDragons = dragons.length;

	for (let i = 0; i < numDragons; i++)
	{
		// Move enemies
		dragons[i].y += dragons[i].speed;

		let conditionUp = dragons[i].speed < 0 && dragons[i].y <= this.enemyMinY;
		let conditionDown = dragons[i].speed > 0 && dragons[i].y >= this.enemyMaxY;

		if (conditionUp || conditionDown)
		{
			dragons[i].speed *= -1;
		}

		// Check collision
		let dragonRect = dragons[i].getBounds();

		if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, dragonRect))
		{
			console.log("dead");

			// End Game
			return this.gameOver();
		}
	}
};

gameScene.gameOver = function() {
	// Game Over sequence
	this.isTerminating = true;

	// Cameras and Events
	this.cameras.main.shake(500);
	this.cameras.main.on('camerashakecomplete', function(camera, effect) {
		this.cameras.main.fade(500);
	}, this);

	this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
		return this.scene.restart();
	}, this);
};

// Set game configs
let config = {
	type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
	width: 640,
	height: 360,
	scene: gameScene
};

// Create new game, pass config
let game = new Phaser.Game(config);
