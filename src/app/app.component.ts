import { Component, Input } from '@angular/core';

import {GapiService} from './services/gapi.service';

@Component({
  selector: 'trapp-root',
  templateUrl: './app.html',
  styles: [`
      div {
        height: 100vh;
      }
  `]
})
export class AppComponent {
  searchLanguage: string;

  constructor(private gapiService: GapiService) {
    gapiService.loadGapi();
  }

  onSearchLanguageEvent(lang) {
    this.searchLanguage = lang;
  }
}
