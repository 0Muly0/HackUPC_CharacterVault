import { Injectable, signal } from '@angular/core';
import { CameraService } from '../canvas/camera-service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {

  public lock = signal<boolean>(false);
}
