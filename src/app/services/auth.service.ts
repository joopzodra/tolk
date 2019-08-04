import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {DialogService} from './dialog.service';
import {nl} from '../helpers/nl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private username = new BehaviorSubject<string | undefined>(undefined);
  public usernameStream = this.username.asObservable();

  constructor(private dialogService: DialogService) {}

  onGapiAuth2Init() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => this.updateSigninStatus(isSignedIn));
    // Handle the initial sign-in state.
    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());    
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      const username = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
      this.username.next(username);
    } else {
      this.username.next(undefined);
    }
  }
  
  signIn() {
    if(!this.gapiExists()) {
      return;
    }
    gapi.auth2.getAuthInstance().signIn();
  }
  
  signOut() {
    if(!this.gapiExists()) {
      return;
    }
    gapi.auth2.getAuthInstance().signOut();
  }

  gapiExists() {
    if (gapi && gapi.auth2) {
      return true;
    } else {
      this.dialogService.emitMessage('error', nl.NO_GAPI_LOADED, 8000);
      return false;
    }
  }
}
