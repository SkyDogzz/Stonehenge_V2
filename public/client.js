import * as THREE from "three";
import Stats from "/jsm/libs/stats.module.js";

let scene, camera, renderer;
let stats;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.y = 1000;
  camera.lookAt(0, 0, 0);

  const boxGeometry = new THREE.BoxGeometry(200, 200, 200);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const box = new THREE.Mesh(boxGeometry, material);
  scene.add(box);

  stats = Stats();
  document.body.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  stats.update();

  scene.rotation.x += 0.02;
  scene.rotation.y += 0.02;

  renderer.render(scene, camera);
}
