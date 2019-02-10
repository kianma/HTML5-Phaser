import 'phaser';
import Player from '../Sprites/Player';
import Portal from '../Sprites/Portal';
import Coins from '../Groups/Coins';
import Enemies from '../Groups/Enemies';
import Bullets from '../Groups/Bullets';

export default class GameScene extends Phaser.Scene 
{
    constructor(key){
        super(key);
    }

    init(data)
    {
        this._LEVEL = data.level;
        this._LEVELS = data.levels;
        this._NEWGAME = data.newGame;
        this.loadingLevel = false;
        if(this._NEWGAME){
            this.events.emit('newGame');
        }
    }

    create()
    {
        // Listen for resize event
        this.events.on('resize', this.resize, this);

        // Player input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.createMap();

        //create player
        this.createPlayer();        

        // Create portal
        this.createPortal();

        // Create coins
        this.coins = this.map.createFromObjects('Coins', 'Coin',{
            key: 'coin'
        });
        this.coinsGroup = new Coins(this.physics.world, this, [], this.coins);

        // Create Enemies
        this.enemies = this.map.createFromObjects('Enemies', 'Enemy', {});
        this.enemiesGroup = new Enemies(this.physics.world, this, [], this.enemies);

        // Create Bullets
        this.bullets = new Bullets(this.physics.world, this, []);

        // Add collision
        this.addCollisions();

        // Update camera
        this.cameras.main.startFollow(this.player);
    }

    update()
    {
        this.player.update(this.cursors);

        if(Phaser.Input.Keyboard.JustDown(this.spaceKey))
        {
            this.bullets.fireBullet(this.player.x, this.player.y, this.player.direction);
        }
    }

    addCollisions()
    {
        this.physics.add.collider(this.player, this.blockedLayer);
        this.physics.add.collider(this.enemiesGroup, this.blockedLayer);
        this.physics.add.overlap(this.player, this.enemiesGroup, this.player.enemyCollision.bind(this.player));
        this.physics.add.overlap(this.player, this.portal, this.loadNextLevel.bind(this, false));
        this.physics.add.overlap(this.coinsGroup, this.player, this.coinsGroup.collectCoin.bind(this.coinsGroup));
        this.physics.add.overlap(this.bullets, this.enemiesGroup, this.bullets.enemyCollision);
    }

    createPlayer()
    {
        this.map.findObject('Player', (obj)=> {
            if(this._NEWGAME && this._LEVEL ===1){
                if (obj.type === 'StartingPosition'){
                    this.player = new Player(this, obj.x, obj.y);
                }
            }
            else {
                this.player = new Player(this, obj.x, obj.y);
            }
            
        });
    }

    createPortal()
    {
        this.map.findObject('Portal', (obj)=> {
            if(this._LEVEL === 1)
            {
                this.portal = new Portal(this, obj.x, obj.y - 68);
            }
            else if( this._LEVEL === 2)
            {
                this.portal = new Portal(this, obj.x, obj.y + 70);
            }
        });
    }

    resize(width, height)
    {
        if(width === undefined){
            width = this.sys.game.config.width;
        }
        if(height === undefined){
            height = this.sys.game.config.height;
        }

        this.cameras.resize(width, height);
    }

    createMap()
    {
        // Add water background
        this.add.tileSprite(0, 0, 8000, 8000, 'RPGpack_sheet', 31);

        // create tilemap
        this.map = this.make.tilemap({
            key: this._LEVELS[this._LEVEL]
        });

        // add tileset image
        this.tiles = this.map.addTilesetImage('RPGpack_sheet');

        // Create our layers
        this.backgroundLayer = this.map.createStaticLayer('Background', this.tiles, 0, 0);
        this.blockedLayer = this.map.createStaticLayer('Blocked', this.tiles, 0, 0);
        this.blockedLayer.setCollisionByExclusion(-1);
    }

    loadNextLevel(endGame)
    {
        if(!this.loadingLevel)
        {
            this.cameras.main.fade(500, 0, 0, 0);
            this.cameras.main.on('camerafadeoutcomplete', ()=>{
                if(endGame)
                {
                    this.scene.restart({
                        level: 1,
                        levels: this._LEVELS,
                        newGame: true
                    });
                }
                else if(this._LEVEL === 1)
                {
                    this.scene.restart({
                        level: 2,
                        levels: this._LEVELS,
                        newGame: false
                    });
                }
                else if( this._LEVEL === 2)
                {
                    this.scene.restart({
                        level: 1,
                        levels: this._LEVELS,
                        newGame: false
                    });
                }
            });
            this.loadingLevel = true;
        }
    }
}