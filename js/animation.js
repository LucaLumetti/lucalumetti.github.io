import * as THREE from 'three';

class SymmetricAttractor{
  constructor(scene, camera, renderer){
    this.scene = scene
    this.camera = camera
    this.renderer = renderer

    this.pointsGeometry = new THREE.BufferGeometry();
    this.points = [];
  }

  init(){
    this.camera.position.z = 1;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
    let x = this.params.x0
    let y = this.params.y0
    for(let i = 0; i < 20; i++){
      let xy = this.step(x, y)
      x = xy[0]
      y = xy[1]
      this.points.push(new THREE.Vector3(x, y, 0).multiplyScalar(1))
    }
    this.geometry = new THREE.Geometry();
    this.curve = new THREE.CatmullRomCurve3(this.points);
    this.geometry.vertices = this.curve.getPoints(10000);
    // geometry.vertices = points

    this.material = new THREE.PointsMaterial();
    this.material.color = new THREE.Color(0xFFFFFF);
    this.material.transparent = true;
    this.material.size = 0.001;
    this.material.blending = THREE.AdditiveBlending;

    this.p = new THREE.Points(this.geometry, this.material);
    this.p.sizeAttenuation = false;
    this.p.sortPoints = true;
    this.raycaster = new THREE.Raycaster();

    this.group = new THREE.Group()
    this.group.add(this.p)
    this.scene.add(this.group)
  }

  setup_params(x0, y0, a, b, g, o, l, d){
    this.params = {}
    this.params.x0 = x0
    this.params.y0 = y0
    this.params.a = a
    this.params.b = b
    this.params.g = g
    this.params.o = o
    this.params.l = l
    this.params.d = d
  }

  step(x, y){
    let zzbar = x*x + y*y
    let p = this.params.a*zzbar + this.params.l
    let zreal = x
    let zimag = y

    for(let j = 0; j < this.params.d-2; j++){
      let za = zreal*x - zimag*y
      let zb = zimag*x + zreal*y
      zreal = za
      zimag = zb
    }

    let zn = x*zreal - y*zimag

    p += this.params.b*zn

    let xnew = p*x + this.params.g*zreal - this.params.o*y
    let ynew = p*y - this.params.g*zimag + this.params.o*x

    return [xnew, ynew]
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))

    this.p.geometry.vertices.forEach((v)=>{
        let xy = this.step(v.x, v.y)
        v.x = xy[0]
        v.y = xy[1]
    })
    // this.p.material.color['r'] = Math.sin(x*10)
    // this.p.material.color['g'] = Math.cos(y/2)
    this.group.rotation.z += 0.001;

    this.p.geometry.verticesNeedUpdate = true;
    this.renderer.render(this.scene, this.camera)
  };
}

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

let anim = new SymmetricAttractor(scene, camera, renderer);
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
console.log(params)
anim.setup_params(...params)
anim.init()
anim.animate()

// const pointsGeometry = new THREE.BufferGeometry();
//
// let points = [];
// // let x = 25, y = 25, z = 0
// // const a = -1.4
// // const b = 1.7
// // const c = 1
// // const d = 0.7
// // const dt = 1.4
//
// // function step(x, y, z){
// //   let xn = Math.sin(a*y) + c*Math.cos(a*x)
// //   let yn = Math.sin(b*x) + d*Math.cos(b*y)
// //   return [xn, yn, 0]
// // }
//
// // function step(x, y, z){
// //   let xn = Math.sin(a*y) + c*Math.cos(a*x)
// //   let yn = Math.sin(b*x) + d*Math.cos(b*y)
// //   return [x + dt*xn, y + dt*yn, 0]
// // }
// //
// //
//
// let x = 0.001
// let y = 0.001
// let z = 0
// const a = -2.5
// const b = -0.1
// const g = 0.9
// const o = -0.15
// const l = 2.39
// const d = 5
//
// function step(x, y, z){
//   let zzbar = x*x + y*y
//   let p = a*zzbar + l
//   let zreal = x
//   let zimag = y
//
//   for(let j = 0; j < d-2; j++){
//     let za = zreal*x - zimag*y
//     let zb = zimag*x + zreal*y
//     zreal = za
//     zimag = zb
//   }
//
//   let zn = x*zreal - y*zimag
//
//   p += b*zn
//
//   let xnew = p*x + g*zreal - o*y
//   let ynew = p*y - g*zimag + o*x
//
//   return [xnew, ynew, 0]
// }
//
// for(let i = 0; i < 38; i++){
//   let xyz = step(x, y, 0)
//   console.log(xyz)
//   x = xyz[0]
//   y = xyz[1]
//   z = xyz[2]
//   points.push(new THREE.Vector3(x, y, z).multiplyScalar(1))
// }
//
// let geometry = new THREE.Geometry();
// var curve = new THREE.CatmullRomCurve3(points);
// geometry.vertices = curve.getPoints(200000);
// // geometry.vertices = points
//
// let pcMat = new THREE.PointsMaterial();
// pcMat.color = new THREE.Color(0xFFFFFF);
// pcMat.transparent = true;
// pcMat.size = 0.00001;
// pcMat.blending = THREE.AdditiveBlending;
//
// let pc = new THREE.Points(geometry, pcMat);
// pc.sizeAttenuation = false;
// pc.sortPoints = true;
// let raycaster = new THREE.Raycaster();
//
// let group = new THREE.Group()
// group.add(pc)
// scene.add(group)
//
// // camera.position.z = 5;
// // camera.position.y = 27;
// // camera.position.x = 23;
// camera.position.z = 1;
// camera.position.y = 0;
// camera.position.x = 0;
//
// const animate = function () {
//   requestAnimationFrame(animate);
//
//   let geometry = pc.geometry;
//   console.log(geometry.vertices.length)
//   geometry.vertices.forEach(function(v){
//       let xyz = step(v.x, v.y, v.z)
//       v.x = xyz[0]
//       v.y = xyz[1]
//       v.z = xyz[2]
//   })
//   pc.material.color['r'] = Math.sin(x*10)
//   pc.material.color['g'] = Math.cos(y/2)
//
//   geometry.verticesNeedUpdate = true;
//   // group.rotation.z += 0.001;
//   renderer.render(scene, camera)
// };
//
// animate();
