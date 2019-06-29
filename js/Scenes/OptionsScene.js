import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';
import Button from '../Objects/Button.js';

export default class OptionsScene extends Phaser.Scene {
  constructor () {
    super('Options');
  }

  create () {
    this.model = this.sys.game.globals.model;

    this.text = this.add.text(0, 0, 'Options', { fontSize: 40 });
    this.text.setPosition(config.width / 2 - this.text.width / 2, config.height / 2 - 200);

    this.musicButton = this.add.image(config.width / 2 - 100, config.height / 2 - 100, 'checkedBox');
    this.musicText = this.add.text(config.width / 2 - 50, config.height / 2 - 110, 'Music Enabled', { fontSize: 24 });
    this.soundButton = this.add.image(config.width / 2 - 100, config.height / 2, 'checkedBox');
    this.soundText = this.add.text(config.width / 2 - 50, config.height / 2 - 10, 'Sound Enabled', { fontSize: 24 });

    this.musicButton.setInteractive();
    this.soundButton.setInteractive();

    this.musicButton.on('pointerdown', function () {
      this.model.musicOn = !this.model.musicOn;
      this.updateAudio();
    }.bind(this));

    this.soundButton.on('pointerdown', function () {
      this.model.soundOn = !this.model.soundOn;
      this.updateAudio();
    }.bind(this));

    this.menuButton = new Button(this, config.width / 2, config.height / 2 + 100, 'blueButton1', 'blueButton2', 'Menu', 'Title');

    this.updateAudio();
  }

  updateAudio() {
    this.musicButton.setTexture( (this.model.musicOn)? 'checkedBox' : 'box' );
    this.soundButton.setTexture( (this.model.soundOn)? 'checkedBox' : 'box' );
  }
};