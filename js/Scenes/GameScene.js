import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.model = this.sys.game.globals.model;
    this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
    this.score = 0;
    this.scoreText = '';
    this.bestScoreText = '';

    this.gameOptions = {
      backgroundSpeed: 80, // background speed, in pixels per second

      platformSpeedRange: [300, 300], // platform speed range, in pixels per second
      spawnRange: [80, 300], // how far should be the rightmost platform from the right edge before next platform spawns, in pixels
      platformSizeRange: [90, 300], // platform width range, in pixels
      platformHeightRange: [-5, 5], // a height range between rightmost platform and next platform to be spawned
      platformHeighScale: 20, // a scale to be multiplied by platformHeightRange
      platformVerticalLimit: [0.4, 0.8], // platform max and min height, as screen height ratio

      playerStartPosition: 100, // player starting X position
      playerGravity: 900, // player gravity
      jumpForce: 400, // player jump force
      jumps: 2, // consecutive jumps allowed

      robPercent: 75, // % of probability a robinet appears on the platform
      frogPercent: 0, // % of probability a frog appears on the platform
      seahorsePercent: 0 // % of probability a seahorse appears on the platform
    }
  }

  create() {
    if (this.model.musicOn === true) {
      this.bgMusic.play();
    }

    // the main background image
    let background = this.physics.add.sprite(config.width / 2, config.height / 2, 'background', 2);
    background.displayWidth = config.width;
    background.displayHeight = config.height;

    // the score and best score
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: '32px', fill: '#000' });
    this.bestScoreText = this.add.text(0, 0, `Best: ${this.sys.game.globals.bestScore}`, { fontSize: '32px', fill: '#000' });
    this.bestScoreText.setPosition(config.width - this.bestScoreText.width - 16, 16);

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
    this.addPlatform(game.config.width, game.config.width / 2, game.config.height * this.gameOptions.platformVerticalLimit[1]);

    // adding the player;
    this.player = this.physics.add.sprite(this.gameOptions.playerStartPosition, game.config.height * 0.7, 'player');
    this.player.setGravityY(this.gameOptions.playerGravity);
    this.player.setDepth(2);

    // the building where the player start
    let sanidel = this.physics.add.sprite(0, 230, 'sanidel_building');
    sanidel.setOrigin(0, 0);
    sanidel.scale = 2;
    sanidel.setDepth(2);
    sanidel.setVelocityX(this.gameOptions.platformSpeedRange[0] * -1);

    // the player is not dying
    this.dying = false;

    // setting collisions between the player and the platform group
    this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function () {

      // play 'run' animation if the player is on a platform
      if (!this.player.anims.isPlaying) {
        this.player.anims.play('run');
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
    this.input.on('pointerdown', this.jump, this);
  }

  // adding cities
  addCities() {
    let rightmostCity = this.getRightmostCity();
    if (rightmostCity < game.config.width * 2) {
      let city = this.physics.add.sprite(rightmostCity + Phaser.Math.Between(100, 350), game.config.height + Phaser.Math.Between(0, 100), 'background');
      city.setOrigin(0.5, 1);
      city.body.setVelocityX(this.gameOptions.backgroundSpeed * -1)
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
      platform = this.add.tileSprite(posX, posY, platformWidth, 32, 'platform');
      this.physics.add.existing(platform);
      platform.body.setImmovable(true);
      platform.body.setVelocityX(Phaser.Math.Between(this.gameOptions.platformSpeedRange[0], this.gameOptions.platformSpeedRange[1]) * -1);
      platform.setDepth(2);
      this.platformGroup.add(platform);
    }
    this.nextPlatformDistance = Phaser.Math.Between(this.gameOptions.spawnRange[0], this.gameOptions.spawnRange[1]);

    // if this is not the starting platform...
    if (this.addedPlatforms > 1) {

      // is there a robinet over the platform?
      if (Phaser.Math.Between(1, 100) <= this.gameOptions.robPercent) {
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
          let robinet = this.physics.add.sprite(posX, posY - 96, 'robinet');
          robinet.setImmovable(true);
          robinet.setVelocityX(platform.body.velocity.x);
          robinet.setDepth(2);
          this.robGroup.add(robinet);
        }
      }

      // is there a frog over the platform?
      if (Phaser.Math.Between(1, 100) <= this.gameOptions.frogPercent) {
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
          let frog = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 46, 'frog');
          frog.setFlipX(true);
          frog.setImmovable(true);
          frog.setVelocityX(platform.body.velocity.x);
          frog.setSize(8, 2, true)
          frog.anims.play('idleFrog');
          frog.setDepth(2);
          this.frogGroup.add(frog);
        }
      }
    }
  }

  // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
  // and obviously if the player is not dying
  jump() {
    if ((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < this.gameOptions.jumps))) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.setVelocityY(this.gameOptions.jumpForce * -1);
      this.playerJumps++;

      // stops animation
      this.player.anims.stop();
    }
  }

  collectRob(player, robinet) {
    // add and update the score
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);

    // disable robinet
    this.robGroup.killAndHide(robinet);
    this.robGroup.remove(robinet);
  }

  update() {

    // game over
    if (this.player.y > game.config.height) {
      if (this.score > this.sys.game.globals.bestScore) {
        this.sys.game.globals.bestScore = this.score;
        localStorage.setItem('bestScore', this.sys.game.globals.bestScore);
      }

      if (this.sys.game.globals.bestScore > 10) {
        this.sys.game.globals.bonus = true;
        localStorage.setItem('bonus', this.sys.game.globals.bonus);
      }

      this.bgMusic.destroy();
      this.scene.start('Title');
    }

    this.player.x = this.gameOptions.playerStartPosition;

    //Increasing difficulty
    if (this.score > 10 && this.score <= 20) {
      this.gameOptions.robPercent = 50;
      this.gameOptions.frogPercent = 12.5;
    }
    else if (this.score > 20 && this.score <= 30) {
      this.gameOptions.seahorsePercent = 12.5;
    }
    else if (this.score > 30) {
      this.gameOptions.frogPercent = 25;
      this.gameOptions.robPercent = 25;
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
      let nextPlatformWidth = Phaser.Math.Between(this.gameOptions.platformSizeRange[0], this.gameOptions.platformSizeRange[1]);
      let platformRandomHeight = this.gameOptions.platformHeighScale * Phaser.Math.Between(this.gameOptions.platformHeightRange[0], this.gameOptions.platformHeightRange[1]);
      let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      let minPlatformHeight = game.config.height * this.gameOptions.platformVerticalLimit[0];
      let maxPlatformHeight = game.config.height * this.gameOptions.platformVerticalLimit[1];
      let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
      this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
    }
  }
};
