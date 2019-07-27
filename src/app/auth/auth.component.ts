import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import {GapiService} from '../services/gapi.service';
import {AuthService} from '../services/auth.service';

/* 
 * Using changeDetector.detectChanges() in the subscription because, very oddly, on siging out the default change detection
 * is just triggered on a second attempt.
 */

@Component({
  selector: 'trapp-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {

  gapiLoaded = false;
  isSignedIn = false;
  userName = '';

  constructor(
    private gapiService: GapiService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    ) { }

  ngOnInit() {
    this.gapiService.gapiLoadedStream.subscribe(gapiLoaded => {
      this.gapiLoaded = gapiLoaded;
      this.changeDetector.detectChanges();
    });

    this.authService.isSignedInStream.subscribe(isSignedIn => {
      this.isSignedIn = isSignedIn;
      this.userName = this.authService.userName;
      this.changeDetector.detectChanges();
    });
  }

  onSignIn() {
    this.authService.signIn();
  }

  onSignOut() {
    this.authService.signOut();
  }

  showUserData(basicProfile) {
    console.log('Hi', basicProfile.getGivenName(), basicProfile.getFamilyName())
  }

}
