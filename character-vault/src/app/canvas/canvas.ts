import { AfterViewInit, Component, ElementRef, NgZone, ViewChild, inject } from '@angular/core';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';
import RAPIER from '@dimforge/rapier3d-compat';
import { Dice } from  '../dice/dice';

import { CameraService } from './camera-service';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas implements AfterViewInit {
  @ViewChild('c') canvas!: ElementRef<HTMLCanvasElement>;

  // private diceService = inject(Dice);
  private diceArray: any[]= [];
  
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private world: any;

  constructor(
    private zone: NgZone,
    private cameraS: CameraService,
    private diceService: Dice
  ) {}

  async ngAfterViewInit() {
    // Base viewport params
    const iw = window.innerWidth;
    const ih = window.innerHeight;
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    
    //Renderer
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

    //Composer
    const composer = new EffectComposer(renderer);
    composer.setSize(iw, ih);
    composer.addPass(new RenderPass(scene, this.cameraS.camera));
    composer.addPass(new FXAAPass());
    
    //Loader
    let loader: GLTFLoader;
    loader = new GLTFLoader();

    //Rapier
    await RAPIER.init();
    this.world = new RAPIER.World({x: 0.0, y: -2.81, z: 0.0});

    // Load table
    let table: any = {}
    let sheet: any;
    let gltf = await loader.loadAsync('/models/table.glb');
    table.mesh = gltf.scene;
    this.rigidPhysics(table, true);
    table.mesh.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name == 'Sheet'){
          sheet = child;
        } else if (child.name == 'invisible'){
           child.visible = false;
        }
      }
    });
    // On click
    this.addOnClickEvent(sheet)

    //table.mesh.rotation.y = -Math.PI / 2;
    scene.add(table.mesh);
    
    //Dice
    this.diceService.registerContext('world', this.diceArray, this.cameraS.camera, loader, scene, this.world);
    //this.diceService.rollDice('2d6+2', 'world');
    this.diceService.result$.subscribe(values => {
      alert('RESULT: ' + values[0] + ' + ' + (values[values.length-1] - values[0]) + ' = ' + values[values.length-1]);
    });
    
    // Lights
    const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,  
      0.4,  
      0.85  
    );
    composer.addPass(bloomPass);

    const bulbLightOrange = new THREE.PointLight(0xf6bf88, 1, 100, 2);
    bulbLightOrange.castShadow = true;
    bulbLightOrange.power = 900;
    bulbLightOrange.position.y = 6;
    bulbLightOrange.position.z = 3;
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

    const bulbLightDice = new THREE.PointLight(0xeffffff, 8, 10, 2);
    bulbLightDice.castShadow = true;
    bulbLightDice.power = 2;
    bulbLightDice.position.x = -0.8;
    bulbLightDice.position.y = 0.55;
    bulbLightDice.position.z = 0.70;
    bulbLightDice.shadow.mapSize.set(2048, 2048);
    bulbLightDice.shadow.bias = -0.00005;
    bulbLightDice.shadow.normalBias = 0.08;
    scene.add(bulbLightDice);

    // Resize
    window.addEventListener('resize', () => {
      this.cameraS.camera.aspect = window.innerWidth / window.innerHeight;
      this.cameraS.camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Render Loop
    this.zone.runOutsideAngular(() => {
      const animate = () => {
        composer.render();
        this.cameraS.tweenGroup.update();

        this.world.step();

        for (let dice of this.diceArray){
            const pos: any = dice.body.translation();
            dice.mesh.position.set(pos.x, pos.y, pos.z);

            const rot: any = dice.body.rotation();
            dice.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
            
            if (dice.body.isSleeping() && !dice.done){
              const result = this.getTopFace(dice);
              console.log("RISULTATO " + result);
              this.diceService.reportResult({id: dice.id, value: result})
              dice.done = true;
            }
        }
      }

      renderer.setAnimationLoop(animate);
    });

  }

  private getTrimeshVerts(mesh: any){
      const verts: any[] = [];
      const indices: any[] = [];
      let indexOffset = 0;

      mesh.traverse((child: any) => {
          if (child.isMesh){
              const pos = child.geometry.attributes.position;
              const idx = child.geometry.index;

              for (let i = 0; i < pos.count; i++){
                  const v = new THREE.Vector3().fromBufferAttribute(pos, i);
                  v.applyMatrix4(child.matrixWorld);
                  verts.push(v.x, v.y, v.z);
              }

              if (idx){
                  for (let i = 0; i < idx.count; i++)
                      indices.push(idx.array[i] + indexOffset);
              } else{
                  for (let i = 0; i < pos.count; i++)
                      indices.push(i + indexOffset);
              }
              indexOffset += pos.count;
          }
      });

      return {verts: new Float32Array(verts), indices: new Uint32Array(indices)};
  }

  private rigidPhysics(modelObject: any, rigid = false){
      modelObject.mesh.updateWorldMatrix(true, true);

      let body: any;
      const {verts, indices} = this.getTrimeshVerts(modelObject.mesh);
      body = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
      this.world.createCollider(RAPIER.ColliderDesc.trimesh(verts, indices), body);
      modelObject.body = body;
  }

  private getTopFace(die: any){
    let bestDot = -Infinity;
    let bestFace = -1;
    const worldUp = new THREE.Vector3(0,1,0);

    die.faces.forEach((arrow: any) => {
      const dir = new THREE.Vector3(0, 1, 0);
      dir.applyQuaternion(arrow.getWorldQuaternion(new THREE.Quaternion()));

      const dot = dir.dot(worldUp);
      if (dot > bestDot){
        bestDot = dot;
        // console.log("calculating: " + arrow.name.slice(-1));
        bestFace = parseInt(arrow.name.slice(5));
        if (bestFace == 0)
          bestFace = 10;
      }

    });
    return bestFace;
  }

  private addOnClickEvent(sheet: any) {
    this.canvas.nativeElement.addEventListener('click', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.cameraS.camera);
      const intersects = this.raycaster.intersectObject(sheet, true);
      if (!intersects.length) return;

      this.cameraS.moveCamera('sheetView', true);
  });
  }
}
