import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const discoveryDocs = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
const clientId = '219713688448-mfafknmuknff8ai6ua1eg57ncigbqrt4.apps.googleusercontent.com';
const scopes = 'https://www.googleapis.com/auth/spreadsheets';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO: request google api js in this service; it's now done in index.html

  isSignedIn = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadGapiScript();
  }

  loadGapiScript() {
    const url = "https://apis.google.com/js/api.js";
    let body = <HTMLDivElement> document.head;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.onload = this.handleClientLoad.bind(this);
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  handleClientLoad() {
    // Load the API client and auth2 library
    gapi.load('client:auth2', () => this.initClient());
  }

  initClient() {
    gapi.client.init({
        // Api key can be used also, if you want allow bypassing OAuth in order to use public Google sheets. Then, first create an api key via google developers console.
        apiKey: 'AIzaSyDY3qsYVEpvv1M7ha55H6KDVnxaMzBn4jo',
        discoveryDocs: discoveryDocs,
        clientId: clientId,
        scope: scopes,
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => this.updateSigninStatus(isSignedIn));
      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      this.isSignedIn.next(true);
    } else {
      this.isSignedIn.next(false);
    }
  }
  
  handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
  }
  
  handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
  }
}
