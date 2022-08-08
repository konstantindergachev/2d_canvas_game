/**@type {HTMLCanvasElement} */

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 720;

  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener('keydown', (ev) => {
        if (
          (ev.key === 'ArrowDown' ||
            ev.key === 'ArrowUp' ||
            ev.key === 'ArrowLeft' ||
            ev.key === 'ArrowRight') &&
          this.keys.indexOf(ev.key) === -1
        ) {
          this.keys.push(ev.key);
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
    }
  }
  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById('playerImage');
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
      this.velocityY = 0;
      this.weight = 1;
    }
    draw(contex) {
      contex.fillStyle = 'white';
      contex.fillRect(this.x, this.y, this.width, this.height);
      contex.drawImage(
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
    update(input) {
      if (input.keys.indexOf('ArrowRight') > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf('ArrowLeft') > -1) {
        this.speed = -5;
      } else if (input.keys.indexOf('ArrowUp') > -1 && this.#onGround()) {
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
        this.frameY = 1;
      } else {
        this.velocityY = 0;
        this.frameY = 0;
      }
      if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
    }
    #onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }
  class Background {}
  class Enemy {}

  const handleEnemies = () => {};
  const displayStatusText = () => {};

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    player.update(input);
    requestAnimationFrame(animate);
  };
  animate();
});
