import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import {DatabaseService} from '../services/database.service';
import {nl} from '../helpers/nl';

@Component({
  selector: 'trapp-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  search = new FormControl('');
  radioGroupForm: FormGroup;
  searchLanguage = 'lang1';
  @Output() searchLanguageEvent = new EventEmitter<string>()
  columnNames = ['',''];
  sheetNames = [];
  nl = nl;
  sheetFilterText = '';

  constructor(
    private changeDetector: ChangeDetectorRef,
    private databaseService: DatabaseService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.columnNames = JSON.parse(localStorage.getItem('columnNames')) || this.columnNames;
    this.sheetNames = JSON.parse(localStorage.getItem('sheetNames')) || this.sheetNames;
    this.searchLanguageEvent.emit(this.searchLanguage);

    this.databaseService.sheetMetaStream.subscribe(sheetMeta => {
      this.columnNames = sheetMeta.columnNames;
      this.sheetNames = sheetMeta.sheetNames;
      this.changeDetector.detectChanges();
    });

    this.radioGroupForm = this.formBuilder.group({
      'lang': 'lang1'
    });

    this.radioGroupForm.get('lang').valueChanges.subscribe(lang => {
      this.searchLanguage = lang;
      this.searchLanguageEvent.emit(lang);
    });

    this.search.valueChanges
    .pipe(
      debounceTime(250),      
    )
    .subscribe(searchTerm => {
      this.databaseService.select(searchTerm, this.searchLanguage, this.sheetFilterText);
    });
  }

  clearInput() {
    this.search.reset('');
  }

  sheetFilter(sheetName) {
    this.sheetFilterText = sheetName;
    this.databaseService.select(this.search.value, this.searchLanguage, this.sheetFilterText);
  }
}
