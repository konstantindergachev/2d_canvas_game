export default class InputHandler {
  constructor() {
    this.lastKey = '';
    window.addEventListener('keydown', (ev) => {
      switch (ev.key) {
        case 'ArrowLeft':
          this.lastKey = 'PRESS left';
          break;
        case 'ArrowRight':
          this.lastKey = 'PRESS right';
          break;
        case 'ArrowDown':
          this.lastKey = 'PRESS down';
          break;
        case 'ArrowUp':
          this.lastKey = 'PRESS up';
          break;

        default:
          break;
      }
    });
    window.addEventListener('keyup', (ev) => {
      switch (ev.key) {
        case 'ArrowLeft':
          this.lastKey = 'RELEASE left';
          break;
        case 'ArrowRight':
          this.lastKey = 'RELEASE right';
          break;
        case 'ArrowDown':
          this.lastKey = 'RELEASE down';
          break;
        case 'ArrowUp':
          this.lastKey = 'RELEASE up';
          break;

        default:
          break;
      }
    });
  }
}
