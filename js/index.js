import * as PHASER from './phaser.min.js';
import config from './Config/config.js';
import BootScene from './Scenes/BootScene.js';
import PreloaderScene from './Scenes/PreloaderScene.js';
import TitleScene from './Scenes/TitleScene.js';
import OptionsScene from './Scenes/OptionsScene.js';
import CreditsScene from './Scenes/CreditsScene.js';
import GameScene from './Scenes/GameScene.js';
import Model from './Model.js';

/*
 * source : https://www.emanueleferonato.com/2019/01/23/html5-endless-runner-built-with-phaser-and-arcade-physics-step-5-adding-deadly-frog-being-kind-with-players-by-setting-its-body-smaller-than-the-image/
 */
let score = 0;
let bestScore = localStorage.getItem('bestScore') | 0;
let scoreText, bestScoreText;
let game;

localStorage.setItem('bestScore', bestScore);

let gameOptions = {
    // Bonus is unlocked ?
    bonus: (localStorage.getItem('bonus'))? localStorage.getItem('bonus') : false,

    // background speed, in pixels per second
    backgroundSpeed: 80,

    // platform speed range, in pixels per second
    platformSpeedRange: [300, 300],

    // spawn range, how far should be the rightmost platform from the right edge
    // before next platform spawns, in pixels
    spawnRange: [80, 300],

    // platform width range, in pixels
    platformSizeRange: [90, 300],

    // a height range between rightmost platform and next platform to be spawned
    platformHeightRange: [-5, 5],

    // a scale to be multiplied by platformHeightRange
    platformHeighScale: 20,

    // platform max and min height, as screen height ratio
    platformVerticalLimit: [0.4, 0.8],

    // player starting X position
    playerStartPosition: 200,

    // player gravity
    playerGravity: 900,

    // player jump force
    jumpForce: 400,

    // consecutive jumps allowed
    jumps: 2,

    // % of probability a robinet appears on the platform
    robPercent: 50,

    // % of probability a frog appears on the platform
    frogPercent: 0,

    // % of probability a seahorse appears on the platform
    seahorsePercent: 0
}

class Game extends Phaser.Game {
    constructor () {
      super(config);
      const model = new Model();
      this.globals = { model, bgMusic: null };
      this.scene.add('Boot', BootScene);
      this.scene.add('Preloader', PreloaderScene);
      this.scene.add('Title', TitleScene);
      this.scene.add('Options', OptionsScene);
      this.scene.add('Credits', CreditsScene);
      this.scene.add('Game', GameScene);
      this.scene.start('Boot');
    }
  }

  window.game = new Game();
/*
window.onload = function () {

    let gameConfig = {
        type: Phaser.AUTO,
        width: 1334,
        height: 750,
        scene: [preloadGame, homeScreen, playGame],
        backgroundColor: 0x0c88c7,
        physics: {
            default: "arcade"
        }
    }

    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
}

// preloadGame scene
class preloadGame extends Phaser.Scene {
    constructor() {
        super("PreloadGame");
    }
    preload() {
        this.load.path = "assets/";

        this.load.image("plombo", "ui/plombo_light_off.png");
        this.load.image("plombo_unlocked", "ui/plombo_light_on.png");
        this.load.image("platform", "game/platform.png");

        this.load.spritesheet("player", "game/plombo.png", {
            frameWidth: 64,
            frameHeight: 69
        });

        this.load.spritesheet("robinet", "game/robinet.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet("frog", "game/frog.png", {
            frameWidth: 51,
            frameHeight: 59
        });

        this.load.spritesheet("seahorse", "game/seahorse.png", {
            frameWidth: 50,
            frameHeight: 85
        });

        this.load.spritesheet("background", "game/background.png", {
            frameWidth: 384,
            frameHeight: 224
        })
    }
    create() {

        // setting player animation
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 2
            }),
            frameRate: 8,
            repeat: -1
        });

        //setting frog animation
        this.anims.create({
            key: "jumpingFrog",
            frames: this.anims.generateFrameNumbers("frog", {
                start: 0,
                end: 3
            }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: "idleFrog",
            frames: this.anims.generateFrameNumbers("frog", {
                start: 4,
                end: 6
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: "jumpingSeahorse",
            frames: this.anims.generateFrameNumbers("seahorse", {
                start: 0,
                end: 3
            }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.start("HomeScreen");
    }
}

// Home scene
class homeScreen extends Phaser.Scene {
    constructor() {
        super("HomeScreen");
    }
    create() {
        let titleText = this.add.text(0, 32, 'Run Plombo ! Run !', { fontSize: '60px', fill: '#000' });
        titleText.x = game.config.width / 2 - titleText.width / 2;

        let bestScoreText = this.add.text(0, 0, `Best Score: ${bestScore}`, { fontSize: '32px', fill: '#000' });
        bestScoreText.x = game.config.width / 2 - bestScoreText.width / 2;
        bestScoreText.y = titleText.y + titleText.height + 16;

        let plomboFace = this.add.image(0, 0, (gameOptions.bonus)? 'plombo_unlocked' : 'plombo').setInteractive();
        plomboFace.x = game.config.width / 2;
        plomboFace.y = plomboFace.height / 2 + bestScoreText.y + bestScoreText.height + 64;

        let bonusText = this.add.text(0, 0, (gameOptions.bonus)? 'Voir les bonus' : 'Bonus verrouillés', { fontSize: '60px', fill: '#fff' });
        bonusText.x = game.config.width / 2 - bonusText.width / 2;
        bonusText.y = plomboFace.y;
        bonusText.setInteractive(new Phaser.Geom.Rectangle(0, 0, bonusText.width, bonusText.height), Phaser.Geom.Rectangle.Contains);
        bonusText.alpha = 0;

        let startGameText = this.add.text(0, 0, 'Start', { fontSize: '60px', fill: '#000' });
        startGameText.x = game.config.width / 2 - startGameText.width / 2;
        startGameText.y = plomboFace.y + plomboFace.height + 16;
        startGameText.setInteractive(new Phaser.Geom.Rectangle(0, 0, startGameText.width, startGameText.height), Phaser.Geom.Rectangle.Contains);

        let creditsText = this.add.text(0, 0, 'Credits', { fontSize: '60px', fill: '#000' });
        creditsText.x = game.config.width / 2 - creditsText.width / 2;
        creditsText.y = startGameText.y + startGameText.height + 32;

        startGameText.on('pointerdown', () => this.scene.start('PlayGame'));

        this.input.on('pointerover', function (event, gameObjects) {
            if (gameObjects[0].texture.key === 'plombo' || gameObjects[0].texture.key === 'plombo_unlocked' ||
                gameObjects[0]._text === 'Voir les bonus' || gameObjects[0]._text === 'Bonus verrouillés') {
                bonusText.alpha = 1;
            }
        });

        this.input.on('pointerout', function (event, gameObjects) {
            if (gameObjects[0].texture.key === 'plombo' || gameObjects[0].texture.key === 'plombo_unlocked' ||
                gameObjects[0]._text === 'Voir les bonus' || gameObjects[0]._text === 'Bonus verrouillés') {
                bonusText.alpha = 0;
            }
        });
    }
    update() {

    }
}
// playGame scene
class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    create() {
        // the main background image
        let background = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "background", 2);
        background.displayWidth = game.config.width;
        background.displayHeight = game.config.height;

        // the score and best score
        scoreText = this.add.text(16, 16, `Score: ${score}`, { fontSize: '32px', fill: '#000' });
        bestScoreText = this.add.text(16, 16, `Best: ${bestScore}`, { fontSize: '32px', fill: '#000' });
        bestScoreText.x = game.config.width - bestScoreText.width - 16;

        // group with all active cities.
        this.cityGroup = this.add.group();

        // group with all active platforms.
        this.platformGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: platform => platform.scene.platformPool.add(platform)
        });

        // platform pool
        this.platformPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: platform => platform.scene.platformGroup.add(platform)
        });

        // group with all active robinets.
        this.robGroup = this.add.group({ removeCallback: robinet => robinet.scene.robPool.add(robinet) });

        // robinet pool
        this.robPool = this.add.group({ removeCallback: robinet => robinet.scene.robGroup.add(robinet) });

        // group with all active frogs.
        this.frogGroup = this.add.group({ removeCallback: frog => frog.scene.frogPool.add(frog) });

        // frog pool
        this.frogPool = this.add.group({ removeCallback: frog => frog.scene.frogGroup.add(frog) });

        // adding a city
        this.addCities()

        // keeping track of added platforms
        this.addedPlatforms = 0;

        // number of consecutive jumps made by the player so far
        this.playerJumps = 0;

        // adding a platform to the game, the arguments are platform width, x position and y position
        this.addPlatform(game.config.width, game.config.width / 2, game.config.height * gameOptions.platformVerticalLimit[1]);

        // adding the player;
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height * 0.7, "player");
        this.player.setGravityY(gameOptions.playerGravity);
        this.player.setDepth(2);

        // the player is not dying
        this.dying = false;

        // setting collisions between the player and the platform group
        this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function () {

            // play "run" animation if the player is on a platform
            if (!this.player.anims.isPlaying) {
                this.player.anims.play("run");
            }
        }, null, this);

        // setting collisions between the player and the robinet group
        this.physics.add.overlap(this.player, this.robGroup, this.collectRob, null, this);

        // setting collisions between the player and the frog group
        this.physics.add.overlap(this.player, this.frogGroup, function (player, frog) {

            this.dying = true;
            this.player.anims.stop();
            this.player.setFrame(3);
            this.player.body.setVelocityY(-200);
            this.physics.world.removeCollider(this.platformCollider);

        }, null, this);

        // checking for input
        this.input.on("pointerdown", this.jump, this);
    }

    // adding cities
    addCities() {
        let rightmostCity = this.getRightmostCity();
        if (rightmostCity < game.config.width * 2) {
            let city = this.physics.add.sprite(rightmostCity + Phaser.Math.Between(100, 350), game.config.height + Phaser.Math.Between(0, 100), "background");
            city.setOrigin(0.5, 1);
            city.body.setVelocityX(gameOptions.backgroundSpeed * -1)
            this.cityGroup.add(city);
            if (Phaser.Math.Between(0, 1)) {
                city.setDepth(1);
            }
            city.setFrame(Phaser.Math.Between(0, 1))
            this.addCities()
        }
    }

    // getting rightmost city x position
    getRightmostCity() {
        let rightmostCity = -200;
        this.cityGroup.getChildren().forEach(function (city) {
            rightmostCity = Math.max(rightmostCity, city.x);
        })
        return rightmostCity;
    }

    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY) {
        this.addedPlatforms++;
        let platform;
        if (this.platformPool.getLength()) {
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            let newRatio = platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else {
            platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

        // if this is not the starting platform...
        if (this.addedPlatforms > 1) {

            // is there a robinet over the platform?
            if (Phaser.Math.Between(1, 100) <= gameOptions.robPercent) {
                if (this.robPool.getLength()) {
                    let robinet = this.robPool.getFirst();
                    robinet.x = posX;
                    robinet.y = posY - 96;
                    robinet.alpha = 1;
                    robinet.active = true;
                    robinet.visible = true;
                    this.robPool.remove(robinet);
                }
                else {
                    let robinet = this.physics.add.sprite(posX, posY - 96, "robinet");
                    robinet.setImmovable(true);
                    robinet.setVelocityX(platform.body.velocity.x);
                    robinet.setDepth(2);
                    this.robGroup.add(robinet);
                }
            }

            // is there a frog over the platform?
            if (Phaser.Math.Between(1, 100) <= gameOptions.frogPercent) {
                if (this.frogPool.getLength()) {
                    let frog = this.frogPool.getFirst();
                    frog.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                    frog.y = posY - 46;
                    frog.alpha = 1;
                    frog.active = true;
                    frog.visible = true;
                    this.frogPool.remove(frog);
                }
                else {
                    let frog = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 46, "frog");
                    frog.setFlipX(true);
                    frog.setImmovable(true);
                    frog.setVelocityX(platform.body.velocity.x);
                    frog.setSize(8, 2, true)
                    frog.anims.play("idleFrog");
                    frog.setDepth(2);
                    this.frogGroup.add(frog);
                }
            }
        }
    }

    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    // and obviously if the player is not dying
    jump() {
        if ((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))) {
            if (this.player.body.touching.down) {
                this.playerJumps = 0;
            }
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            this.playerJumps++;

            // stops animation
            this.player.anims.stop();
        }
    }

    collectRob(player, robinet) {
        // add and update the score
        score++;
        scoreText.setText(`Score: ${score}`);

        // disable robinet
        this.robGroup.killAndHide(robinet);
        this.robGroup.remove(robinet);
    }

    update() {

        // game over
        if (this.player.y > game.config.height) {
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore);
            }

            if(bestScore > 10) {
                gameOptions.bonus = true;
                localStorage.setItem('bonus', gameOptions.bonus);
            }

            score = 0;
            gameOptions.robPercent = 50;
            gameOptions.frogPercent = 0;
            gameOptions.seahorsePercent = 0;

            this.scene.start("HomeScreen");
        }

        this.player.x = gameOptions.playerStartPosition;

        //Increasing difficulty
        if(score > 10 && score <= 20) {
            gameOptions.robPercent = 25;
            gameOptions.frogPercent = 12.5;
        }
        else if(score > 20 && score <= 30) {
            gameOptions.seahorsePercent = 12.5;
        }
        else if(score > 30) {
            gameOptions.frogPercent = 25;
            gameOptions.robPercent = 12.5;
        }

        // recycling platforms
        let minDistance = game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function (platform) {
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            if (platformDistance < minDistance) {
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if (platform.x < - platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // recycling robinets
        this.robGroup.getChildren().forEach(function (robinet) {
            if (robinet.x < - robinet.displayWidth / 2) {
                this.robGroup.killAndHide(robinet);
                this.robGroup.remove(robinet);
            }
        }, this);

        // recycling frog
        this.frogGroup.getChildren().forEach(function (frog) {
            if (frog.x < - frog.displayWidth / 2) {
                this.frogGroup.killAndHide(frog);
                this.frogGroup.remove(frog);
            }
        }, this);

        // recycling cities
        this.cityGroup.getChildren().forEach(function (city) {
            if (city.x < - city.displayWidth) {
                let rightmostCity = this.getRightmostCity();
                city.x = rightmostCity + Phaser.Math.Between(100, 350);
                city.y = game.config.height + Phaser.Math.Between(0, 100);
                city.setFrame(Phaser.Math.Between(0, 1))
                if (Phaser.Math.Between(0, 1)) {
                    city.setDepth(1);
                }
            }
        }, this);

        // adding new platforms
        if (minDistance > this.nextPlatformDistance) {
            let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
    }
};

function resize() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
*/