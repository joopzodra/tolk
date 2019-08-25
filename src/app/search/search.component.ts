import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ViewChildren, ElementRef, OnDestroy, QueryList } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { NgbDropdown, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, Subscription, fromEvent, Observable, from } from 'rxjs';
import { startWith, map, mergeAll } from 'rxjs/operators';

import { DatabaseService } from '../services/database.service';
import { nl } from '../helpers/nl';

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
    #clear-search-input, #language-selector label {
      cursor: pointer;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
  search = new FormControl('');
  languageSelector: FormGroup;
  searchByBegin = new FormControl(true)
  @Output() searchLanguageEvent = new EventEmitter<string>()
  columnNames = ['', ''];
  sheetNames = [];
  nl = nl;
  sheetFilterText = '';
  initialLanguage = 'lang1'

  sheetMetaSubscription: Subscription;
  searchSubscription: Subscription;
  @ViewChildren(NgbDropdownItem) sheetFilterDropdownItems: QueryList<NgbDropdownItem>;

  // Dropdown properties. NgBootstrap doesn't show the options before page refreshing, so we handle this by ourselves.
  @ViewChild('dropdown', { static: false })
  private dropdown: ElementRef;
  @ViewChild('dropdownMenu', { static: false })
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

    this.sheetMetaSubscription = this.databaseService.sheetMetaStream.subscribe(sheetMeta => {
      this.columnNames = sheetMeta.columnNames;
      this.sheetNames = sheetMeta.sheetNames;
      this.changeDetector.detectChanges();
    });

    this.languageSelector = this.formBuilder.group({
      'lang': this.initialLanguage
    });

    document.querySelector('body').addEventListener('click', this.closeDropdown.bind(this));
  }

  ngAfterViewInit() {
    // ViewChildren sheetFilterDropdownItems exists after view init, so not in onInit.

    const searchValueStream = (this.search.valueChanges as Observable<string>).pipe(
      debounceTime(250),
      startWith('')
    );
    const languageSelectorStream = (this.languageSelector.get('lang').valueChanges as Observable<string>).pipe(
      startWith(this.initialLanguage)
    );
    const searchByBeginStream = (this.searchByBegin.valueChanges as Observable<boolean>).pipe(
      startWith(true)
    );

    const sheetFilterTextStream = from(this.sheetFilterDropdownItems.toArray()).pipe(
      map((dropdownButton) => fromEvent(dropdownButton.elementRef.nativeElement, 'click')),
      mergeAll(),
      map(event => {
        const buttonText = (event.target as HTMLButtonElement).textContent;
        return buttonText === nl.ALL_SHEETS ? '' : buttonText;
      }),
      startWith('')
    );

    this.searchSubscription = combineLatest(searchValueStream, languageSelectorStream, sheetFilterTextStream, searchByBeginStream)
      .subscribe(([searchTerm, lang, sheetFilterText, byBegin]) => {
        this.searchLanguageEvent.emit(lang);
        this.databaseService.select(searchTerm, lang, sheetFilterText, byBegin);
      });
  }

  clearInput() {
    this.search.reset('');
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
    this.searchSubscription.unsubscribe();
    document.querySelector('body').removeEventListener('click', this.closeDropdown.bind(this));
  }
}
