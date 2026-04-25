import { Routes } from '@angular/router';
import { HomePage } from './home/home';
import { CharacterSheet } from './character-sheet/character-sheet';

export const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'character-sheet',
        component: CharacterSheet
    }
];
