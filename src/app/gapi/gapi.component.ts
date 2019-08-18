import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {GapiService} from '../services/gapi.service';
import {nl} from '../helpers/nl';

/*
 * The Google Api script (gapi) is loaded only once in the app's lifetime. It's loading is triggered in the AppComponent.
 * If it could not be loaded on app initialisation, this component will indicate that and offers a button to manually retry loading.
 */

@Component({
  selector: 'tolk-gapi',
  templateUrl: './gapi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    span.message {
      margin-right: 8px;
    }
  `]
})
export class GapiComponent implements OnInit, OnDestroy {

  gapiStatus = '';
  nl = nl;
  gapiStatusSubscription: Subscription;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private gapiService: GapiService,
    ) { }

  ngOnInit() {
    let timeoutID;
    this.gapiStatusSubscription = this.gapiService.gapiStatusStream.subscribe(status => {
      clearTimeout(timeoutID);
      this.gapiStatus = status;
      this.changeDetector.detectChanges();
      if (status === 'loading') {
        timeoutID = setTimeout(() => {
          this.gapiStatus = 'error';
          this.changeDetector.detectChanges();
        }, 5000);
      }
    });
  }

  reloadGapi() {
    this.gapiService.reloadGapi();
  }

  ngOnDestroy() {
    this.gapiStatusSubscription.unsubscribe();
  }
}
