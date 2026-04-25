import { Component } from '@angular/core';
import { geralt } from '../handbooks/the-witcher/ch_witcher.premade';
import { CharacterService } from '../character-service';

@Component({
  selector: 'app-notes',
  imports: [],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
})
export class Notes {
  public notes: string = '';
  
  constructor(public charS: CharacterService) {
    this.notes = geralt.notes;
  }
}
