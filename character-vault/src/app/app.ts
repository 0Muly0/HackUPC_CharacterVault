import { Component, HostListener, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Canvas } from "./canvas/canvas";
import { CameraService } from './canvas/camera-service';

@Component({
  selector: 'app-root',
  imports: [Canvas, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('character-vault');
  
  currentPath: string = '';

  constructor(
    private router: Router, 
    private cameraS: CameraService
  ) {
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Extracts the path to which the user is navigating to
        this.currentPath = event.urlAfterRedirects; 
      }
    });
  }

  // Listens to popstate (go back one) event in the browser
  @HostListener('window:popstate', ['$event'])
  handlePopState(event: PopStateEvent) {
    // Extracts the past url
    event.state;
    debugger
    const destination = this.currentPath;

    if(destination.includes('home')) {
      this.cameraS.moveCamera('sheetView', false);
    } else {
      this.cameraS.moveCamera('homeView', false);
    }
  }
}
