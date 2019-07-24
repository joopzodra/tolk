/// <reference types="gapi" />

declare namespace gapi.client {

  const sheets: Sheets

  interface Sheets {
    spreadsheets: Spreadsheets
  }

  interface Spreadsheets {
    values: {
      get(options: {}): any
    }
  } 
}