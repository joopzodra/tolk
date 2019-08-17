import { Component, Input, OnInit } from '@angular/core';

import {GapiService} from './services/gapi.service';
import {DatabaseService, Selection} from './services/database.service';

@Component({
  selector: 'tolk-root',
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
        z-index: 1;
      }
      @media only screen and (max-height: 310px) {
        #bottom-container {
        display: none;
        }
      }
  `]
})
export class AppComponent implements OnInit {
  searchLanguage: string;
  selectionSearchTerm: string = '';

  constructor(private gapiService: GapiService, private databaseService: DatabaseService) {}

  ngOnInit() {
    this.gapiService.loadGapi();

    this.databaseService.selectionStream.subscribe(selection => {
      this.selectionSearchTerm = selection.searchTerm;
    });
  }

  onSearchLanguageEvent(lang) {
    this.searchLanguage = lang;
  }
}
