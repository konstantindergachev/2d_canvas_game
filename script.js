window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas1');
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

  const input = new InputHandler();

  const animate = () => {
    requestAnimationFrame(animate);
  };
  animate();
});
