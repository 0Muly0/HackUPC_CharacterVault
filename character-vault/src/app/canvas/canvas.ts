import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas implements AfterViewInit {
  @ViewChild('c') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    const iw = window.innerWidth;
    const ih = window.innerHeight;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({canvas: this.canvas.nativeElement});
    const camera = new THREE.PerspectiveCamera(60, iw / ih, 0.1, 1000);

    camera.position.z = 5;

    // Add cube
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshPhongMaterial({color: 0xbbbbbb}));
    cube.position.y = 1;
    scene.add(cube);

    // Add light
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.z = 3;
    light.position.y = 3;
    scene.add(light);

    scene.background = new THREE.Color(0x222222);
    renderer.setSize(iw, ih);


    // Render Loop
    this.zone.runOutsideAngular(() => {
      function animate() {
        renderer.render(scene, camera);
      }

      renderer.setAnimationLoop(animate);
    });

  }
}
