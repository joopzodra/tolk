import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import {Database} from '../helpers/database';
import {DialogService } from '../services/dialog.service';
import {nl} from '../helpers/nl';
import {unhandledRejectionReasons} from '../helpers/database-unhandled-rejection-reasons';

interface CustomizedValueRange {
  sheetName: string,
  values: string[][]
}

export interface Selection {
  searchTerm: string,
  items: {lang1: string, lang2: string}[]
}

interface SheetMeta {
  spreadsheetTitle: string,
  columnNames: string[],
  sheetNames: string[]
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  db: Database;
  private sheetMeta = new Subject<SheetMeta>();
  public sheetMetaStream = this.sheetMeta.asObservable();
  private selection = new Subject<Selection>();
  public selectionStream = this.selection.asObservable();

  constructor(private dialogService: DialogService) {
    this.db = new Database('TolkDatabase');
    // Error handling in case browser data is manually deleted by user
    window.onunhandledrejection = event => {
      event.preventDefault();
      const rejectionReasonName = event.reason.name;
      if (unhandledRejectionReasons[rejectionReasonName]) {
        this.dialogService.emitMessage('warning', unhandledRejectionReasons[rejectionReasonName], 10000);
      } else {
        this.dialogService.emitMessage('danger', event.reason.message, 10000);
      }
    };
   }

   clearTableAndAddNewSheet(customizedValueRanges: CustomizedValueRange[], spreadsheetTitle: string, columnNames: string[], sheetNames: string[]) {
    const prepVals = this.prepareValues(customizedValueRanges);

    return this.db.transaction('rw', this.db.glossery, () => {
      this.db.glossery.clear();
      this.db.glossery.bulkAdd(prepVals);
    })
    .then(result => {
      localStorage.setItem('spreadsheetTitle', spreadsheetTitle);
      localStorage.setItem('columnNames', JSON.stringify(columnNames));
      localStorage.setItem('sheetNames', JSON.stringify(sheetNames));
      this.sheetMeta.next({spreadsheetTitle, columnNames, sheetNames});
      return result;
    });
   }

  prepareValues(customizedValueRanges: CustomizedValueRange[]) {
    const createValuesObject = (range, value) => ({lang1: value[0], lang2: value[1], sheetName: range.sheetName});
    const createRangeWithValuesObjects = (range) => range.values.map(value => createValuesObject(range, value));
    return [].concat(...customizedValueRanges.map(createRangeWithValuesObjects));
  }

  select(term, column, sheet) {
    this.db.glossery.count().then(count => count !== 0 || this.dialogService.emitMessage('warning', nl.DATABASE_EMPTY, 8000));
    if (term === '') {
      this.selection.next({searchTerm: term, items: []}); 
      return;     
    }
    if (sheet) {
      this.db.glossery
      .where(column).startsWithIgnoreCase(term)
      .and(row => row.sheetName === sheet)
      .limit(5)
      .toArray()
      .then(result => {
        const picked = result.map(row => ({lang1: row.lang1, lang2: row.lang2}));
        this.selection.next({searchTerm: term, items: picked});
      });      
    } else {
      this.db.glossery
      .where(column).startsWithIgnoreCase(term)
      .limit(5)
      .toArray()
      .then(result => {
        const picked = result.map(row => ({lang1: row.lang1, lang2: row.lang2}));
        this.selection.next({searchTerm: term, items: picked});
      });      
    }

  }
}
