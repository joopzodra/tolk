import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { distinctUntilKeyChanged, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
export class AuthComponent implements OnInit, OnDestroy {

  gapiStatus = '';
  username: string;
  nl = nl;
  gapiStatusSubscription: Subscription;

  constructor(
    private gapiService: GapiService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    ) { }

  ngOnInit() {
    this.gapiStatusSubscription = this.gapiService.gapiStatusStream.subscribe(status => {
      this.gapiStatus = status;
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

  ngOnDestroy() {
    this.gapiStatusSubscription.unsubscribe();
  }

}
