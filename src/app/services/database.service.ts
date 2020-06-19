import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Subject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Database, SheetRow } from '../helpers/database';
import { DialogService } from '../services/dialog.service';
import { nl } from '../helpers/nl';
import { unhandledRejectionReasons } from '../helpers/database-unhandled-rejection-reasons';

interface CustomizedValueRange {
  sheetName: string,
    values: string[][]
}

export interface Selection {
  searchTerm: string,
    items: { lang1: string, lang2: string }[],
    byBegin ? : boolean,
    count ? : number
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
  private db: Database;
  private sheetMeta = new Subject < SheetMeta > ();
  private selection = new Subject < Selection > ();
  private searching = new BehaviorSubject(false);
  public sheetMetaStream = this.sheetMeta.asObservable();
  public selectionStream = this.selection.asObservable();
  public searchingStream = this.searching.asObservable();

  constructor(private dialogService: DialogService) {
    this.db = new Database('TolkDatabase');
    // Error handling of db actions in the select method, in case browser data has manually deleted by user
    window.onunhandledrejection = event => {
      event.preventDefault();
      const rejectionReasonName = event.reason.name;
      switch (event.reason.name) {
        case 'DatabaseClosedError':
          this.dialogService.emitMessage('warning', nl.DATABASE_CLOSED_ERROR, 10000);
          break;
        case 'InvalidStateError':
          this.dialogService.emitMessage('warning', nl.DATABASE_INVALID_STATE_ERROR, 10000);
          break;
        default:
          this.dialogService.emitMessage('danger', event.reason.message, 10000);
          break;
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
        this.sheetMeta.next({ spreadsheetTitle, columnNames, sheetNames });
        return result;
      });
  }

  prepareValues(customizedValueRanges: CustomizedValueRange[]) {
    const createValuesObject = (range, value) => ({ lang1: value[0], lang2: value[1], sheetName: range.sheetName });
    const createRangeWithValuesObjects = (range) => range.values.map(value => createValuesObject(range, value));
    return [].concat(...customizedValueRanges.map(createRangeWithValuesObjects));
  }

  select(term: string, column: string, sheet: string, byBegin: boolean) {
    this.searching.next(true);
    this.db.glossery.count()
      .then(count => count !== 0 || this.dialogService.emitMessage('warning', nl.DATABASE_EMPTY, 8000));
    if (term === '') {
      this.selection.next({ searchTerm: term, items: [] });
      this.searching.next(false);
      return;
    }

    const dbTable = this.db.glossery;
    const maybeByBegin = (dbTable: Dexie.Table < SheetRow, number > ) => {
      if (byBegin) {
        return dbTable.filter(words => words[column].normalize('NFD').replace(/[\u0300-\u036f]/g, '').startsWith(term))
      } else {
        // escape the special regex characters in the term, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        const regex = new RegExp(escapedTerm, 'i');
        // normalize('NDF') etc, see https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        return dbTable.filter(words => regex.test(words[column].normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
      }
    }
    const maybeSheet = (whereClause: Dexie.Collection < SheetRow, number > ) => {
      return sheet ? whereClause.and(row => row.sheetName === sheet) : whereClause;
    }

    const selectionCollection = maybeSheet(maybeByBegin(dbTable));
    const count = selectionCollection.count();
    const results: Promise < Selection > = selectionCollection
      .toArray()
      .then(result => {
        const picked = result.map(row => ({ lang1: row.lang1, lang2: row.lang2 }));
        return { searchTerm: term, items: picked, byBegin: byBegin }
      });

    Promise.all([count, results])
      .then(([count, results]) => {
        results.count = count;
        this.selection.next(results);
        this.searching.next(false);
      })
      .catch(() => this.searching.next(false));
  }
}