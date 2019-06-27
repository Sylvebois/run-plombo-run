import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');
  }

  init() {
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

      playerStartPosition: 200, // player starting X position
      playerGravity: 900, // player gravity
      jumpForce: 400, // player jump force
      jumps: 2, // consecutive jumps allowed

      robPercent: 75, // % of probability a robinet appears on the platform
      frogPercent: 0, // % of probability a frog appears on the platform
      seahorsePercent: 0 // % of probability a seahorse appears on the platform
    }
  }

  create () {
    // the main background image
    let background = this.physics.add.sprite(config.width / 2, config.height / 2, 'background', 2);
    background.displayWidth = config.width;
    background.displayHeight = config.height;

    // the score and best score
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: '32px', fill: '#000' });
    this.bestScoreText = this.add.text(0, 0, `Best: ${this.sys.game.globals.bestScore}`, { fontSize: '32px', fill: '#000' });
    this.bestScoreText.setPosition(config.width - this.bestScoreText.width - 16, 16);
  }
};
