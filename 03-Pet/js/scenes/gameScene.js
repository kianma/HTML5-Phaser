// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {

	// Game Stats
	this.stats = {
		health: 100,
		fun: 100
	};

	// Decay Stats
	this.decayRates = {
		health: -5,
		fun: -2
	};
};


// executed once, after assets were loaded
gameScene.create = function() {

	let bg = this.add.sprite(0, 0, 'backyard').setInteractive();
	bg.setOrigin(0, 0);

	// BG Event listener
	bg.on('pointerdown', this.placeItem, this);

	// Pet
	this.pet = this.add.sprite(100, 200, 'pet', 0).setInteractive();
	this.pet.depth =1;

	// Make object draggable
	this.input.setDraggable(this.pet);
	this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
		gameObject.x = dragX;
		gameObject.y = dragY;
	});

	// Buttons
	this.createUi();

	this.createHud();
	this.refreshHud();
	this.timedEventStats = this.time.addEvent({
		delay: 1000,
		repeat: -1,
		callback: function(){
			this.updateStats(this.decayRates)
		},
		callbackScope: this
	});
};

// UI
gameScene.createUi = function() {
	// Buttons
	this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
	this.appleBtn.customStats = {health: 20, fun: 0};
	this.appleBtn.on('pointerdown', this.pickItem);

	this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
	this.candyBtn.customStats = {health: -10, fun: 10};
	this.candyBtn.on('pointerdown', this.pickItem);

	this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
	this.toyBtn.customStats = {health: 0, fun: 15};
	this.toyBtn.on('pointerdown', this.pickItem);

	this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
	this.rotateBtn.customStats = {fun: 20};
	this.rotateBtn.on('pointerdown', this.rotatePet);

	this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];

	this.uiBlocked = false;
	this.uiReady();
};

// Rotation
gameScene.rotatePet = function() {
	if (this.scene.uiBlocked) return;

	this.scene.uiReady();

	this.scene.uiBlocked = true;
	this.alpha = 0.5;

//	let scene = this.scene;
//	setTimeout(function(){
//		scene.uiReady();
//	}, 2000);

	let rotateTween = this.scene.tweens.add({
		targets: this.scene.pet,
		duration: 600,
		angle: 360,
		pause: false,
		callbackScope: this,
		onComplete: function(tween, sprites){
//			this.scene.stats.fun += this.customStats.fun;
			this.scene.updateStats(this.customStats);

			// UI Ready
			this.scene.uiReady();
		}
	});
};

// Pick Item
gameScene.pickItem = function() {
	if (this.scene.uiBlocked) return;

	this.scene.uiReady();

	this.scene.selectedItem = this;
	this.alpha = 0.5;
};

gameScene.placeItem = function(pointer, localX, localY) {
	if(!this.selectedItem) return;

	if(this.uiBlocked) return;

	// Create new item in clicked position
	let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key);

	// Block UI
	this.uiBlocked = true;

	// Pet movement
	let petTween = this.tweens.add({
		targets: this.pet,
		duration: 500,
		x: newItem.x,
		y: newItem.y,
		callbackScope: this,
		paused: false,
		onComplete: function(tweens, sprites) {
			//Destroy item
			newItem.destroy();

			this.pet.on('animationcomplete', function(){
				this.pet.setFrame(0);
				this.uiReady();
			}, this);

			//Play Animation
			this.pet.play('funnyfaces');

			this.updateStats(this.selectedItem.customStats);
		}
	});
};

// UI Ready
gameScene.uiReady = function() {
	this.scene.selectedItem = null;

	for (let i = 0; i < this.buttons.length; i++)
	{
		this.buttons[i].alpha = 1;
	}

	this.uiBlocked = false;
};

// HUD
gameScene.createHud = function(){
	this.healthText = this.add.text(20,20, 'Health: ', {
		font: '24px Arial',
		fill: '#fff'
	});

	this.funText = this.add.text(170,20, 'Fun: ', {
		font: '24px Arial',
		fill: '#fff'
	});
};

// Refresh UI
gameScene.refreshHud = function(){
	this.healthText.setText('Health: ' + this.stats.health);
	this.funText.setText('Fun: ' + this.stats.fun);
};

// Update stats
gameScene.updateStats = function(statDiff){
	// Stats
//	this.stats.health += this.selectedItem.customStats.health;
//	this.stats.fun += this.selectedItem.customStats.fun;

	let isGameOver = false;

	for (stat in statDiff){
		if(statDiff.hasOwnProperty(stat)){
			this.stats[stat] += statDiff[stat];
		}

		if (this.stats[stat] < 0){
			isGameOver = true;
			this.stats[stat] = 0;
		}
	}

	this.refreshHud();
	if(isGameOver)
		this.gameOver();
};

gameScene.gameOver = function(){
	this.uiBlocked = true;

	this.pet.setFrame(4);

	this.time.addEvent({
		delay: 2000,
		repeat: 0,
		callback: function() {
			this.scene.start('Home');
		},
		callbackScope: this
	});
};
