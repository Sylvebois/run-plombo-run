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
 * template : https://phasertutorials.com/creating-a-phaser-3-template-part-1/
 * source : https://www.emanueleferonato.com/2019/01/23/html5-endless-runner-built-with-phaser-and-arcade-physics-step-5-adding-deadly-frog-being-kind-with-players-by-setting-its-body-smaller-than-the-image/
 */

class Game extends Phaser.Game {
    constructor() {
        super(config);
        const model = new Model();
        this.globals = {
            model,
            bgMusic: null,
            bonus: (localStorage.getItem('bonus')) ? localStorage.getItem('bonus') : false,
            bestScore : localStorage.getItem('bestScore') | 0
        };
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
window.focus();
resize();
window.addEventListener("resize", resize, false);


function resize() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = config.width / config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

/*

// preloadGame scene
class preloadGame extends Phaser.Scene {
    constructor() {
        super("PreloadGame");
    }
    create() {
        this.scene.start("HomeScreen");
    }
}

// Home scene
class homeScreen extends Phaser.Scene {
    constructor() {
        super("HomeScreen");
    }
    create() {
        let plomboFace = this.add.image(0, 0, (gameOptions.bonus)? 'plombo_unlocked' : 'plombo').setInteractive();
        plomboFace.x = game.config.width / 2;
        plomboFace.y = plomboFace.height / 2 + bestScoreText.y + bestScoreText.height + 64;

        let bonusText = this.add.text(0, 0, (gameOptions.bonus)? 'Voir les bonus' : 'Bonus verrouillés', { fontSize: '60px', fill: '#fff' });
        bonusText.x = game.config.width / 2 - bonusText.width / 2;
        bonusText.y = plomboFace.y;
        bonusText.setInteractive(new Phaser.Geom.Rectangle(0, 0, bonusText.width, bonusText.height), Phaser.Geom.Rectangle.Contains);
        bonusText.alpha = 0;

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
}

*/