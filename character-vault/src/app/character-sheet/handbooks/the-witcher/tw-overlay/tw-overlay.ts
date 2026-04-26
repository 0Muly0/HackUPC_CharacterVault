import { Component, signal, inject } from '@angular/core';
import { ChWitcher } from '../ch_witcher.model';
import { geralt } from '../ch_witcher.premade';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RACES } from '../config/races.config';
import { Perk } from '../models/race.model';
import { BASE_STATS } from '../config/stats.config';
import { BASE_SKILLS, PROF_SKILLS } from '../config/skills.config';
import { CharacterService } from '../../../character-service';
import { PROFESSIONS } from '../config/professions.config';
import { Dice } from '../../../../dice/dice';
import { Modifier } from '../models/modifier.model';

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
  public profSkillsArray: any[] = [];
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

  public baseStatForm = new FormGroup({
    // Dynamically populated
  })

  public baseSkillForm = new FormGroup({
    // Dynamically populated
  })

  public profSkillForm = new FormGroup({
    // Dynamically populated
  })

  constructor(private charS: CharacterService) {
    this.character = geralt;
    this.initInfoForm();
    this.initBaseStatForm();
    this.initBaseSkillForm();
    this.initProfSkillForm();

    this.toggleLock();
  }

  changeActiveView(newview: 'info'|'stsk'|'prof') {
    this.activeView.set(newview);
  }

  toggleLock() {
    if(this.charS.lock()) {
      this.infoForm.enable();
      this.baseStatForm.enable();
      this.baseSkillForm.enable();
      this.profSkillForm.enable();

      this.charS.lock.set(false);
    } else {
      this.infoForm.disable();
      this.baseStatForm.disable();
      this.baseSkillForm.disable();
      this.profSkillForm.disable();

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

  private initBaseStatForm() {
    this.baseStatsArray = Object.entries(this.character.baseStatSet);
    this.derivStatsArray = Object.entries(this.character.derivStatSet);

    this.baseStatsArray.forEach(([statKey, statLvl]) => {
      this.baseStatForm.addControl(statKey, new FormControl(statLvl, Validators.required))
    })
  }

  private initBaseSkillForm() {
    if(this.character) {

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

            this.baseSkillForm.addControl(skillKey, new FormControl(skillLvl, Validators.required));
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

  private initProfSkillForm() {
    const profess = this.character.profession;

    if(profess) {
      this.profSkillForm.addControl('profession', new FormControl(profess, Validators.required));

      const skillKeys = PROFESSIONS[profess].skillset;
      skillKeys.forEach((profSkillKey) => {
        const profSkillLvl = this.character.profSkillSet ? this.character.profSkillSet[profSkillKey as keyof typeof PROF_SKILLS] : 0;
        this.profSkillForm.addControl(profSkillKey, new FormControl(profSkillLvl, Validators.required));

        let statLvl = 0;
        const stat = PROF_SKILLS[profSkillKey as keyof typeof PROF_SKILLS].stat;
        if(stat) {
          statLvl = this.character.baseStatSet[stat];
        }

        this.profSkillsArray.push({
          profKey: profSkillKey,
          profLvl: profSkillLvl,
          statLvl: statLvl,
          ...PROF_SKILLS[profSkillKey]
        })

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

  public getCharacterBaseStats() {
    return Object.entries(this.character.baseStatSet);
  }

  public getProfessions() {
    if(this.character.race == 'Witcher') {
      return Object.entries(PROFESSIONS).filter(([key]) => key == 'Witcher')
    } else if (this.character.race == 'Dwarf') {
      return Object.entries(PROFESSIONS).filter(([key]) => key != 'Witcher' && key != 'Mage')
    } else {
      return Object.entries(PROFESSIONS).filter(([key]) => key != 'Witcher')
    }
  }
}
