import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-tw-overlay',
  imports: [],
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

  constructor() {}

  changeActiveView(newview: 'info'|'stsk'|'prof') {
    this.activeView.set(newview);
  }
}
