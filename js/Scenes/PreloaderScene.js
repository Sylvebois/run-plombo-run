import * as PHASER from '../phaser.min.js';

export default class PreloaderScene extends Phaser.Scene {
  constructor () {
    super('Preloader');
  }

  init () {
    this.readyCount = 0;
  }

  preload () {
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // display progress bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    // add logo image
    let logo = this.add.image(0, 0, 'logo');
    logo.setPosition(width / 2, loadingText.y - logo.height);

    // update progress bar
    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    // remove progress bar when complete
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    }.bind(this));

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);

    // load assets needed in our game
    this.load.image('blueButton1', 'assets/ui/blue_button02.png');
    this.load.image('blueButton2', 'assets/ui/blue_button03.png');
    this.load.image('box', 'assets/ui/grey_box.png');
    this.load.image('checkedBox', 'assets/ui/blue_boxCheckmark.png');

    this.load.image('plombo', 'assets/ui/plombo_light_off.png');
    this.load.image('plombo_unlocked', 'assets/ui/plombo_light_on.png');
    this.load.image('platform', 'assets/game/platform.png');

    this.load.spritesheet('player', 'assets/game/plombo.png', {
        frameWidth: 64,
        frameHeight: 69
    });

    this.load.spritesheet('robinet', 'assets/game/robinet.png', {
        frameWidth: 32,
        frameHeight: 32
    });

    this.load.spritesheet('frog', 'assets/game/frog.png', {
        frameWidth: 51,
        frameHeight: 59
    });

    this.load.spritesheet('seahorse', 'assets/game/seahorse.png', {
        frameWidth: 50,
        frameHeight: 85
    });

    this.load.spritesheet('background', 'assets/game/background.png', {
        frameWidth: 384,
        frameHeight: 224
    });

    this.load.audio('bgMusic', ['assets/game/Mercury.mp3']);
  }

  create() {
    // setting player animation
    this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 2
    }),
    frameRate: 8,
    repeat: -1
    });

    //setting frog animation
    this.anims.create({
        key: 'jumpingFrog',
        frames: this.anims.generateFrameNumbers('frog', {
            start: 0,
            end: 3
        }),
        frameRate: 5,
        yoyo: true,
        repeat: -1
    });

    this.anims.create({
        key: 'idleFrog',
        frames: this.anims.generateFrameNumbers('frog', {
            start: 4,
            end: 6
        }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'jumpingSeahorse',
        frames: this.anims.generateFrameNumbers('seahorse', {
            start: 0,
            end: 3
        }),
        frameRate: 5,
        repeat: -1
    });
  }

  ready () {
    this.scene.start('Title');
    this.readyCount++;
    if (this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
};
