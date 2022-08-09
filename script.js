/**@type {HTMLCanvasElement} */

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 1400;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;
  const fullScreenButton = document.getElementById('fullScreenButton');

  class InputHandler {
    constructor() {
      this.keys = [];
      this.touchY = '';
      this.touchTrashold = 30;
      window.addEventListener('keydown', (ev) => {
        if (
          (ev.key === 'ArrowDown' ||
            ev.key === 'ArrowUp' ||
            ev.key === 'ArrowLeft' ||
            ev.key === 'ArrowRight') &&
          this.keys.indexOf(ev.key) === -1
        ) {
          this.keys.push(ev.key);
        } else if (ev.key === 'Enter' && gameOver) {
          restartGame();
        }
      });
      window.addEventListener('keyup', (ev) => {
        if (
          ev.key === 'ArrowDown' ||
          ev.key === 'ArrowUp' ||
          ev.key === 'ArrowLeft' ||
          ev.key === 'ArrowRight'
        ) {
          this.keys.splice(this.keys.indexOf(ev.key), 1);
        }
      });
      window.addEventListener('touchstart', (ev) => {
        this.touchY = ev.changedTouches[0].pageY;
      });
      window.addEventListener('touchmove', (ev) => {
        const swipeDistance = ev.changedTouches[0].pageY - this.touchY;
        if (swipeDistance < -this.touchTrashold && this.keys.indexOf('swipe up') === -1) {
          this.keys.push('swipe up');
        } else if (swipeDistance > this.touchTrashold && this.keys.indexOf('swipe down') === -1) {
          this.keys.push('swipe down');
          if (gameOver) restartGame();
        }
      });
      window.addEventListener('touchend', (ev) => {
        this.keys.splice(this.keys.indexOf('swipe up'), 1);
        this.keys.splice(this.keys.indexOf('swipe down'), 1);
      });
    }
  }
  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById('playerImage');
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 8;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 0;
      this.velocityY = 0;
      this.weight = 1;
    }
    restart() {
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.frameY = 0;
      this.maxFrame = 8;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(input, deltaTime, enemies) {
      //collision detection
      enemies.forEach((enemy) => {
        const distanceX = enemy.x + (enemy.width / 2 - 20) - (this.x + this.width / 2);
        const distanceY = enemy.y + enemy.height / 2 - (this.y + this.height / 2) + 20;
        const distanceHypotenuse = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if (distanceHypotenuse < enemy.width / 3 + this.width / 3) {
          gameOver = true;
        }
      });

      //sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      //controls
      if (input.keys.indexOf('ArrowRight') > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf('ArrowLeft') > -1) {
        this.speed = -5;
      } else if (
        (input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) &&
        this.#onGround()
      ) {
        this.velocityY -= 32;
      } else {
        this.speed = 0;
      }

      //horizontal movement
      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

      //vertical movement
      this.y += this.velocityY;
      if (!this.#onGround()) {
        this.velocityY += this.weight;
        this.maxFrame = 5;
        this.frameY = 1;
      } else {
        this.velocityY = 0;
        this.maxFrame = 8;
        this.frameY = 0;
      }
      if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
    }
    #onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }
  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById('backgroundImage');
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 7;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      );
    }
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
    restart() {
      this.x = 0;
    }
  }
  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById('enemyImage');
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 8;
      this.markForDeletion = false;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.markForDeletion = true;
        score++;
      }
    }
  }

  const handleEnemies = (deltaTime) => {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach((enemy) => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    enemies = enemies.filter((enemy) => !enemy.markForDeletion);
  };
  const displayStatusText = (context) => {
    context.font = '30px Arial';
    context.textAlign = 'left';
    context.fillStyle = 'black';
    context.fillText(`Score: ${score}`, 20, 50);
    context.fillStyle = 'white';
    context.fillText(`Score: ${score}`, 22, 52);

    if (gameOver) {
      context.font = '40px Arial';
      context.textAlign = 'center';
      context.fillStyle = 'black';
      context.fillText(
        `Game over, press Enter or swipe down to restart!`,
        canvas.width / 2,
        canvas.height / 2
      );
      context.fillStyle = 'red';
      context.fillText(
        `Game over, press Enter or swipe down to restart!`,
        canvas.width / 2 + 2,
        canvas.height / 2 + 2
      );
    }
  };

  const restartGame = () => {
    player.restart();
    background.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0);
  };

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await canvas.requestFullscreen();
      } catch (error) {
        alert(`Error, can't enable full-screen mode: ${error.message}`);
      }
    } else {
      document.exitFullscreen();
    }
  };
  fullScreenButton.addEventListener('click', toggleFullScreen);

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    background.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  };
  animate(0);
});
