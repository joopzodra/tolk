import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';

import {SearchService} from '../services/search.service';
import {SheetService} from '../services/sheet.service';

@Component({
  selector: 'trapp-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  search = new FormControl('');
  @Output() searchResult = new EventEmitter<string>();

  constructor(
    private searchService: SearchService,
    private sheetService: SheetService
  ) { }

  ngOnInit() {
    this.search.valueChanges
    .pipe(
      debounceTime(300),
      switchMap(search => this.searchService.getValues(search)),
      )
    .subscribe(result => this.searchResult.emit(result))
  }

}
