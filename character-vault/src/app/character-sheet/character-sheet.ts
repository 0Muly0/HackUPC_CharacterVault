import { Component } from '@angular/core';
import { Notes } from "./notes/notes";
import { TwOverlay } from "./handbooks/the-witcher/tw-overlay/tw-overlay";

@Component({
  selector: 'app-character-sheet',
  imports: [Notes, TwOverlay],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss',
})
export class CharacterSheet {

}
