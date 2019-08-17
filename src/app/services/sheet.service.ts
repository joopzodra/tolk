  import { Injectable } from '@angular/core';

import {DatabaseService } from './database.service';
import {DialogService} from './dialog.service';
import {nl} from '../helpers/nl'

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  spreadsheetTitle = '';
  columnNames = ['', ''];
  sheetNames = [];

  constructor(private databaseService: DatabaseService, private dialogService: DialogService) { }

  loadSheet(url): Promise<any> {
    const spreadsheetId = this.extractId(url);
    if (!spreadsheetId) {
      return Promise.reject({status: 'noId'});
    }
    this.saveUrl(url);
    return gapi.client.sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    })
    .then(response => {
      this.spreadsheetTitle = response.result.properties.title;
      return response.result.sheets.map(sheet => sheet.properties.title)
    })
    .then(sheetNames => {
      this.sheetNames = sheetNames;
      return sheetNames.map(sheetName => sheetName + '!A1:B');
    })
    .then(ranges => gapi.client.sheets.spreadsheets.values.batchGet({
      spreadsheetId: spreadsheetId,
      ranges: ranges
    }))
    .then(response => {
      const valueRanges = response.result.valueRanges.filter(valueRange => valueRange.values);
      if (valueRanges.length) {
        this.columnNames = valueRanges[0].values.slice(0,1)[0];
      }
      this.columnNames = this.setColumnNames(this.columnNames);
      // First rows are expected to be the column names. Remove them all.
      valueRanges.forEach(valueRange => valueRange.values.shift());
      const customizedValueRanges = valueRanges.map(valueRange => ({sheetName: valueRange.range.split('!')[0], values: valueRange.values}));
      return this.databaseService.clearTableAndAddNewSheet(customizedValueRanges, this.spreadsheetTitle, this.columnNames, this.sheetNames);
    });
  }

  gapiExists() {
    if (gapi && gapi.client && gapi.client.sheets) {
      return true;
    } else {
      this.dialogService.emitMessage('error', nl.NO_GAPI_LOADED, 8000);
      return false;
    }
  }

  extractId(url: string) {
    if (url.trim().length === 0) {
      return undefined;
    }
    const idInUrl = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/i;
    const matches = url.match(idInUrl);
    const idFromUrl = matches && matches[1] ? matches[1] : undefined;
    return idFromUrl;
  }

  setColumnNames(columnNames) {
    if (columnNames.length === 0) {
      return [nl.COLUMN + ' A', nl.COLUMN + ' B'];
    }
    let newColumnNames;
    if (columnNames.length === 1) {
      newColumnNames = [columnNames[0].trim(), '']
    } else {
      newColumnNames = columnNames.map(name => name.trim());
    }
    newColumnNames = newColumnNames.map((name, index) => name ? name : nl.COLUMN + ' ' + ['A', 'B'][index]);
    return newColumnNames   
  }

  saveUrl(urlToSave) {
    const urlsArray = JSON.parse(localStorage.getItem('spreadsheetUrls')) || [];
    let newUrlsArray = urlsArray.filter(url => url !== urlToSave);
    newUrlsArray.unshift(urlToSave);
    if (newUrlsArray.length > 3) {
      newUrlsArray.pop();
    }
    localStorage.setItem('spreadsheetUrls', JSON.stringify(newUrlsArray));
  }
}
