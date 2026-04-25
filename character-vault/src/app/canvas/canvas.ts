import { AfterViewInit, Component, ElementRef, NgZone, ViewChild, inject } from '@angular/core';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';
import RAPIER from '@dimforge/rapier3d-compat';
import { Dice } from  '../dice/dice';

import * as TWEEN from '@tweenjs/tween.js';
import GUI from 'lil-gui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas implements AfterViewInit {
  @ViewChild('c') canvas!: ElementRef<HTMLCanvasElement>;

  private diceService = inject(Dice);
  private diceArray: any[]= [];
  
  private camera!: THREE.PerspectiveCamera;
  
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private tweenGroup: TWEEN.Group = new TWEEN.Group();
  private world: any;
  private gui = new GUI();

  constructor(
    private zone: NgZone,
    private router: Router
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

    this.camera = new THREE.PerspectiveCamera(40, iw / ih, 0.1, 1000);
    this.camera.position.y = 1.2;
    this.camera.position.z = 2.2;
    this.camera.rotation.x = -(25 * Math.PI) / 180;
    //this.camera.position.x = -0.5;
    //this.camera.position.y = 0.45;
    //this.camera.position.z = 0.70;
    //this.camera.rotation.z = 0.07;
    //this.camera.rotation.x = -Math.PI / 2;

    //Composer
    const composer = new EffectComposer(renderer);
    composer.setSize(iw, ih);
    composer.addPass(new RenderPass(scene, this.camera));
    composer.addPass(new FXAAPass());
    
    //Loader
    let loader: GLTFLoader;
    loader = new GLTFLoader();

    //Rapier

    await RAPIER.init();
    this.world = new RAPIER.World({x: 0.0, y: -2.81, z: 0.0});

    // Load custom asset
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
        }
      }
    });
    table.mesh.rotation.y = -Math.PI / 2;
    scene.add(table.mesh);
    
    this.diceService.rollDice('2d4-1', this.diceArray, this.camera, loader, scene, this.world);
    this.diceService.result$.subscribe(values => {
      console.log('All dice settled:', values);
    });
    
    // Lights
    const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,  
      0.4,  
      0.85  
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

    this.gui.add(bulbLightWhite.position, 'x');
    this.gui.add(bulbLightWhite.position, 'y');
    this.gui.add(bulbLightWhite.position, 'z');
    const helper = new THREE.PointLightHelper(bulbLightWhite, 1);
    scene.add(helper);
    // On click
    this.addOnClickEvent(sheet)

    // Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Render Loop
    this.zone.runOutsideAngular(() => {
      const animate = () => {
        composer.render();
        this.tweenGroup.update();

        this.world.step();

        for (let dice of this.diceArray){
            const pos: any = dice.body.translation();
            dice.mesh.position.set(pos.x, pos.y, pos.z);

            const rot: any = dice.body.rotation();
            dice.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
            
            if (dice.body.isSleeping() && !dice.done){
              const result = this.getTopFace(dice);
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

  private calcOverlayArea(): void {

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
      }

    });
    return bestFace;
  }

  private addOnClickEvent(sheet: any) {
    this.canvas.nativeElement.addEventListener('click', (event) => {
      /*      
      if (intersects.length > 0) {
        console.log("SLEC");
        let dir = new THREE.Vector3();
        this.camera.getWorldDirection(dir);
        const startingCoords = {
          x: this.camera.position.x, 
          y: this.camera.position.y, 
          z: this.camera.position.z, 
          lx: this.camera.position.x + dir.x, 
          ly: this.camera.position.y + dir.y, 
          lz: this.camera.position.z + dir.z
        };

        new TWEEN.Tween(startingCoords, this.tweenGroup)
        .to({x: -0.52, y: 0.51, z: 0.73, lx: -0.52, ly: 0, lz: 0.73}, 1000)
        .onUpdate(() => {
          this.camera.position.set(startingCoords.x, startingCoords.y, startingCoords.z);
          this.camera.lookAt(startingCoords.lx, startingCoords.ly, startingCoords.lz);
        })
        .onComplete(() => {
          this.router.navigate(['/tw-character']);
        })
        .start();
      }*/

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(sheet, true);
    if (!intersects.length) return;

    const state = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
      rotX: this.camera.rotation.x,
      rotZ: this.camera.rotation.z
    };

    new TWEEN.Tween(state, this.tweenGroup)
      .to(
        {
          x: -0.5,
          y: 0.45,
          z: 0.70,
          rotX: -Math.PI / 2,
          rotZ: 0.07
        },
        1000
      )
      .onUpdate(() => {
        this.camera.position.set(state.x, state.y, state.z);
        this.camera.rotation.x = state.rotX;
        this.camera.rotation.z = state.rotZ;
      })
      .onComplete(() => {
        this.calcOverlayArea();
        this.router.navigate(['/character-sheet']);
      })
      .start();
  });
  }
}
