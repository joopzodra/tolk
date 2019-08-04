import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import {Database} from '../helpers/database';

interface CustomizedValueRange {
  sheetName: string,
  values: string[][]
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  db: Database;
  private sheetMeta = new Subject<{ spreadsheetTitle: string, columnNames: string[], sheetNames: string[]}>();
  public sheetMetaStream = this.sheetMeta.asObservable();
  private selection = new Subject<{lang1: string, lang2: string}[]>();
  public selectionStream = this.selection.asObservable();

  constructor() {
    this.db = new Database('TrappDatabase');
    this.db.table('glossery').count().then(c => console.log(c))
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
    if (term === '') {
      this.selection.next([]); 
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
        this.selection.next(picked);
      });      
    } else {
      this.db.glossery
      .where(column).startsWithIgnoreCase(term)
      .limit(5)
      .toArray()
      .then(result => {
        const picked = result.map(row => ({lang1: row.lang1, lang2: row.lang2}));
        this.selection.next(picked);
      });      
    }

  }
}
