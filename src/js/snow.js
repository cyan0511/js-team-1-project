
let h, w;
let c;
let animationId;

export function startSnow() {
  const container = document.querySelector('.animation-container');

  c = document.createElement('canvas');
  $ = c.getContext('2d');
  w = c.width = window.innerWidth - 40;
  h = c.height = document.documentElement.scrollHeight;

  c.classList.add('snow');
  container.appendChild(c);

  let snow, arr = [];
  const num = 600, tsc = 1, sp = 1;
  const sc = 1.3, t = 0, mv = 20, min = 1;
  for (let i = 0; i < num; ++i) {
    snow = new Flake();
    snow.y = Math.random() * (h + 50);
    snow.x = Math.random() * w;
    snow.t = Math.random() * (Math.PI * 2);
    snow.sz = (100 / (10 + (Math.random() * 100))) * sc;
    snow.sp = (Math.pow(snow.sz * .8, 2) * .15) * sp;
    snow.sp = snow.sp < min ? min : snow.sp;
    arr.push(snow);
  }
  go();
  function go(){
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(go);
    $.clearRect(0, 0, w, h);
    $.fillStyle = 'hsla(242, 95%, 3%, 0)';
    $.fillRect(0, 0, w, h);
    $.fill();
    for (let i = 0; i < arr.length; ++i) {
      const f = arr[i];
      f.t += .05;
      f.t = f.t >= Math.PI * 2 ? 0 : f.t;
      f.y += f.sp;
      f.x += Math.sin(f.t * tsc) * (f.sz * .3);
      if (f.y > h + 50) f.y = -10 - Math.random() * mv;
      if (f.x > w + mv) f.x = - mv;
      if (f.x < - mv) f.x = w + mv;
      f.draw();}
  }
  function Flake() {
    this.draw = () => {
      this.g = $.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.sz);
      this.g.addColorStop(0, 'hsla(255,255%,255%,1)');
      this.g.addColorStop(1, 'hsla(255,255%,255%,0)');
      $.moveTo(this.x, this.y);
      $.fillStyle = this.g;
      $.beginPath();
      $.arc(this.x, this.y, this.sz, 0, Math.PI * 2, true);
      $.fill();}
  }

  window.addEventListener('resize', () => {
    c.width = w = window.innerWidth;
    c.height = h = document.documentElement.scrollHeight;
  }, false);

}

export const snowStop = () => {
  cancelAnimationFrame(animationId);
  const container = document.querySelector('.animation-container');
  container.innerHTML = '';
};

