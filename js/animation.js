import * as THREE from 'three';

function generic_f(a, b, c, d, theta_sym, z) {
  const numerator = math.add(math.multiply(a, z), b);
  const denominator = math.add(math.multiply(c, z), d);
  const result = math.multiply(
    math.divide(numerator, denominator),
    math.exp(math.multiply(math.i, theta_sym))
  );

  return result;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const pointsGeometry = new THREE.BufferGeometry();
let vertices = [];

// Add points to the geometry
vertices.push(0, 0, 0); // x, y, z of the first point

pointsGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(vertices, 3)
);

const pointsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.001,
});

// Create points mesh
const points = new THREE.Points(pointsGeometry, pointsMaterial);

// Add points mesh to the scene
scene.add(points);

// Set camera position
camera.position.z = 1;

let last_point = math.complex(1, 1)
let n_ifs = 9
let a = math.complex(0, 0.74)
let b = math.complex(0, -0.61)
let c = math.complex(0, -3.15)
let d = math.complex(0, +1.26)
const MAX_POINTS = 100000

const animate = function () {
  requestAnimationFrame(animate);

  for(let i = 0; i < 100; i++){
    let k = Math.floor(Math.random() * (n_ifs + 1));
    let new_point = generic_f(a, b, c, d, (k*2*Math.PI/n_ifs), last_point)

    addPoint(new_point.re, new_point.im, 0)
    last_point = new_point
  }
  if(vertices.length > MAX_POINTS){
    vertices.splice(0, 100*3)
  }
  points.rotation.z += 0.001;

  renderer.render(scene, camera);
};

const addPoint = function (x, y, z) {
  vertices.push(x, y, z);
  console.log(vertices.length)
  pointsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );
};

animate();
