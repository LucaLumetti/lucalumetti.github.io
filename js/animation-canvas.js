let canvas = document.createElement('canvas');

let size = Math.floor(Math.min(window.innerWidth, window.innerHeight)/1.1)

canvas.style.cssText = `width:${size}px;height:${size}px`;
canvas.id = 'drawing'
document.body.appendChild(canvas);

canvas = document.getElementById('drawing')

var scale = 2;
canvas.style.width = size + 'px';
canvas.style.height = size + 'px';
canvas.width = size * scale;
canvas.height = size * scale;

size = size*scale

// probably i can add everything inside this class...
class Animation {
  constructor(size, x, y, a, b, g, o, l, d){
    this.size = size
    this.x = x
    this.y = y
    this.a = a
    this.b = b
    this.g = g
    this.o = o
    this.l = l
    this.d = d
    this._max_x = 1
    this._max_y = 1
    this._min_x = -1
    this._min_y = -1

    this.get_canvas()
    this.interval = null
    this.total_points = 0
  }

  get_canvas(){
    let canvas = document.getElementById('drawing')
    // this.size = Math.min(window.innerWidth, window.innerHeight)
    this.ctx = canvas.getContext("2d");
    this.canvasData = this.ctx.getImageData(0, 0, this.size, this.size);
  }

  drawPixel (x, y, r, g, b, a) {
    if(this.interval != null && this.total_points > 1000*500){
      clearInterval(this.interval)
      console.log('Animation stopped')
    }

    let scale_min = Math.min(this._min_x, this._min_y)
    let scale_max = Math.max(this._max_x, this._max_y)

    x = (x-scale_min)/(scale_max - scale_min)*this.size
    y = (y-scale_min)/(scale_max - scale_min)*this.size

    let index = (Math.floor(x) + Math.floor(y) * this.size) * 4;
    
    this.canvasData.data[index + 0] = r;
    this.canvasData.data[index + 1] = g;
    this.canvasData.data[index + 2] = b;
    this.canvasData.data[index + 3] = a;
  }

  updateCanvas() {
    this.ctx.putImageData(this.canvasData, 0, 0);
    // if(points_drawn > 1000*10000) clearInterval(interval)
  }

  step(x, y){
    let zzbar = x*x + y*y
    let p = this.a*zzbar + this.l
    let zreal = x
    let zimag = y

    for(let j = 0; j < this.d-2; j++){
      let za = zreal*x - zimag*y
      let zb = zimag*x + zreal*y
      zreal = za
      zimag = zb
    }

    let zn = x*zreal - y*zimag

    p += this.b*zn

    let newx = p*x + this.g*zreal - this.o*y
    let newy = p*y - this.g*zimag + this.o*x
    this.x = newx
    this.y = newy
    this._max_x = Math.max(this.x, this._max_x)
    this._max_y = Math.max(this.y, this._max_y)
    this._min_x = Math.min(this.x, this._min_x)
    this._min_y = Math.min(this.y, this._min_y)
  }

  add_points(){
    for(let n = 0; n < 10000; n++){
      this.step(this.x, this.y)
      this.drawPixel(this.x, this.y, 255, 255, 255, 255)
    }
    this.total_points += 1000
    this.updateCanvas()
  }

  animate(){
    this.interval = setInterval(() => {this.add_points()}, 100)
  }
}

let nice_params = [
  [0.01, 0.01, -2.5, -0.1, 0.9, -0.15, 2.39, 3],
  [0.01, 0.01, -2.5, -0.1, 0.9, -0.15, 2.39, 4],
  [0.01, 0.01, -2.5, -0.1, 0.9, -0.15, 2.39, 5],
  [0.01, 0.01, -2.5, -0.1, 0.9, -0.15, 2.39, 6],
  [0.01, 0.01, -2.5, -0.1, 0.9, -0.15, 2.39, 7],
  [0.01, 0.01, -2.25, -0.1, 0.9, -0.15, 2.39, 6],
  [0.01, 0.01, -2.25, -0.1, 0.1, 0.15, 2.5, 6],
]
let rnd = Math.floor(Math.random()*nice_params.length)
let params = nice_params[rnd]

let anim = new Animation(size, ...params)
anim.animate()
