import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import {DatabaseService} from '../services/database.service';
import {nl} from '../helpers/nl';

@Component({
  selector: 'tolk-search',
  templateUrl: './search.component.html',
  styles: [`
    .dropdown-fix {
      position: relative;
    }
    .dropdown-menu-fix {
      display: block;
      top: 0px;
      left: 0px;
      will-change: transform;
      position: absolute;      
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  search = new FormControl('');
  radioGroupForm: FormGroup;
  searchLanguage = 'lang1';
  @Output() searchLanguageEvent = new EventEmitter<string>()
  columnNames = ['',''];
  sheetNames = [];
  nl = nl;
  sheetFilterText = '';
  sheetMetaSubscription: Subscription;
  radioGroupValueSubscription: Subscription;
  searchValueSubscription: Subscription;

  // Dropdown properties. NgBootstrap doesn't show the options before page refreshing, so we handle this by ourselves.
  @ViewChild('dropdown', {static: false})
  private dropdown: ElementRef;
  @ViewChild('dropdownMenu', {static: false})
  private dropdownMenu: ElementRef;
  dropdownOpen = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private databaseService: DatabaseService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.columnNames = JSON.parse(localStorage.getItem('columnNames')) || this.columnNames;
    this.sheetNames = JSON.parse(localStorage.getItem('sheetNames')) || this.sheetNames;
    this.searchLanguageEvent.emit(this.searchLanguage);

    this.sheetMetaSubscription = this.databaseService.sheetMetaStream.subscribe(sheetMeta => {
      this.columnNames = sheetMeta.columnNames;
      this.sheetNames = sheetMeta.sheetNames;
      this.changeDetector.detectChanges();
    });

    this.radioGroupForm = this.formBuilder.group({
      'lang': 'lang1'
    });

    this.radioGroupValueSubscription = this.radioGroupForm.get('lang').valueChanges.subscribe(lang => {
      this.searchLanguage = lang;
      this.searchLanguageEvent.emit(lang);
    });

    this.searchValueSubscription = this.search.valueChanges
    .pipe(
      debounceTime(250),      
    )
    .subscribe(searchTerm => {
      this.databaseService.select(searchTerm, this.searchLanguage, this.sheetFilterText);
    });

    document.querySelector('body').addEventListener('click', this.closeDropdown.bind(this));
  }

  clearInput() {
    this.search.reset('');
  }

  sheetFilter(sheetName) {
    this.sheetFilterText = sheetName;
    this.databaseService.select(this.search.value, this.searchLanguage, this.sheetFilterText);
  }

  // NgBootstrap doesn't show the options before page refreshing, so we handle this by ourselves.
  toggleDropdown() {
    if (!this.dropdownOpen) {      
      this.dropdown.nativeElement.classList.add('dropdown-fix');
      this.dropdownMenu.nativeElement.classList.add('dropdown-menu-fix');
      const topPosition = this.dropdown.nativeElement.clientHeight;
      const leftPosition = this.dropdown.nativeElement.clientWidth - this.dropdownMenu.nativeElement.clientWidth;
      this.dropdownMenu.nativeElement.style.transform = 
        `translate(${Math.round(leftPosition)}px, ${Math.round(topPosition)}px)`;
      this.dropdownOpen = true;
    } else {
      this.closeDropdown();
    }
  }
  closeDropdown() {
      if (this.dropdown) {
      this.dropdown.nativeElement.classList.remove('dropdown-fix');
      this.dropdownMenu.nativeElement.classList.remove('dropdown-menu-fix');
      this.dropdownOpen = false;
    }
  }
  ngOnDestroy() {
    this.sheetMetaSubscription.unsubscribe();
    this.radioGroupValueSubscription.unsubscribe();
    this.searchValueSubscription.unsubscribe();
    document.querySelector('body').removeEventListener('click', this.closeDropdown.bind(this));
  }
}
