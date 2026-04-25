import { Injectable } from '@angular/core';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  public camera!: THREE.PerspectiveCamera;
  public tweenGroup: TWEEN.Group = new TWEEN.Group();

  private cameraPos = {
    homeView: {
      router: '/',
      coord: {
        x: 0,
        y: 1.2,
        z: 2.2,
        rotX: -(25 * Math.PI) / 180,
        rotY: 0,
        rotZ: 0
      }
    },
    sheetView: {
      router: '/character-sheet',
      coord: {
        x: -0.5,
        y: 0.45,
        z: 0.70,
        rotX: -Math.PI / 2,
        rotY: 0,
        rotZ: 0.07
      }
    }  
  }

  constructor(
    private router: Router
  ) {}

  public initializeCamera() {
    const iw = window.innerWidth;
    const ih = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(40, iw / ih, 0.1, 1000);
    this.camera.position.y = 1.2;
    this.camera.position.z = 2.2;
    this.camera.rotation.x = -(25 * Math.PI) / 180;
  }

  public moveCamera(view: 'sheetView' | 'homeView', route: boolean) {
    const state = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
      rotX: this.camera.rotation.x,
      rotY: this.camera.rotation.y,
      rotZ: this.camera.rotation.z
    };

    new TWEEN.Tween(state, this.tweenGroup)
      .to(
        this.cameraPos[view].coord,
        1000
      )
      .onUpdate(() => {
        this.camera.position.set(state.x, state.y, state.z);
        this.camera.rotation.x = state.rotX;
        this.camera.rotation.y = state.rotY;
        this.camera.rotation.z = state.rotZ;
      })
      .onComplete(() => {
        if(route) {
          this.router.navigate([this.cameraPos[view].router]);
        }
      })
      .start();
  }
}
