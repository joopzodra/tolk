import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import {DatabaseService} from '../services/database.service';
import {constants} from '../helpers/constants';

@Component({
  selector: 'trapp-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  search = new FormControl('');
  lang = new FormControl('lang1')
  searchLanguage = 'lang1';
  @Output() searchLanguageEvent = new EventEmitter<string>()
  columnNames = ['',''];
  constants = constants;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private databaseService: DatabaseService,
  ) { }

  ngOnInit() {
    const columnNames = JSON.parse(localStorage.getItem('columnNames'));
    this.searchLanguageEvent.emit(this.searchLanguage);
    if (columnNames) {
      this.columnNames = columnNames;
    } 

    this.databaseService.sheetMetaStream.subscribe(sheetMeta => {
      this.columnNames = sheetMeta.columnNames;
      this.changeDetector.detectChanges();
    });

    this.search.valueChanges
    .pipe(
      debounceTime(250),      
    )
    .subscribe(searchTerm => {
      this.databaseService.select(searchTerm, this.searchLanguage);
    });

    this.lang.valueChanges.subscribe(lang => {
      this.searchLanguage = lang;
      this.searchLanguageEvent.emit(lang);
    });
  }
}
