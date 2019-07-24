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
  makeApiCall(spreadsheetId) {    
    (<any>gapi.client.sheets.spreadsheets).get({
      spreadsheetId: spreadsheetId,
      //range: 'Blad1!A2:B'
    }).then((response) => {
      this.getTabs(response)
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
    }, (response) => {
      this.appendPre('Error: ' + response.result.error.message);
    });
  }

  getTabs(response) {
    console.log(response.result.sheets)
  }

}
