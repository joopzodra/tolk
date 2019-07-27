import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import {DatabaseService} from '../services/database.service';
import {constants} from '../helpers/constants';

@Component({
  selector: 'trapp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  spreadSheetTitle = 'Geen sheet'

  constructor(private databaseService: DatabaseService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    const title = localStorage.getItem('spreadsheetTitle');
    this.spreadSheetTitle = title ? title : constants.NO_SPREADSHEET_TITLE;

    this.databaseService.sheetMetaStream.subscribe(sheetMeta => {
      this.spreadSheetTitle = sheetMeta.spreadsheetTitle;
      this.changeDetector.detectChanges();
    });
  }
}
