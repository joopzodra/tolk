import { Component, Input, OnInit } from '@angular/core';

import {GapiService} from './services/gapi.service';

@Component({
  selector: 'trapp-root',
  templateUrl: './app.html',
  styles: [`
      #app-container {
        height: 100vh;
      }
      #top-container {
        position: absolute;
        z-index: 1;
        width: 100%;
      }
      #bottom-container {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
  `]
})
export class AppComponent implements OnInit {
  searchLanguage: string;

  constructor(private gapiService: GapiService) {}

  ngOnInit() {
    this.gapiService.loadGapi();
  }

  onSearchLanguageEvent(lang) {
    this.searchLanguage = lang;
  }
}
