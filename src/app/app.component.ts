import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {DatabaseService, Selection} from './services/database.service';
import {GapiService} from './services/gapi.service';

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
      }
      @media only screen and (max-height: 310px) {
        #bottom-container {
        display: none;
        }
      }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  searchLanguage: string;
  selectionSearchTerm: string = '';
  selectionStreamSubscription: Subscription;
  gapiStatus: string = '';
  gapiStatusSubscription: Subscription;

  constructor(private databaseService: DatabaseService, private gapiService: GapiService) {}

  ngOnInit() {
    this.selectionStreamSubscription = this.databaseService.selectionStream.subscribe(selection => {
      this.selectionSearchTerm = selection.searchTerm;
    });
    this.gapiStatusSubscription = this.gapiService.gapiStatusStream.subscribe(status => this.gapiStatus = status);
  }

  onSearchLanguageEvent(lang) {
    this.searchLanguage = lang;
  }

  ngOnDestroy() {
    this.selectionStreamSubscription.unsubscribe();
    this.gapiStatusSubscription.unsubscribe();
  }
}
