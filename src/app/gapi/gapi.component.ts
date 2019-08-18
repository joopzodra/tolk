import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {GapiService} from '../services/gapi.service';
import {DialogService} from '../services/dialog.service';
import {nl} from '../helpers/nl';

/*
 * The Google Api script (gapi) is loaded only once in the app's lifetime. It's loading is triggered in the AppComponent.
 * If it could not be loaded on app initialisation, this component will indicate that and offers a button to manually retry loading.
 */

@Component({
  selector: 'tolk-gapi',
  templateUrl: './gapi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GapiComponent implements OnInit, OnDestroy {

  gapiLoadStatus = '';
  nl = nl;
  gapiLoadStatusSubscription: Subscription;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private gapiService: GapiService,
    private dialogService: DialogService,
    ) { }

  ngOnInit() {
    this.gapiLoadStatusSubscription = this.gapiService.gapiLoadStatusStream.subscribe(status => {
      this.gapiLoadStatus = status;
      this.changeDetector.detectChanges();
      if (status === 'error') {
        this.dialogService.emitMessage('warning',nl.NO_GAPI_LOADED, 8000);
      }
    });
  }

  loadGapi() {
    this.gapiService.loadGapi();
  }

  ngOnDestroy() {
    this.gapiLoadStatusSubscription.unsubscribe();
  }
}
