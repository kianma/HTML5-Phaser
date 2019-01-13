// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {

  // Game Stats


};

// load asset files for our game
gameScene.preload = function() {
  
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

};

// executed once, after assets were loaded
gameScene.create = function() {

  let bg = this.add.sprite(0,0, 'backyard');
  bg.setOrigin(0,0);

  // Pet
  this.pet = this.add.sprite(100, 200, 'pet', 0);

  // Buttons
  this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
  this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
  this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
  this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();

  this.createUi();
  
};

// UI
gameScene.createUi = function(){
   // Buttons
   this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
   this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
   this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
   this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
}

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: gameScene,
  title: 'Virtual Pet',
  pixelArt: false,
  backgroundColor: 'ffffff'
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
