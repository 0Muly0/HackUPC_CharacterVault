import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {

  public lock = signal<boolean>(false);
  
}
