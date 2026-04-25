import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';

import * as TWEEN from '@tweenjs/tween.js';
import GUI from 'lil-gui';

@Component({
  selector: 'app-canvas',
  imports: [],
templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas implements AfterViewInit {
  @ViewChild('c') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private zone: NgZone) {}

  async ngAfterViewInit() {
    // Base viewport params
    const iw = window.innerWidth;
    const ih = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement, 
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(iw, ih);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const camera = new THREE.PerspectiveCamera(40, iw / ih, 0.1, 1000);
    camera.position.y = 1.2;
    camera.position.z = 2.2;
    camera.rotation.x = -(25 * Math.PI) / 180;

    const composer = new EffectComposer(renderer);
    composer.setSize(iw, ih);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new FXAAPass());

    // let controls: OrbitControls;
    // controls = new OrbitControls(camera, this.canvas.nativeElement);
    const gui = new GUI();
    
    let loader: GLTFLoader;
    loader = new GLTFLoader();

    // Load custom asset
    let table: any = {}
    let sheet: any;
    const gltf = await loader.loadAsync('/models/table.glb');
    table.mesh = gltf.scene;
    table.mesh.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name == 'Sheet'){
          console.log(child.name);
          sheet = child;
        }
      }
    });
    table.mesh.rotation.y = -Math.PI / 2;

    scene.add(table.mesh);

    // Lights
    const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,  // strength
      0.4,  // radius
      0.85  // threshold
    );
    composer.addPass(bloomPass);

    const bulbLightOrange = new THREE.PointLight(0xdb4a11, 1, 100, 2);
    bulbLightOrange.castShadow = true;
    bulbLightOrange.power = 900;
    bulbLightOrange.position.y = 7;
    bulbLightOrange.position.z = 7;
    bulbLightOrange.shadow.mapSize.set(2048, 2048);
    bulbLightOrange.shadow.bias = -0.0001;
    bulbLightOrange.shadow.normalBias = 0.05;
    scene.add(bulbLightOrange);

    const bulbLightWhite = new THREE.PointLight(0xeffffff, 1, 100, 2);
    bulbLightWhite.castShadow = true;
    bulbLightWhite.power = 2000;
    bulbLightWhite.position.x = 4;
    bulbLightWhite.position.y = 10;
    bulbLightWhite.position.z = -7;
    bulbLightWhite.shadow.mapSize.set(2048, 2048);
    bulbLightWhite.shadow.bias = -0.00005;
    bulbLightWhite.shadow.normalBias = 0.08;
    scene.add(bulbLightWhite);

    /*
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.target = table.mesh;
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.radius = 3;

    const lightHelper = new THREE.DirectionalLightHelper(light, 5);
    scene.add(light);
    scene.add(lightHelper);
    */
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const tweenGroup = new TWEEN.Group();
    gui.add(camera.position, 'x').listen();
    gui.add(camera.position, 'y').listen();
    gui.add(camera.position, 'z').listen();
    gui.add(camera.rotation, 'x').listen();
    gui.add(camera.rotation, 'y').listen();
    gui.add(camera.rotation, 'z').listen();

    this.canvas.nativeElement.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(sheet, true);
        
        if (intersects.length > 0) {
            console.log("SLEC");
            let dir = new THREE.Vector3();
            camera.getWorldDirection(dir);
            const startingCoords = {
              x: camera.position.x, 
              y: camera.position.y, 
              z: camera.position.z, 
              lx: camera.position.x + dir.x, 
              ly: camera.position.y + dir.y, 
              lz: camera.position.z + dir.z
            };

            new TWEEN.Tween(startingCoords, tweenGroup).to({x: -0.52, y: 0.51, z: 0.73, lx: -0.52, ly: 0, lz:0.73}, 1000).onUpdate(() => {
                camera.position.set(startingCoords.x, startingCoords.y, startingCoords.z);
                camera.lookAt(startingCoords.lx, startingCoords.ly, startingCoords.lz);
            }).start();
        }
    });
    // Render Loop
    this.zone.runOutsideAngular(() => {
      function animate() {
        //controls.update();
        composer.render();
        tweenGroup.update();
      }

      renderer.setAnimationLoop(animate);
    });

  }
}
