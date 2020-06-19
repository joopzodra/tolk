import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class GapiService {
  private discoveryDocs = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
  private clientId = '219713688448-mfafknmuknff8ai6ua1eg57ncigbqrt4.apps.googleusercontent.com';
  private scopes = 'https://www.googleapis.com/auth/spreadsheets';
  private gapiUrl = 'https://apis.google.com/js/api.js';

  private gapiStatus = new BehaviorSubject('');
  public gapiStatusStream = this.gapiStatus.asObservable();

  constructor(private authService: AuthService) {
    if (navigator.onLine) {
      this.loadGapi();
    } else {
      this.gapiStatus.next('offline');
    }
    window.addEventListener('offline', this.onOffline.bind(this));
    window.addEventListener('online', this.onOnline.bind(this));
  }

  public reloadGapi() {
    this.removeGapiScript();
    this.loadGapi();
  }

  private loadGapi() {
    this.gapiStatus.next('loading');
    const url = this.gapiUrl;
    let head = < HTMLDivElement > document.head;
    let script = document.createElement('script');
    script.src = url;
    script.id = 'gapi-script'
    script.onload = this.loadGapiClientAndAuth2.bind(this);
    script.onerror = this.gapiLoadError.bind(this);
    head.appendChild(script);
  }

  private loadGapiClientAndAuth2() {
    gapi.load('client:auth2', this.initGapiClient.bind(this));
  }

  private initGapiClient() {
    gapi.client.init({
      // Api key is used when a public Google sheets is used and OAuth2 authorisation is not required. 
      apiKey: 'AIzaSyDY3qsYVEpvv1M7ha55H6KDVnxaMzBn4jo',
      discoveryDocs: this.discoveryDocs,
      clientId: this.clientId,
      scope: this.scopes,
    }).then(() => {
      this.gapiStatus.next('loaded');
      this.authService.onGapiAuth2Init();
    }).catch(() => this.gapiLoadError());
  }

  private gapiLoadError() {
    this.gapiStatus.next('error');
    this.removeGapiScript();
  }

  private removeGapiScript() {
    const gapiScript = document.querySelector('#gapi-script');
    if (gapiScript) {
      gapiScript.parentElement.removeChild(gapiScript);
    }
  }

  private onOffline() {
    this.gapiStatus.next('offline');
  }

  private onOnline() {
    const gapiScript = document.querySelector('#gapi-script');
    if (!gapiScript) {
      this.loadGapi();
    } else if (!gapiScript.getAttribute('gapi_processed')) {
      gapiScript.parentElement.removeChild(gapiScript);
      this.loadGapi();
    } else {
      this.gapiStatus.next('loaded');
    }
  }
}