import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {DatabaseService} from '../services/database.service';
import {nl} from '../helpers/nl';

@Component({
  selector: 'tolk-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {

  spreadSheetTitle = '';
  sheetMetaSubscription: Subscription;

  constructor(private databaseService: DatabaseService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    const title = localStorage.getItem('spreadsheetTitle');
    this.spreadSheetTitle = title ? title : nl.NO_SPREADSHEET_TITLE;

    this.databaseService.sheetMetaStream.subscribe(sheetMeta => {
      this.spreadSheetTitle = sheetMeta.spreadsheetTitle;
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.sheetMetaSubscription.unsubscribe();
  }
}
