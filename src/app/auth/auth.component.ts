import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { distinctUntilKeyChanged, map } from 'rxjs/operators';

import {GapiService} from '../services/gapi.service';
import {AuthService} from '../services/auth.service';
import {nl} from '../helpers/nl';

/* 
 * Using changeDetector.detectChanges() in the subscription because, very oddly, on siging out the default change detection
 * is just triggered on a second attempt.
 */

@Component({
  selector: 'tolk-auth',
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {

  gapiLoadStatus = '';
  username: string;
  nl = nl;

  constructor(
    private gapiService: GapiService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    ) { }

  ngOnInit() {
    this.gapiService.gapiLoadStatusStream.subscribe(status => {
      this.gapiLoadStatus = status;
      this.changeDetector.detectChanges();
    });

    this.authService.usernameStream.subscribe(username => {
      this.username = username;
      this.changeDetector.detectChanges();
    });
  }

  onSignIn() {
    this.authService.signIn();
  }

  onSignOut() {
    this.authService.signOut();
  }

}
