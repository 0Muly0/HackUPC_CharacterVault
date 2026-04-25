import { Routes } from '@angular/router';
import { HomePage } from './home/home';
import { CharacterSheet } from './character-sheet/character-sheet';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomePage
    },
    {
        path: 'character-sheet',
        component: CharacterSheet
    }
];
