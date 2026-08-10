/**
 * particles.js
 * Partículas doradas flotando en el canvas — sin dependencias externas.
 */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let particles = [];
  const COUNT = 90;

  // Colores dorados / morados suaves
  const COLORS = [
    'rgba(201, 168, 76, {a})',
    'rgba(240, 208, 128, {a})',
    'rgba(122,  95, 40, {a})',
    'rgba(180, 140, 200, {a})',
  ];

  function randomColor(alpha) {
    const tmpl = COLORS[Math.floor(Math.random() * COLORS.length)];
    return tmpl.replace('{a}', alpha);
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 10;
      this.r     = Math.random() * 1.8 + 0.4;
      this.alpha = Math.random() * 0.65 + 0.1;
      this.speed = Math.random() * 0.45 + 0.08;
      this.drift = (Math.random() - 0.5) * 0.25;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = (Math.random() * 0.02 + 0.005);
      this.color = randomColor(this.alpha);
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.drift + Math.sin(this.wobble) * 0.3;
      this.y -= this.speed;
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();

      // Halo suave
      if (this.r > 1.2) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
        gradient.addColorStop(0, randomColor(this.alpha * 0.4));
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();
