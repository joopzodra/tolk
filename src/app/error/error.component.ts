import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import {ErrorService} from '../services/error.service';
import {constants} from '../helpers/constants';

@Component({
  selector: 'trapp-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent implements OnInit {

  message = '';
  constants = constants;

  constructor(private errorService: ErrorService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.errorService.errorMessageStream.subscribe(message => {
      this.message = message;
      this.changeDetector.detectChanges();
    });
  }

  clearMessage() {
    this.message = '';
    this.changeDetector.detectChanges();
  }

}
