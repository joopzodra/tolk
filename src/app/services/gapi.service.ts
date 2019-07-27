import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {AuthService} from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class GapiService {
  private discoveryDocs = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
  private clientId = '219713688448-mfafknmuknff8ai6ua1eg57ncigbqrt4.apps.googleusercontent.com';
  private scopes = 'https://www.googleapis.com/auth/spreadsheets';
  private gapiUrl = 'https://apis.google.com/js/api.js';
  private gapiLoaded = new BehaviorSubject(false);
  public gapiLoadedStream = this.gapiLoaded.asObservable();

  constructor(private authService: AuthService) { }

  loadGapi() {
    const url = this.gapiUrl;
    let head = <HTMLDivElement> document.head;
    let script = document.createElement('script');
    script.src = url;
    script.onload = this.loadGapiClientAndAuth2.bind(this);
    head.appendChild(script);
  }

  loadGapiClientAndAuth2() {
    gapi.load('client:auth2', () => this.initGapiClient());
  }

  initGapiClient() {
    gapi.client.init({
        // Api key is used when a public Google sheets is used and OAuth2 authorisation is not required. 
        apiKey: 'AIzaSyDY3qsYVEpvv1M7ha55H6KDVnxaMzBn4jo',
        discoveryDocs: this.discoveryDocs,
        clientId: this.clientId,
        scope: this.scopes,
    }).then(() => {
      this.gapiLoaded.next(true);
      this.authService.onGapiAuth2Init();
    });
  }
}
