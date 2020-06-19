import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DialogService } from './dialog.service';
import { nl } from '../helpers/nl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private username = new BehaviorSubject < string | undefined > (undefined);
  public usernameStream = this.username.asObservable();

  constructor(private dialogService: DialogService) {}

  public onGapiAuth2Init() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
    // Handle the initial sign-in state.
    const initialSignInState = gapi.auth2.getAuthInstance().isSignedIn.get();
    this.updateSigninStatus(initialSignInState);
  }

  private updateSigninStatus(isSignedIn) {
    const username = isSignedIn ?
      gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName() : undefined;
    this.username.next(username);
  }

  public signIn() {
    gapi.auth2.getAuthInstance().signIn()
      .catch(err => this.dialogService.emitMessage('warning', nl.LOGIN_CANCELLED, 5000));
  }

  public signOut() {
    gapi.auth2.getAuthInstance().signOut()
      .catch(err => this.dialogService.emitMessage('warning', nl.LOGOUT_CANCELLED, 5000));
  }
}