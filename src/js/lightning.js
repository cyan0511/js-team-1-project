const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

const getDir = () => {
  const dec = Math.floor(Math.random() * 30);
  if (dec < 16) return LEFT;
  else return RIGHT;
};

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.floor(Math.random() * 30);
    this.clr = 'silver';
    this.dir = getDir();
    this.speed = Math.floor(Math.random() * 2) + 1;
  }

  moveLeft() {
    this.x -= this.speed;
  }
  moveRight() {
    this.x += this.speed;
  }
  update() {
    if (this.x <= 0) {
      this.dir = RIGHT;
    } else if (this.x >= canvas.width) {
      this.dir = LEFT;
    }

    if (this.dir === LEFT) {
      this.moveLeft();
    } else {
      this.moveRight();
    }
  }
  drawRoot(x, y) {
    const ctx = canvas.getContext('2d');
    let sx = x,
      sy = y,
      ex = sx + Math.floor(Math.random() * 50) - 15,
      ey = sy + Math.floor(Math.random() * 30);
    let i = 0,
      limit = Math.floor(Math.random() * 20);
    while (i < limit) {
      ctx.beginPath();
      ctx.strokeStyle = 'silver';
      ctx.lineWidth = 1;
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      sx = ex;
      sy = ey;
      ex = sx + Math.floor(Math.random() * 50) - 15;
      ey = sy + Math.floor(Math.random() * 30);
      i++;
    }
  }
  drawLightning() {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let sx = this.x,
      sy = this.y,
      ex = sx + Math.floor(Math.random() * 30) - 15,
      ey = sy + Math.floor(Math.random() * 30);

    let i = 0,
      limit = Math.floor(Math.random() * 20) + 10;

    while (i < limit) {
      ctx.beginPath();
      ctx.strokeStyle = 'silver';
      ctx.lineWidth = 3;
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      sx = ex;
      sy = ey;
      ex = sx + Math.floor(Math.random() * 30) - 15;
      ey = sy + Math.floor(Math.random() * 30);
      let root = Math.floor(Math.random() * 1000);
      if (root < 50) {
        this.drawRoot(sx, sy);
      }
      i++;
    }
  }
  draw() {
    const strike = Math.floor(Math.random() * 100000);

    if (strike < 10) {
      this.drawLightning();
    }
  }
}

let animationId;
let canvas;

export const lightningStart = () => {
  const container = document.querySelector('.animation-container');

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.classList.add('lightning');
    container.appendChild(canvas);
  } else {
    canvas = document.querySelector('.lightning');
    if (canvas?.clientWidth) {
      canvas.width = canvas.clientWidth - 20;
      canvas.height = document.documentElement.clientHeight - 10;
    }
  }

  if (!canvas) {
    setTimeout(lightningStart, 200);
    return;
  }

  const ctx = canvas.getContext('2d');

  const clouds = [];

  let i = 0;

  while (i < canvas.width) {
    clouds.push(new Cloud(i, 0, ctx));
    i += Math.floor(Math.random() * 10) + 1;
  }

  ctx.fillStyle = '#000000';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.shadowColor = 'aliceblue';
  ctx.shadowBlur = 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let c of clouds) {
    c.draw();
    c.update();
  }

  // cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(lightningStart);

  /*window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.screen.height;
  });*/
};

export const lightningStop = () => {
  const canvas = document.querySelector('.lightning');
  cancelAnimationFrame(animationId);
  const container = document.querySelector('.animation-container');
  if (canvas) {
    container.removeChild(canvas);
  }
};
