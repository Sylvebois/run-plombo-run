export default {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  backgroundColor: 0x3f3f3f,
  physics: {
      default: "arcade"
  },
  scale : {
    mode : Phaser.Scale.FIT,
    autoCenter : Phaser.Scale.CENTER_BOTH,
  },
};
