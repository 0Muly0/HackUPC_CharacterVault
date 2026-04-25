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
    const iw = window.innerWidth;
    const ih = window.innerHeight;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({canvas: this.canvas.nativeElement});
    const camera = new THREE.PerspectiveCamera(50, iw / ih, 0.1, 1000);
    let loader: GLTFLoader;

    camera.position.y = 3;
    camera.position.z = 5;
    camera.rotation.x = -(25 * Math.PI) / 180;

    // Add cube
    /*const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshPhongMaterial({color: 0xbbbbbb}));
    cube.position.y = 1;
    scene.add(cube);*/

    
    scene.background = new THREE.Color(0x222222);
    renderer.setSize(iw, ih);
    
    loader = new GLTFLoader();
    let table: any = {}
    const gltf = await loader.loadAsync('/models/table.glb');
    table.mesh = gltf.scene;
    scene.add(table.mesh);
    
    table.mesh.receiveShadow = true;
    table.mesh.castShadow = true;
    table.mesh.rotation.y = -Math.PI / 2;
    //table.mesh.rotation.x = Math.PI / 6;

    // Add light
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.z = 4  ;
    light.position.y = 5;
    light.target = table.mesh;
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.radius = 3;
    const lightHelper = new THREE.DirectionalLightHelper(light, 5);
    scene.add(light);
    scene.add(lightHelper);

    let controls: OrbitControls;
    controls = new OrbitControls(camera, this.canvas.nativeElement);

    // Render Loop
    this.zone.runOutsideAngular(() => {
      function animate() {
        renderer.render(scene, camera);
      }

      renderer.setAnimationLoop(animate);
    });

  }
}
