import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Subject } from 'rxjs';

import {Database} from '../helpers/database';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  db: Database;
  private sheetMeta = new Subject<{ spreadsheetTitle: string, columnNames: string[]}>();
  public sheetMetaStream = this.sheetMeta.asObservable();
  private selection = new Subject<{lang1: string, lang2: string}[]>();
  public selectionStream = this.selection.asObservable();

  constructor() {
    this.db = new Database('TrappDatabase');
   }

   clearTableAndAddNewSheet(customizedValueRanges: CustomizedValueRange[], spreadsheetTitle: string, columnNames: string[]) {
    const prepVals = this.prepareValues(customizedValueRanges);

    return this.db.transaction('rw', this.db.glossery, () => {
      this.db.glossery.clear();
      this.db.glossery.bulkAdd(prepVals);
    })
    .then(result => {
      localStorage.setItem('spreadsheetTitle', spreadsheetTitle);
      localStorage.setItem('columnNames', JSON.stringify(columnNames));
      this.sheetMeta.next({spreadsheetTitle, columnNames});
      return result;
    });
   }

  prepareValues(customizedValueRanges: CustomizedValueRange[]) {
    const createValuesObject = (range, value) => ({lang1: value[0], lang2: value[1], sheetName: range.sheetName});
    const createRangeWithValuesObjects = (range) => range.values.map(value => createValuesObject(range, value));
    return [].concat(...customizedValueRanges.map(createRangeWithValuesObjects));
  }

  select(term, column) {
    this.db.glossery.where(column).startsWithIgnoreCase(term)
    .limit(5)
    .toArray()
    .then(result => {
      const picked = result.map(row => ({lang1: row.lang1, lang2: row.lang2}));
      this.selection.next(picked);
    });
  }
}

interface CustomizedValueRange {
  sheetName: string,
  values: string[][]
}
