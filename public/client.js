import * as THREE from "three";
import Stats from "/jsm/libs/stats.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls.js";
import { GUI } from "/jsm/libs/dat.gui.module.js";
import { ColladaLoader } from "/jsm/loaders/ColladaLoader.js";

let rotationSpeed = 0.005;
let rotate = false;

let axesHelper;

let scene, camera, renderer;
let pillarExtGeometry,
  topExtGeometry,
  pillarIntGeometry,
  topIntGeometry,
  pillarMidGeometry,
  groundGeometry,
  altarGeometry,
  altarTopGeometry;
let pillarExtMaterial,
  topExtMaterial,
  pillarIntMaterial,
  topIntMaterial,
  pillarMidMaterial,
  groundMaterial,
  altarMaterial,
  altarTopMaterial;
let pillarExtTexture,
  topExtTexture,
  pillarIntTexture,
  topIntTexture,
  pillarMidTexture,
  groundTexture,
  altarTexture,
  altarTopTexture;
let pillarExt, topExt, pillarInt, topInt, pillarMid, ground, altar, altarTop;
let ambientLight, pointLight;
let controls;
let stats;
let elf;
let mixer;
let animations;
let mixerR = false;
const clock = new THREE.Clock();

init();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    30000
  );
  camera.position.z = 4500;
  camera.position.y = 2500;
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.maxPolarAngle = THREE.Math.degToRad(80);

  scene = new THREE.Scene();

  stats = new Stats();
  document.body.appendChild(stats.dom);

  const loadingManager = new THREE.LoadingManager(function () {
    scene.add(elf);
  });

  const loader = new ColladaLoader(loadingManager);
  loader.load("./models/Jumping Down.dae", function (collada) {
    elf = collada.scene;
    animations = elf.animations;
    elf.scale.set(2.5, 2.5, 2.5);
    elf.position.y = 20;
    elf.position.x = 350 * Math.cos(THREE.MathUtils.degToRad(135));
    elf.position.z = 350 * Math.sin(THREE.MathUtils.degToRad(135));
    elf.rotation.y = THREE.MathUtils.degToRad(135);
    mixer = new THREE.AnimationMixer(elf);
    mixer.clipAction(animations[0]).play();
    mixerR = true
  });

  axesHelper = new THREE.AxesHelper(10000); 
  axesHelper.visible = false;
  scene.add(axesHelper);

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  pointLight = new THREE.PointLight(0xffffff, 0.6, 0);
  pointLight.position.set(3000, 6000, 0);
  pointLight.shadow.mapSize.width = 2048;
  pointLight.shadow.mapSize.height = 2048;
  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 35000;
  pointLight.castShadow = true;
  scene.add(pointLight);

  groundTexture = new THREE.TextureLoader().load("textures/grass-1500.png");
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(50, 50);

  groundGeometry = new THREE.BoxGeometry(100000, 0.01, 100000);

  groundMaterial = new THREE.MeshPhongMaterial({ map: groundTexture });
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.receiveShadow = true;
  scene.add(ground);

  pillarExtTexture = new THREE.TextureLoader().load("textures/stone-1024.jpg");
  pillarExtGeometry = new THREE.BoxGeometry(200, 500, 100);
  pillarExtMaterial = new THREE.MeshPhongMaterial({ map: pillarExtTexture });

  for (let i = 0; i < 28; i++) {
    pillarExt = new THREE.Mesh(pillarExtGeometry, pillarExtMaterial);
    pillarExt.position.y = 250;
    pillarExt.position.x =
      1600 * Math.cos(THREE.MathUtils.degToRad((i * 360) / 28));
    pillarExt.position.z =
      1600 * Math.sin(THREE.MathUtils.degToRad((i * 360) / 28));
    pillarExt.rotation.y = -THREE.MathUtils.degToRad((i * 360) / 28 + 90);
    pillarExt.receiveShadow = true;
    pillarExt.castShadow = true;
    scene.add(pillarExt);
  }

  topExtTexture = new THREE.TextureLoader().load("textures/stone-1024.jpg");
  topExtGeometry = new THREE.BoxGeometry(150, 100, 350);
  topExtMaterial = new THREE.MeshPhongMaterial({ map: topExtTexture });

  for (let i = 0; i < 28; i++) {
    topExt = new THREE.Mesh(topExtGeometry, topExtMaterial);
    topExt.position.y = 550;
    topExt.position.x =
      1600 * Math.cos(THREE.MathUtils.degToRad(((i + 0.5) * 360) / 28));
    topExt.position.z =
      1600 * Math.sin(THREE.MathUtils.degToRad(((i + 0.5) * 360) / 28));
    topExt.rotation.y = -THREE.MathUtils.degToRad(((i + 0.5) * 360) / 28);
    topExt.receiveShadow = true;
    topExt.castShadow = true;
    scene.add(topExt);
  }

  pillarIntTexture = new THREE.TextureLoader().load("textures/stone-1024.jpg");
  pillarIntGeometry = new THREE.BoxGeometry(200, 600, 100);
  pillarIntMaterial = new THREE.MeshPhongMaterial({ map: pillarIntTexture });

  for (let i = 0; i < 10; i++) {
    pillarInt = new THREE.Mesh(pillarIntGeometry, pillarIntMaterial);
    pillarInt.position.y = 300;
    pillarInt.position.x =
      800 * Math.cos(THREE.MathUtils.degToRad((i * 360) / 12));
    pillarInt.position.z =
      800 * Math.sin(THREE.MathUtils.degToRad((i * 360) / 12));
    pillarInt.rotation.y = -THREE.MathUtils.degToRad((i * 360) / 12 + 90);
    pillarInt.receiveShadow = true;
    pillarInt.castShadow = true;
    scene.add(pillarInt);
  }

  topIntTexture = new THREE.TextureLoader().load("textures/stone-1024.jpg");
  topIntGeometry = new THREE.BoxGeometry(200, 100, 600);
  topIntMaterial = new THREE.MeshPhongMaterial({ map: topIntTexture });

  for (let i = 0; i < 5; i++) {
    topInt = new THREE.Mesh(topIntGeometry, topIntMaterial);
    topInt.position.y = 650;
    topInt.position.x =
      800 * Math.cos(THREE.MathUtils.degToRad(((i + 0.25) * 360) / 6));
    topInt.position.z =
      800 * Math.sin(THREE.MathUtils.degToRad(((i + 0.25) * 360) / 6));
    topInt.rotation.y = -THREE.MathUtils.degToRad(((i + 0.25) * 360) / 6);
    topInt.receiveShadow = true;
    topInt.castShadow = true;
    scene.add(topInt);
  }

  pillarMidTexture = new THREE.TextureLoader().load("textures/stone-1024.jpg");
  pillarMidGeometry = new THREE.BoxGeometry(80, 200, 100);
  pillarMidMaterial = new THREE.MeshPhongMaterial({ map: pillarMidTexture });

  for (let i = 0; i < 53; i++) {
    pillarMid = new THREE.Mesh(pillarMidGeometry, pillarMidMaterial);
    pillarMid.position.y = 100;
    pillarMid.position.x =
      1400 * Math.cos(THREE.MathUtils.degToRad(((i - 5) * 360) / 56));
    pillarMid.position.z =
      1400 * Math.sin(THREE.MathUtils.degToRad(((i - 5) * 360) / 56));
    pillarMid.rotation.y = -THREE.MathUtils.degToRad(((i - 5) * 360) / 56);
    pillarMid.receiveShadow = true;
    pillarMid.castShadow = true;
    scene.add(pillarMid);
  }

  altarTexture = new THREE.TextureLoader().load("textures/stone-1024.jpg");
  altarGeometry = new THREE.BoxGeometry(700, 200, 400);
  altarMaterial = new THREE.MeshPhongMaterial({ map: altarTexture });

  altar = new THREE.Mesh(altarGeometry, altarMaterial);
  altar.position.y = 100;
  altar.position.x = 350 * Math.cos(THREE.MathUtils.degToRad(135));
  altar.position.z = 350 * Math.sin(THREE.MathUtils.degToRad(135));
  altar.rotation.y = -THREE.MathUtils.degToRad(45);
  altar.receiveShadow = true;
  altar.castShadow = true;
  scene.add(altar);

  altarTopTexture = new THREE.TextureLoader().load("textures/stone-1024.jpg");
  altarTopGeometry = new THREE.BoxGeometry(740, 20, 440);
  altarTopMaterial = new THREE.MeshPhongMaterial({ map: altarTopTexture });

  altarTop = new THREE.Mesh(altarTopGeometry, altarTopMaterial);
  altarTop.position.y = 210;
  altarTop.position.x = 350 * Math.cos(THREE.MathUtils.degToRad(135));
  altarTop.position.z = 350 * Math.sin(THREE.MathUtils.degToRad(135));
  altarTop.rotation.y = -THREE.MathUtils.degToRad(45);
  altarTop.receiveShadow = true;
  altarTop.castShadow = true;
  scene.add(altarTop);

  panel();
  animate();

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
  const delta = clock.getDelta();

  if (mixerR) mixer.update(delta);

  scene.rotation.y += rotationSpeed * rotate;

  renderer.render(scene, camera);
}

function panel() {
  var params = {
    rotationSpeed: 0.005,
    switch: true,
    helper: false,
  };

  const gui = new GUI({ width: 320 });

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder
    .add(params, "switch")
    .name("Auto Rotation")
    .onChange(() => {
      rotate = !rotate;
    });
  cameraFolder
    .add(params, "rotationSpeed", -0.1, 0.1)
    .name("Rotation Speed")
    .onChange((speed) => {
      rotationSpeed = speed;
    });
  cameraFolder
    .add(params, "helper")
    .name("Axes Helper")
    .onChange(() => {
      axesHelper.visible = !axesHelper.visible;
    });

  const lightsFolder = gui.addFolder("Lights");
  const ambientLightFolder = lightsFolder.addFolder("Ambient Light");
  ambientLightFolder.add(ambientLight, "intensity", 0, 1).name("Intensity");
  const pointLightFolder = lightsFolder.addFolder("Point Light");
  pointLightFolder.add(pointLight, "intensity", 0, 1).name("Intensity");
  pointLightFolder.add(pointLight.position, "x", -5000, 5000).name("X");
  pointLightFolder.add(pointLight.position, "y", 0, 10000).name("Y");
  pointLightFolder.add(pointLight.position, "z", -5000, 5000).name("Z");
}
