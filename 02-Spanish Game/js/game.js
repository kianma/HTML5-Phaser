// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {

	// Word database
	this.words = [
		{
			key: 'building',
			setXY:{
				x: 100,
				y:240
			},
			spanish: 'edificio'
		},
		{
			key: 'house',
			setXY:{
				x: 240,
				y: 280
			},
			setScale: 0.8,
			spanish: 'casa'
		},
		{
			key: 'car',
			setXY:{
				x: 400,
				y: 300
			},
			setScale: 0.8,
			spanish: 'automovil'
		},
		{
			key: 'tree',
			setXY:{
				x: 550,
				y: 250
			},
			spanish: 'arbol'
		}
	]
}

// load asset files for our game
gameScene.preload = function() {
	// Images
	this.load.image('background','assets/images/background-city.png');
	this.load.image('building','assets/images/building.png');
	this.load.image('car','assets/images/car.png');
	this.load.image('house','assets/images/house.png');
	this.load.image('tree','assets/images/tree.png');

	// Sounds
	this.load.audio('treeSnd', 'assets/audio/arbol.mp3');
	this.load.audio('carSnd', 'assets/audio/auto.mp3');
	this.load.audio('houseSnd', 'assets/audio/casa.mp3');
	this.load.audio('buildingSnd', 'assets/audio/edificio.mp3');
	this.load.audio('rightSnd', 'assets/audio/correct.mp3');
	this.load.audio('wrongSnd', 'assets/audio/wrong.mp3');
};

// executed once, after assets were loaded
gameScene.create = function() {
	// Load background
	let bg = this.add.sprite(0,0,'background').setOrigin(0,0);
	
	// Setting interactive sprite
	// bg.setInteractive();
	// bg.on('pointerdown', function(pointer){
	// 	console.log('click');
	// })


	// Load sprites in a group
	this.items = this.add.group(this.words);

	let items = this.items.getChildren();

	for (let i=0; i < items.length; i++){
	// Phaser.Actions.Call(this.items.getChildren(), function(item){

		let item = items[i];
		// Make sprites interactive
		item.setInteractive();

		// Create tweens
		item.rightTween = this.tweens.add({
			targets: item,
			scaleX: 1.5,
			scaleY: 1.5,
			duration: 300,
			paused: true,
			yoyo: true,
			ease: 'Quad.easeInOut'
		});

		item.wrongTween = this.tweens.add({
			targets: item,
			scaleX: 1.5,
			scaleY: 1.5,
			duration: 300,
			angle: 90,
			paused: true,
			yoyo: true,
			ease: 'Quad.easeInOut'
		});

		item.alphaTween = this.tweens.add({
			targets: item,
			alpha: 0.7,
			duration: 300,
			paused: true
		});

		// EventListeners
		item.on('pointerdown', function(pointer){
			// result check
			let result = this.processAnswer(this.words[i].spanish);

			if (result){
				item.rightTween.restart();
			}
			else {
				item.wrongTween.restart();
			}
			

			// show question
			this.showNextQuestion();
		}, this);

		item.on('pointerover', function(pointer){
			item.alphaTween.restart();
		}, this);

		item.on('pointerout', function(pointer){
			item.alphaTween.stop();
			item.alpha = 1;
		}, this);

		// Sounds
		this.words[i].sound = this.sound.add(this.words[i].key + 'Snd');
	}

	// Text
	this.wordText = this.add.text(30, 20, '', {
		font: '28px Open Sans',
		fill: '#fff'
	});

	// Sounds
	this.rightSnd = this.sound.add('rightSnd');
	this.wrongSnd = this.sound.add('wrongSnd');

	// show questions
	this.showNextQuestion();
};

// Show question
gameScene.showNextQuestion = function(){
	// Select random word
	this.nextWord = Phaser.Math.RND.pick(this.words);

	// Play sound
	this.nextWord.sound.play();

	// Show Spanish Text
	this.wordText.setText(this.nextWord.spanish);
};

gameScene.processAnswer = function(userResponse){
	// Compare user response with user response
	if(userResponse === this.nextWord.spanish){

		this.rightSnd.play();
		return true;
	}
	else{

		this.wrongSnd.play();
		return false;
	}
};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: 'Spanish Learning Game',
  pixelArt: false,
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
