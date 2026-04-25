import { Component } from '@angular/core';
import { Notes } from "./notes/notes";
import { TwOverlay } from "./handbooks/the-witcher/tw-overlay/tw-overlay";
import { CameraService } from '../canvas/camera-service';

@Component({
  selector: 'app-character-sheet',
  imports: [Notes, TwOverlay],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss',
})
export class CharacterSheet {

  public opacityValue: number = 1;
  
  constructor(
    private cameraS: CameraService
  ) {}

  goToHome() {
    this.opacityValue = 0;
    this.cameraS.moveCamera('homeView', true);
  }

}
