var config = {
  type: Phaser.AUTO,
  parent: 'gameContainer',
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
  },
  scene: [ BootScene, MainScene ]
};

var game = new Phaser.Game(config);

class BootScene extends Phaser.Scene {
  constructor() {
      super('BootScene');
  }

  preload() {
      this.load.image('background', 'assets/background.png');
      this.load.image('paddle', 'assets/paddle.png');
      this.load.image('ball', 'assets/ball.png');
      this.load.image('brick', 'assets/brick.png');
  }

  create() {
      this.scene.start('MainScene');
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
      super('MainScene');
  }

  create() {
      this.add.image(400, 300, 'background');

      this.bricks = this.physics.add.group({
          key: 'brick',
          repeat: 9,
          setXY: { x: 64, y: 64, stepX: 64 }
      });

      Phaser.Actions.ScaleXY(this.bricks.getChildren(), -0.5, -0.5);
      Phaser.Actions.Call(this.bricks.getChildren(), function(brick) {
          brick.setImmovable(true);
      }, null);

      this.ball = this.physics.add.image(400, 300, 'ball').setCollideWorldBounds(true).setBounce(1);
      this.ball.setData('onPaddle', true);

      this.paddle = this.physics.add.image(400, 570, 'paddle').setImmovable();
      this.cursor = this.input.keyboard.createCursorKeys();

      this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
      this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
  }

  update() {
      if (this.ball.getData('onPaddle')) {
          this.ball.setPosition(this.paddle.x, 530);
          if (this.cursor.left.isDown) {
              this.paddle.x -= 5;
          } else if (this.cursor.right.isDown) {
              this.paddle.x += 5;
          }
      } else {
          if (this.ball.y > this.game.config.height) {
              this.resetBall();
          }
      }
  }

  hitBrick(ball, brick) {
      brick.disableBody(true, true);
      if (this.bricks.countActive() === 0) {
          alert("You Win!");
          this.scene.stop(); // Stop the game scene
      }
  }

  hitPaddle(ball, paddle) {
      let diff = 0;
      if (ball.x < paddle.x) {
          diff = paddle.x - ball.x;
          ball.setVelocityX(-10 * diff);
      } else if (ball.x > paddle.x) {
          diff = ball.x - paddle.x;
          ball.setVelocityX(10 * diff);
      } else {
          ball.setVelocityX(2 + Math.random() * 8);
      }
  }

  resetBall() {
      this.ball.setVelocity(0);
      this.ball.setPosition(400, 300);
      this.ball.setData('onPaddle', true);
  }
}
