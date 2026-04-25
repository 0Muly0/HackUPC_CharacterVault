import { Injectable } from '@angular/core';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({
  providedIn: 'root',
})
export class Dice {

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

  async rollDice(formula: string, diceArray: any[], camera: THREE.PerspectiveCamera, loader: GLTFLoader, scene: THREE.Scene, world: RAPIER.World){

    let patternMatch = formula.match(/^(?<number>[0-4])d(?<dice>4|6|8|10|12|20|100)(?<op>[\+\-\*\/]\d+)?$/mi);

    if (!patternMatch?.groups) {
      throw new Error("Invalid formula");
    }

    let dice: any = {};
    let diceNumber = patternMatch.groups['dice'];
    let gltf = await loader.loadAsync('/models/d'+diceNumber+'.glb');
    let arrowLocation = (diceNumber == '4') ? 'vert' : 'face';

    dice.mesh = gltf.scene;
    scene.add(dice.mesh);
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
    this.createPhysics(dice, world);
    
    dice.mesh.scale.setScalar(0.3);
    dice.body.setTranslation({ x: 0, y: 1, z: 1 }, true);
    dice.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    dice.body.setAngvel({ x: Math.random() * 3, y: Math.random() * 2, z: Math.random() * -3 }, true);

    diceArray.push(dice);
  }
}
