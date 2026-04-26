import { Injectable } from '@angular/core';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Subject } from 'rxjs';

type DiceContext = {
  diceArray: number[];
  camera: THREE.PerspectiveCamera;
  loader: GLTFLoader;
  scene: THREE.Scene;
  world: RAPIER.World;
}

@Injectable({
  providedIn: 'root',
})
export class Dice {

  private context!: DiceContext;

  registerContext(contextId: string, diceArray: number[], camera: THREE.PerspectiveCamera, loader: GLTFLoader, scene: THREE.Scene, world: RAPIER.World) {
    this.context = { diceArray, camera, loader, scene, world };
  }

  private getConvexVerts(mesh: any){
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

  private createPhysics(modelObject: any, world: any){
      modelObject.mesh.updateWorldMatrix(true, true);

      let body: any;
      console.log(modelObject.collider.name);
      const verts = this.getConvexVerts(modelObject.collider);
      body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0,3,0).setLinearDamping(0.6).setAngularDamping(0.6));
      world.createCollider(RAPIER.ColliderDesc.convexHull(verts), body);
      modelObject.body = body;
    }

  private resultSubject = new Subject<number[]>();
  result$ = this.resultSubject.asObservable();

  private currentRoll: Map<number, number> = new Map();
  private totalDices = 0;
  private patternMatch: any;

  async rollDice(formula: string){
    if (!this.context) throw new Error(`Context not registered`);

    this.patternMatch = formula.match(/^(?<number>[0-4])d(?<dice>4|6|8|10|12|20|100)(?<op>[\+\-\*\/]\d+)?$/mi);

    if (!this.patternMatch?.groups) {
      throw new Error("Invalid formula");
    }
    for (let i = 0; i < parseInt(this.patternMatch.groups['number']); i++){
      let dice: any = {};
      dice.id = i;

      let diceType = this.patternMatch.groups['dice'];
      let gltf = await this.context.loader.loadAsync('/models/d'+diceType+'.glb');
      let arrowLocation = (diceType == '4') ? 'vert' : 'face';
      console.log("Lancio di " + this.patternMatch.groups['number'] + "d" + this.patternMatch.groups['dice']);
  
      dice.mesh = gltf.scene;
      this.context.scene.add(dice.mesh);
      dice.faces = [];
      dice.mesh.traverse((child: any) => {
        if (child.name.startsWith(arrowLocation)){
          dice.faces.push(child);
          //  console.log(child.name);
        } else if (child.name == 'collider'){
          child.visible = false;
          dice.collider = child;
          // console.log("COLLIDER: " + child.name);
        }
      });
      this.createPhysics(dice, this.context.world);
      
      dice.mesh.scale.setScalar(0.05);
      dice.body.setTranslation({
        x: this.context.camera.position.x - 0.05,
        y: this.context.camera.position.y + 0.5,
        z: this.context.camera.position.z + 0.02
      }, true);
      dice.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      // dice.body.setAngvel({ x: Math.random() * 3, y: Math.random() * 2, z: Math.random() * -3 }, true);
      dice.done = false;
  
      this.context.diceArray.push(dice);
    }
    this.currentRoll.clear();
    this.totalDices = this.context.diceArray.length;
  }

  reportResult(result: {id: number, value: number}){
    this.currentRoll.set(result.id, result.value);

    if (this.currentRoll.size == this.totalDices){
      let resultsArray = Array.from(this.currentRoll.values());
      let sum = 0;
      for (let result of resultsArray)
        sum += result;
      resultsArray.push(sum);
      if (this.patternMatch.groups['op']){
        let op = this.patternMatch.groups['op'];
        switch (op[0]){
          case '+':
            resultsArray.push(sum + parseInt(op.slice(1)));
            break;
          case '-':
            resultsArray.push(sum - parseInt(op.slice(1)));
            break;
          case '*':
            resultsArray.push(sum * parseInt(op.slice(1)));
            break;
          case '/':
            resultsArray.push(sum / parseInt(op.slice(1)));
            break;
        }
      }
      this.resultSubject.next(resultsArray);

    }
  }
}
