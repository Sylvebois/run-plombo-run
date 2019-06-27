import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';
import Button from '../Objects/Button.js';

export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('Title');
  }

  create () {
    //Title
    let title = this.add.text(0, 0, 'Run Plombo ! Run !', { fontSize: '64px', fill: '#fff' });
    title.setPosition(config.width / 2 - title.width / 2, title.height);

    // Game
    this.gameButton = new Button(this, config.width / 2, config.height / 2 - 50, 'blueButton1', 'blueButton2', 'Play', 'Game');

    // Options
    this.optionsButton = new Button(this, config.width / 2, config.height / 2 + 50, 'blueButton1', 'blueButton2', 'Options', 'Options');

    // Credits
    this.creditsButton = new Button(this, config.width / 2, config.height / 2 + 150, 'blueButton1', 'blueButton2', 'Credits', 'Credits');

    //Bestscore
    let bestScoreText = this.add.text(0, 0, `Best : ${this.sys.game.globals.bestScore}`, { fontSize: '32px', fill: '#fff' });
    bestScoreText.setPosition(config.width / 2 - bestScoreText.width / 2, config.height / 2 + 250);

    // Plombo
    let plomboFace = this.add.image(0, 0, (this.sys.game.globals.bonus)? 'plombo_unlocked' : 'plombo');
    plomboFace.setPosition(this.gameButton.x, this.gameButton.y - plomboFace.height / 2);
    plomboFace.scale = 0.5;
  }

  centerButton (gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(config.width/2, config.height/2 - offset * 100, config.width, config.height)
    );
  }

  centerButtonText (gameText, gameButton) {
    Phaser.Display.Align.In.Center(
      gameText,
      gameButton
    );
  }
};
