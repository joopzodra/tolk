import { Component } from '@angular/core';

import {GapiService} from './services/gapi.service';

@Component({
  selector: 'trapp-root',
  templateUrl: './app.html',
  styles: []
})
export class AppComponent {
  constructor(private gapiService: GapiService) {
    gapiService.loadGapi();
  }
}
