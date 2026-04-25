import { Component, signal } from '@angular/core';
import { ChWitcher } from '../ch_witcher.model';
import { geralt } from '../ch_witcher.premade';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RACES } from '../config/races.config';
import { Perk } from '../models/race.model';

@Component({
  selector: 'app-tw-overlay',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './tw-overlay.html',
  styleUrl: './tw-overlay.scss',
})
export class TwOverlay {

  public activeView = signal<'info'|'stsk'|'prof'>('info');
  public bookmarks: any[] = [
    {
      id: 'info',
      label: 'basic info',
    }, 
    {
      id: 'stsk',
      label: 'stats & skills',
    },
    {
      id: 'prof',
      label: 'profession',
    }
  ];

  public character: ChWitcher;

  public infoForm = new FormGroup({
    name: new FormControl('', Validators.required),
    age: new FormControl(0, Validators.required),
    gender: new FormControl('', Validators.required),
    appearance: new FormControl(''),
    personality: new FormControl(''),
    life: new FormControl(''),
    race: new FormControl('Human')
  });

  constructor() {
    this.character = geralt;
    this.initInfoForm();
  }

  changeActiveView(newview: 'info'|'stsk'|'prof') {
    this.activeView.set(newview);
  }

  toggleLock() {
    this.infoForm.disabled 
      ? this.infoForm.enable()
      : this.infoForm.disable()
  }

  private initInfoForm() {
    if(this.character) {
      this.infoForm.patchValue({
        name: this.character.name,
        age: this.character.age,
        gender: this.character.gender,
        appearance: this.character.appearance,
        personality: this.character.personality,
        life: this.character.life,
        race: this.character.race
      })
    }
  }

  public getRaceDescription(): string {
    if(this.character.race) {
      return RACES[this.character.race].description;
    } else {
      return '';
    }
  }

  public getRacePerks(): Perk[] {
    if(this.character.race) {
      return RACES[this.character.race].perks;
    } else {
      return [];
    }
  }
}
