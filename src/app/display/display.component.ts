import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {DatabaseService, Selection} from '../services/database.service';
import {nl} from '../helpers/nl';

@Component({
  selector: 'tolk-display',
  templateUrl: './display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayComponent implements OnInit, OnDestroy {
  columnNames = ['',''];
  nl = nl;
  selection: Selection = {searchTerm: '', items:[]};
  @Input() searchLanguage: string;
  sheetMetaSubscription: Subscription;
  selectionSubscription: Subscription;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private databaseService: DatabaseService,
  ) { }

  ngOnInit() {
    const columnNames = JSON.parse(localStorage.getItem('columnNames'));
    if (columnNames) {
      this.columnNames = columnNames;
    } 

    this.sheetMetaSubscription = this.databaseService.sheetMetaStream.subscribe(sheetMeta => {
      this.columnNames = sheetMeta.columnNames;
      this.changeDetector.detectChanges();
    });

    this.selectionSubscription = this.databaseService.selectionStream.subscribe(selection => {
      this.selection = selection;
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.sheetMetaSubscription.unsubscribe();
    this.selectionSubscription.unsubscribe();
  }
}
