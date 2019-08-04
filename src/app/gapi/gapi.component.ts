import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import {GapiService} from '../services/gapi.service';
import {DialogService} from '../services/dialog.service';
import {nl} from '../helpers/nl';

/*
 * The Google Api script (gapi) is loaded only once in the app's lifetime. It's loading is triggered in the AppComponent.
 * If it could not be loaded on app initialisation, this component will indicate that and offers a button to manually retry loading.
 */

@Component({
  selector: 'trapp-gapi',
  templateUrl: './gapi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GapiComponent implements OnInit {

  gapiLoadStatus = '';
  nl = nl;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private gapiService: GapiService,
    private dialogService: DialogService,
    ) { }

  ngOnInit() {
    this.gapiService.gapiLoadStatusStream.subscribe(status => {
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
}
