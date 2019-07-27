import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {ErrorService} from './error.service';
import {constants} from '../helpers/constants'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isSignedIn = new BehaviorSubject<boolean>(false);
  public isSignedInStream = this.isSignedIn.asObservable();
  public userName = '';

  constructor(private errorService: ErrorService) {}

  onGapiAuth2Init() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => this.updateSigninStatus(isSignedIn));
    // Handle the initial sign-in state.
    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());    
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      this.userName = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
      this.isSignedIn.next(true);
    } else {
      this.userName = '';
      this.isSignedIn.next(false);
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
      this.errorService.emitError(constants.NO_GAPI_LOADED);
      return false;
    }
  }
}
