import './style.css'

import * as THREE from 'three';
import { DEG2RAD } from 'three/src/math/MathUtils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import vertexShaderAtmo from './assets/shaders/atmosphereVertex.glsl'
import fragmentShaderAtmo from './assets/shaders/atmosphereFragment.glsl'
import { MeshStandardMaterial } from 'three';


const MAX_FAR_PLANE = 2000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,MAX_FAR_PLANE);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),antialias:true,
});

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);

renderer.shadowMap.enabled = true;

camera.position.set(0,15,25);
camera.lookAt(0,0,0);

renderer.render(scene,camera);

//Helpers
 const controls = new OrbitControls(camera, renderer.domElement);
 controls.maxDistance = 100;
 controls.minDistance = 8;

//Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,0,80);
pointLight.castShadow = true;
pointLight.bias = -0.0001;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

scene.add(pointLight);

//Skybox
const skyTexMap = new THREE.TextureLoader().load('./assets/skybox.jpg');

const skyBox = new THREE.Mesh(
  new THREE.SphereGeometry(1000,16,16),
  new THREE.MeshBasicMaterial({map:skyTexMap,side:THREE.BackSide}),
);
scene.add(skyBox);


//Moon
const moonTexMap = new THREE.TextureLoader().load('./assets/moon.jpg');
const moonTexNormal = new THREE.TextureLoader().load('./assets/moon_normal.jpg');

const moonObj = new THREE.Mesh(
  new THREE.SphereGeometry(1.737,32,32),
  new THREE.MeshStandardMaterial({map: moonTexMap,normalMap:moonTexNormal}),
);
moonObj.rotateY(DEG2RAD*15);
moonObj.position.set(30,0,0);
moonObj.castShadow = true;
moonObj.receiveShadow = true;

//Moon
const earthTexMap = new THREE.TextureLoader().load('./assets/earth.jpg');

const earthObj = new THREE.Mesh(
  new THREE.SphereGeometry(6.371 ,32,32),
  new MeshStandardMaterial({map:earthTexMap}),
);
earthObj.rotation.x = 0.2;


const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(6.371 ,32,32),
  new THREE.ShaderMaterial({
    vertexShader: vertexShaderAtmo,
    fragmentShader: fragmentShaderAtmo,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  }
  ),
);
atmosphere.scale.set(1.2,1.2,1.2);
earthObj.add(atmosphere);
earthObj.receiveShadow = true;


const earthGroup = new THREE.Group();
earthGroup.add(earthObj,moonObj);
scene.add(earthGroup);


function update() {
  requestAnimationFrame(update);

  moonObj.rotation.y -= 0.02;
  earthObj.rotation.y -= 0.04;
  earthGroup.rotation.y -= 0.002;

  renderer.render(scene, camera);
}

update();