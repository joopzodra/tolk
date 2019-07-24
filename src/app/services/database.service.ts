import { Injectable } from '@angular/core';
import Dexie from 'dexie';

class Database extends Dexie {
    glossery: Dexie.Table<SheetRow, number>;
    constructor (databaseName) {
        super(databaseName);
        this.version(1).stores({
            glossery: '++id,sheetrow'
        });
        this.glossery = this.table('glossery'); // Just informing Typescript what Dexie has already done...
    }
}


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() {
    const db = new Database('TrappDatabase');
    db.open().catch(err => {
        console.error(`Open failed: ${err.stack}`);
    });
    console.log(db)
   }
}

interface SheetRow {
    id?: number,
    sheetRow: string[]
}
