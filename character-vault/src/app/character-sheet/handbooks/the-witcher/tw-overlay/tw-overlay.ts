import { Component, signal, inject } from '@angular/core';
import { ChWitcher } from '../ch_witcher.model';
import { geralt } from '../ch_witcher.premade';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RACES } from '../config/races.config';
import { Perk } from '../models/race.model';
import { BASE_STATS } from '../config/stats.config';
import { BASE_SKILLS } from '../config/skills.config';
import { CharacterService } from '../../../character-service';
import { Dice } from '../../../../dice/dice'

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
  public baseStatsArray: [string, number][] = [];
  public derivStatsArray: [string, number][] = [];  
  public baseSkillsArray: any[] = [];
  public diceService = inject(Dice);

  public infoForm = new FormGroup({
    name: new FormControl('', Validators.required),
    age: new FormControl(0, Validators.required),
    gender: new FormControl('', Validators.required),
    appearance: new FormControl(''),
    personality: new FormControl(''),
    life: new FormControl(''),
    race: new FormControl('Human')
  });

  constructor(private charS: CharacterService) {
    this.character = geralt;
    this.initInfoForm();
    this.initSkillStatForm();
  }

  changeActiveView(newview: 'info'|'stsk'|'prof') {
    this.activeView.set(newview);
  }

  toggleLock() {
    if(this.infoForm.disabled) {
      this.infoForm.enable();
      this.charS.lock.set(false);
    } else {
      this.infoForm.disable();
      this.charS.lock.set(true);
    }
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

  private initSkillStatForm() {
    if(this.character) {
      this.baseStatsArray = Object.entries(this.character.baseStatSet);
      this.derivStatsArray = Object.entries(this.character.derivStatSet);

      let skillsByStat = [];
      // For each stat
      for(let statKey in BASE_STATS) {
        // Extract stat level
        const statLvl = this.character.baseStatSet[statKey as keyof typeof BASE_STATS];

        // For each ability
        const abilities: any[] = [];
        Object.keys(BASE_SKILLS).forEach((skillKey) => {
          // Recovers the ability info
          const abilitydata = BASE_SKILLS[skillKey as keyof typeof BASE_SKILLS];
          // If the ability is related to the specified stat...
          if(abilitydata.stat === statKey) {
            const skillLvl = this.character.baseSkillSet[skillKey as keyof typeof BASE_SKILLS];

            abilities.push({
              skillKey: skillKey,
              skillLvl: skillLvl,
              label: abilitydata.label,
              description: abilitydata.description,
              weight: abilitydata.weight
            })
          }
        })

        if(abilities.length) {
          skillsByStat.push({
            statKey: statKey,
            statLvl: statLvl,
            label: BASE_STATS[statKey as keyof typeof BASE_STATS].label,
            abilities: abilities
          })
        }
      }
      this.baseSkillsArray = skillsByStat;
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

  public getCharacterBaseStats() {
    return Object.entries(this.character.baseStatSet);
  }
}
