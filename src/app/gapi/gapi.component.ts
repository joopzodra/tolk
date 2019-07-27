import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import {GapiService} from '../services/gapi.service';

/*
 * The Google Api script (gapi) is loaded only once in the app's lifetime. It's loading is triggered in the AppComponent.
 * If it could not be loaded on app initialisation, this component will indicate that and offers a button to manually retry loading.
 */

@Component({
  selector: 'trapp-gapi',
  templateUrl: './gapi.component.html',
  styleUrls: ['./gapi.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GapiComponent implements OnInit {

  gapiLoaded = false;

  constructor(private gapiService: GapiService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.gapiService.gapiLoadedStream.subscribe(gapiLoaded => {
      this.gapiLoaded = gapiLoaded;
      this.changeDetector.detectChanges();
    });
  }

  loadGapi() {
    this.gapiService.loadGapi();
  }
}
