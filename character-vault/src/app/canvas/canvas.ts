import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';
import RAPIER from '@dimforge/rapier3d-compat';

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

  world: any;

  constructor(private zone: NgZone) {}

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

    //Camera
    const camera = new THREE.PerspectiveCamera(40, iw / ih, 0.1, 1000);
    camera.position.y = 1.2;
    camera.position.z = 2.2;
    camera.rotation.x = -(25 * Math.PI) / 180;

    //Composer
    const composer = new EffectComposer(renderer);
    composer.setSize(iw, ih);
    composer.addPass(new RenderPass(scene, camera));
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
    this.createPhysics(table, true);
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

    let d6: any = {}
    gltf = await loader.loadAsync('/models/d6.glb');
    d6.mesh = gltf.scene;
    this.createPhysics(d6);
    scene.add(d6.mesh);

    d6.mesh.scale.setScalar(0.1);
    d6.mesh.position.y = 2;

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

   
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const tweenGroup = new TWEEN.Group();

    //Object selection
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

            new TWEEN.Tween(startingCoords, tweenGroup).to({x: -0.52, y: 0.51, z: 0.73, lx: -0.52, ly: 0, lz: 0.73}, 1000).onUpdate(() => {
                camera.position.set(startingCoords.x, startingCoords.y, startingCoords.z);
                camera.lookAt(startingCoords.lx, startingCoords.ly, startingCoords.lz);
            }).start();
        }
    });


    //Responsive
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Render Loop
    this.zone.runOutsideAngular(() => {
      const animate = () => {
        composer.render();
        tweenGroup.update();

        this.world.step();

        if (d6){
            const pos: any = d6.body.translation();
            d6.mesh.position.set(pos.x, pos.y, pos.z);

            const rot: any = d6.body.rotation();
            d6.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
        }
      }

      renderer.setAnimationLoop(animate);
    });

  }

  getConvexVerts(mesh: any){
      const verts: any[] = [];

      mesh.traverse((child: any) => {
          if (child.isMesh){
              const pos = child.geometry.attributes.position;
      
              for (let i = 0; i < pos.count; i++){
                  const v = new THREE.Vector3().fromBufferAttribute(pos, i);
                  v.applyMatrix4(child.matrixWorld);
                  verts.push(v.x, v.y, v.z);
              }
          }
      });

      return new Float32Array(verts);
  }

  getTrimeshVerts(mesh: any){
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

  createPhysics(modelObject: any, rigid = false){
      modelObject.mesh.updateWorldMatrix(true, true);

      let body: any;
      if (rigid){
          const {verts, indices} = this.getTrimeshVerts(modelObject.mesh);
          body = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
          this.world.createCollider(RAPIER.ColliderDesc.trimesh(verts, indices), body);
      }
      else{
          const verts = this.getConvexVerts(modelObject.mesh);
          body = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0,3,0).setLinearDamping(0.6).setAngularDamping(0.6));
          this.world.createCollider(RAPIER.ColliderDesc.convexHull(verts), body);
      }    
      modelObject.body = body;
  }
}
