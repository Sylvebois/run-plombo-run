import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');
  }

  preload () {
    // load images
    this.load.image('phaser_logo', 'assets/phaser_logo.png');
  }

  create () {
    this.add.image(config.width / 2, config.height / 2, 'phaser_logo');
  }
};
