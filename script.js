import { Background } from './js/background.js';
import { ClimbingEnemy, FlyingEnemy, GroundEnemy } from './js/enemies.js';
import { InputHandler } from './js/input.js';
import { Player } from './js/player.js';
import { UI } from './js/UI.js';

window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 3;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.score = 0;
      this.fontColor = 'black';
      this.player.currentState = this.player.state[0];
      this.player.currentState.enter();
      this.particles = [];
      this.maxParticles = 50;
      this.collisions = [];
      this.time = 0;
      this.maxTime = 10000;
      this.gameOver = false;
    }
    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) this.gameOver = true;
      this.background.update();
      this.player.update(this.input.keys, deltaTime);

      //handleEnemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
      });

      //handle particles
      this.particles.forEach((particle, idx) => {
        particle.update();
        if (particle.markedForDeletion) this.particles.splice(idx, 1);
      });
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      //handle collision sprites
      this.collisions.forEach((collision, idx) => {
        collision.update(deltaTime);
        if (collision.markedForDeletion) this.collisions.splice(idx, 1);
      });
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);

      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });

      this.particles.forEach((particle) => {
        particle.draw(context);
      });

      this.collisions.forEach((collision) => {
        collision.draw(context);
      });

      this.UI.draw(context);
    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver) requestAnimationFrame(animate);
  };
  animate(0);
});
