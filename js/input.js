export class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    window.addEventListener('keydown', (ev) => {
      if (
        (ev.key === 'ArrowDown' ||
          ev.key === 'ArrowUp' ||
          ev.key === 'ArrowLeft' ||
          ev.key === 'ArrowRight' ||
          ev.key === 'Enter') &&
        this.keys.indexOf(ev.key) === -1
      ) {
        this.keys.push(ev.key);
      } else if (ev.key === 'd') this.game.debug = !this.game.debug;
    });
    window.addEventListener('keyup', (ev) => {
      if (
        ev.key === 'ArrowDown' ||
        ev.key === 'ArrowUp' ||
        ev.key === 'ArrowLeft' ||
        ev.key === 'ArrowRight' ||
        ev.key === 'Enter'
      ) {
        this.keys.splice(this.keys.indexOf(ev.key), 1);
      }
    });
  }
}
