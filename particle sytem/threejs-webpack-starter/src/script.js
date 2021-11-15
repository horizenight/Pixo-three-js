import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from "gsap";


//Texture Loader
const tloader = new THREE.TextureLoader()
const cross = tloader.load('./x-mark-16.png')






// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 3000;

const posArray = new Float32Array(particlesCnt *3)
//xyz xyz 

for(let i =0;i<particlesCnt*3;i++){
  // posArray[i]=Math.random()
  //  posArray[i]=Math.random()-0.5
  //  posArray[i]=(Math.random()-0.5)*5
   posArray[i]=(Math.random()-0.5)*(Math.random() *6)
}

particlesGeometry.setAttribute('position',new THREE.BufferAttribute(posArray,3))
//setiing poisiton atricbute against three buffer geomerty

const loader = new GLTFLoader();
loader.load(
  "/assets/wraith.gltf",
  function (gltf) {
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.rotation.set(0, 3.3, 0);

    const geometry = gltf.scene.children[0].geometry;
    geometry.computeVertexNormals(false);

    let mesh = new THREE.Points(geometry, material);
    mesh.position.x = 0;

    mesh.position.y = 0;
    mesh.rotateY(4.7);
    mesh.scale.set(1,1,1)
    scene.add(mesh);

    

    /**
     * Animate
     */

    document.addEventListener("mousemove", onDocumentMouseMove);

    let mouseX = 0;
    let mouseY = 0;

    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function onDocumentMouseMove(event) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    }

    const updateMesh = (event) => {
        mesh.position.y = window.scrollY * 0.001;
      };

    window.addEventListener("scroll", updateMesh);

    //this affect the movement by viewport

    const world = () => {
      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;
      const elapsedTime = clock.getElapsedTime();

      // Update objects
      mesh.rotation.y = 0.5 * elapsedTime;

     

      // Update Orbital Controls
      // controls.update()

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(world);
    };
    world();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error ocurred");
  }
);
// Materials

const material = new THREE.PointsMaterial({
  size: 0.005
})
const particleMaterial = new THREE.PointsMaterial({
  size:0.0065,
  map: cross,
  transparent: true,
  // color: 'blue',
  // blending: THREE.AdditiveBlending
})


// Mesh
// const sphere = new THREE.Mesh(geometry,material)
// scene.add(sphere)

const particlesMesh = new THREE.Points(particlesGeometry,particleMaterial);
scene.add(particlesMesh)


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#21282a'),1)


//Mouse 
document.addEventListener('mousemove',animateParticles)



let mouseX = 0
let mouseY = 0


function animateParticles(event){
  mouseY = event.clientY
  mouseX = event.clientX
}







/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime
    particlesMesh.rotation.y = -.09 * elapsedTime
    

    if(mouseX>0){
    particlesMesh.rotation.x = -mouseY * (elapsedTime*0.00008)
    particlesMesh.rotation.y = -mouseX * (elapsedTime*0.00008)

    }
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()