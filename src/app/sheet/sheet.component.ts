import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {AuthService} from '../services/auth.service';
import {SheetService} from '../services/sheet.service';
import {ErrorService} from '../services/error.service';
import {constants} from '../helpers/constants';

/* 
 * Using changeDetector.detectChanges() in the subscription because, very oddly, on siging out the default change detection
 * is just triggered on a second attempt.
 */

@Component({
  selector: 'trapp-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SheetComponent implements OnInit {

  isSignedIn: boolean;
  idOrUrl = new FormControl('');

  constructor(
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService,
    private sheetService: SheetService,
    private errorService: ErrorService
  ) { }

  ngOnInit() {
    this.authService.isSignedInStream.subscribe(isSignedIn => {
      this.isSignedIn = isSignedIn;
      this.changeDetector.detectChanges();
    });
  }

  loadSheet() {
    // TODO proper resolve and reject announcements
    this.sheetService.loadSheet(this.idOrUrl.value)
    .then(() => alert('Je Google sheet is opgeslagen in Trapp'))
    .catch(response => {this.errorService.emitError(constants.SHEETS_LOADING_ERROR); console.log(response)});
  }

}
