import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import {DatabaseService, Selection} from '../services/database.service';
import {nl} from '../helpers/nl';

@Component({
  selector: 'tolk-display',
  templateUrl: './display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayComponent implements OnInit {
  columnNames = ['',''];
  nl = nl;
  selection: Selection = {searchTerm: '', items:[]};
  @Input() searchLanguage: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private databaseService: DatabaseService,
  ) { }

  ngOnInit() {
    const columnNames = JSON.parse(localStorage.getItem('columnNames'));
    if (columnNames) {
      this.columnNames = columnNames;
    } 

    this.databaseService.sheetMetaStream.subscribe(sheetMeta => {
      this.columnNames = sheetMeta.columnNames;
      this.changeDetector.detectChanges();
    });

    this.databaseService.selectionStream.subscribe(selection => {
      this.selection = selection;
      this.changeDetector.detectChanges();
    });
  }
}
