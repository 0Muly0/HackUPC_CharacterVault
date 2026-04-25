import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private cameraSheet = {
    x: -0.5,
    y: 0.45,
    z: 0.70,
    rotz: 0.07,
    rotx: -Math.PI / 2
  }

  // TODO: bind to camera in component and move from here
}
