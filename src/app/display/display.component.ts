import { Component, OnInit, Input, OnChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import {DatabaseService} from '../services/database.service';
import {constants} from '../helpers/constants';

@Component({
  selector: 'trapp-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class DisplayComponent implements OnInit {
  columnNames = ['',''];
  constants = constants;
  selection = [];
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

  ngOnChanges() {
    
  }
}
