import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

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

  isSignedIn: boolean;

  constructor(private authService: AuthService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.authService.isSignedIn.subscribe(isSignedIn => {
      this.isSignedIn = isSignedIn;
      this.changeDetector.detectChanges()
    });
  }

  handleAuthClick() {
    this.authService.handleAuthClick();
  }

  handleSignoutClick() {
    this.authService.handleSignoutClick();
  }

}
