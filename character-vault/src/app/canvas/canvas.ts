import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
    renderer.setSize(iw, ih);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const camera = new THREE.PerspectiveCamera(50, iw / ih, 0.1, 1000);
    camera.position.y = 3;
    camera.position.z = 5;
    camera.rotation.x = -(25 * Math.PI) / 180;

    let controls: OrbitControls;
    controls = new OrbitControls(camera, this.canvas.nativeElement);
    
    let loader: GLTFLoader;
    loader = new GLTFLoader();

    // Load custom asset
    let table: any = {}
    const gltf = await loader.loadAsync('/models/table.glb');
    table.mesh = gltf.scene;
    table.mesh.receiveShadow = true;
    table.mesh.castShadow = true;
    table.mesh.rotation.y = -Math.PI / 2;

    scene.add(table.mesh);

    // Lights

    const bulbLightOrange = new THREE.PointLight(0xdb4a11, 1, 100, 2);
    bulbLightOrange.power = 900;
    bulbLightOrange.position.y = 7;
    bulbLightOrange.position.z = 7;
    scene.add(bulbLightOrange);

    const bulbLightWhite = new THREE.PointLight(0xe8dd0b, 1, 100, 2);
    bulbLightWhite.power = 2000;
    bulbLightWhite.position.x = 4;
    bulbLightWhite.position.y = 7;
    bulbLightWhite.position.z = -7;
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


    // Render Loop
    this.zone.runOutsideAngular(() => {
      function animate() {
        renderer.render(scene, camera);
      }

      renderer.setAnimationLoop(animate);
    });

  }
}
