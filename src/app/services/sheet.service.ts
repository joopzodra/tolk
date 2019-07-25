import { Injectable } from '@angular/core';

import {DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  constructor(private databaseService: DatabaseService) { }

  showUserData(basicProfile) {
    console.log('Hi', basicProfile.getGivenName(), basicProfile.getFamilyName())
  }

  appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }

    // Load the API and make an API call.  Display the results on the screen.
  getSheetValues(spreadsheetId) {    
    gapi.client.sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
      //range: 'Blad1!A2:B'
    })
    .then(response => response.result.sheets.map(sheet => sheet.properties.title))
    // Of the first sheet we want the column names (A1, B1)
    .then(sheetNames => sheetNames.map((sheetName, index) => index === 0 ? sheetName + '!A1:B' : sheetName + '!A2:B'))
    .then(ranges => gapi.client.sheets.spreadsheets.values.batchGet({
      spreadsheetId: spreadsheetId,
      ranges: ranges
    }))
    .then(response => response.result.valueRanges.map(valueRange => ({sheetName: valueRange.range.split('!')[0], values: valueRange.values})))
    .then(customizedValueRanges => {
      const columnNames = customizedValueRanges[0].values.shift()
      return this.databaseService.loadDatabase(customizedValueRanges, columnNames)
    })
    // TODO proper error handling
    .catch(response => console.log('ERRORTJE', response.result.error));
  }

/*      var range = response.result;      
      if (range.values.length > 0) {
        range.values.forEach(row => {
          row.forEach(cell => {
            this.appendPre(cell);
          })       
        });
      } else {
        this.appendPre('No data found.');
      }*/
/*, (response) => {
      this.appendPre('Error: ' + response.result.error.message);*/


}
