import { Injectable } from '@angular/core';

import {DatabaseService } from './database.service';
import {ErrorService} from './error.service';
import {constants} from '../helpers/constants'

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  spreadsheetTitle = '';
  columnNames = ['', ''];

  constructor(private databaseService: DatabaseService, private errorService: ErrorService) { }

  loadSheet(spreadsheetIdOrUrl): Promise<any> {
    if(!this.gapiExists()) {
      return Promise.reject();
    }

    const spreadsheetId = this.extractId(spreadsheetIdOrUrl);
    if (!spreadsheetId) {
      return;
    }

    return gapi.client.sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    })
    .then(response => {
      this.spreadsheetTitle = response.result.properties.title;
      return response.result.sheets.map(sheet => sheet.properties.title)
    })
    .then(sheetNames => sheetNames.map(sheetName => sheetName + '!A1:B'))
    .then(ranges => gapi.client.sheets.spreadsheets.values.batchGet({
      spreadsheetId: spreadsheetId,
      ranges: ranges
    }))
    .then(response => {
      const valueRanges = response.result.valueRanges.filter(valueRange => valueRange.values);
      if (valueRanges.length) {
        this.columnNames = valueRanges[0].values.slice(0,1)[0];
      }
      valueRanges.forEach(valueRange => valueRange.values.shift());
      const customizedValueRanges = valueRanges.map(valueRange => ({sheetName: valueRange.range.split('!')[0], values: valueRange.values}));
      return this.databaseService.clearTableAndAddNewSheet(customizedValueRanges, this.spreadsheetTitle, this.columnNames)
    });
  }

  gapiExists() {
    if (gapi && gapi.client && gapi.client.sheets) {
      return true;
    } else {
      this.errorService.emitError(constants.NO_GAPI_LOADED);
      return false;
    }
  }

  extractId(idOrUrl: string) {
    if (idOrUrl.trim().length === 0) {
      return undefined;
    }
    const idInUrl = /https:\/\/docs\.google\.com\/spreadsheets\/d\/(.*)\/edit.*/i;
    const matches = idOrUrl.match(idInUrl);
    const idFromUrl = matches && matches[1] ? matches[1] : undefined;
    return idFromUrl ? idFromUrl : idOrUrl;
  }
}
