import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

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

  constructor(
    private changeDetector: ChangeDetectorRef,
    private databaseService: DatabaseService,
  ) { }

  ngOnInit() {
    this.columnNames = JSON.parse(localStorage.getItem('columnNames'));

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
