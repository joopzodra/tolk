import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {SheetService} from '../services/sheet.service';
import {DialogService} from '../services/dialog.service';
import {nl} from '../helpers/nl';
import {GapiService} from '../services/gapi.service';

/* 
 * Using changeDetector.detectChanges() in the subscription because, very oddly, on siging out the default change detection
 * is just triggered on a second attempt.
 */

@Component({
  selector: 'tolk-sheet',
  templateUrl: './sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
      .url-list-item {
        word-break: break-word;
        font-size: 0.8rem;
      }
      #enable-sheet-loading-button-container {
        display: flex;
        justify-content: flex-end;
      }
    `]
  })
export class SheetComponent implements OnInit, OnDestroy {

  urlInput = new FormControl('');
  gapiStatus = '';
  sheetLoading = false;
  nl = nl;
  urlsList: string[] = [];
  gapiStatusSubscription: Subscription;
  sheetLoadingEnabled = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private sheetService: SheetService,
    private dialogService: DialogService,
    private gapiService: GapiService
  ) { }

  ngOnInit() {
    this.gapiStatusSubscription = this.gapiService.gapiStatusStream.subscribe(status => {
      this.gapiStatus = status;
      this.changeDetector.detectChanges();
    });
  }

  loadSheet() {
    if (this.urlInput.value === '') {
      return;
    }
    this.sheetLoading = true;
    this.changeDetector.detectChanges();
    this.sheetService.loadSheet(this.urlInput.value)
    .then(() => { 
      this.sheetLoading = false;
      this.sheetLoadingEnabled = false;
      this.changeDetector.detectChanges();
      this.dialogService.emitMessage('success', nl.SHEETS_LOADING_SUCCESS, 4000);
      this.sheetService.setUrlUploadResult(this.urlInput.value, 'success', );
      this.urlInput.setValue('');
    })
    .catch(response => {
      this.sheetLoading = false;
      this.changeDetector.detectChanges();
      if (response.name === 'InvalidStateError' || response.name === 'DatabaseClosedError') {
        this.dialogService.emitMessage('danger', nl.DATABASE_INVALID_STATE_ERROR, 10000);
        return;
      }
      switch (response.status) {
        case 404:
          this.dialogService.emitMessage('danger', nl.INCORRECT_SPREADSHEET_URL, 8000);
          break;
        case 403:
          this.dialogService.emitMessage('danger', nl.SPREADSHEET_REQUIRES_AUTORIZATION, 8000);
          break;
        case 'noId':
          this.dialogService.emitMessage('danger', nl.NO_SPREADSHEET_ID, 8000);
          break;  
        default:
          this.dialogService.emitMessage('danger', nl.SHEETS_LOADING_ERROR, 8000);
          break;
      }
      this.sheetService.setUrlUploadResult(this.urlInput.value, 'error', );
    });
  }

  onInputFocus() {
    this.urlsList = JSON.parse(localStorage.getItem('spreadsheetUrls')) || [];
  }

  onInputFocusOut() {
    this.urlsList = [];
  }

  selectUrl(url) {
    this.urlsList = [];
    this.urlInput.setValue(url);
  }

  enableSheetLoading() {
    this.sheetLoadingEnabled = true;
  }

  disableSheetLoading() {
    this.sheetLoadingEnabled = false;
    this.urlInput.setValue('');
  }

  ngOnDestroy() {
    this.gapiStatusSubscription.unsubscribe();
  }

}
