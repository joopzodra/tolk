import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import {DatabaseService} from '../services/database.service';
import {nl} from '../helpers/nl';

@Component({
  selector: 'tolk-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  spreadSheetTitle = '';

  constructor(private databaseService: DatabaseService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    const title = localStorage.getItem('spreadsheetTitle');
    this.spreadSheetTitle = title ? title : nl.NO_SPREADSHEET_TITLE;

    this.databaseService.sheetMetaStream.subscribe(sheetMeta => {
      this.spreadSheetTitle = sheetMeta.spreadsheetTitle;
      this.changeDetector.detectChanges();
    });
  }
}
