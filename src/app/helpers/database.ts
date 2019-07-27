import Dexie from 'dexie';

interface SheetRow {
    id?: number,
    lang1: string,
    lang2: string,
    sheetName: string,
}

export class Database extends Dexie {
    glossery: Dexie.Table<SheetRow, number>;
    constructor (databaseName) {
        super(databaseName);
        this.version(1).stores({
            glossery: 'id++, lang1, lang2, sheetName'
        });
        this.glossery = this.table('glossery'); // Just informing Typescript what Dexie has already done...
    }
}