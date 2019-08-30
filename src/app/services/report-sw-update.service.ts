import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { DialogService } from './dialog.service';
import { nl } from '../helpers/nl';

@Injectable({
  providedIn: 'root'
})
export class ReportSwUpdateService {

  constructor(
    private updates: SwUpdate,
    private dialogService: DialogService
  ) {
    updates.available.subscribe(event => {
      this.dialogService.emitMessage('succes', nl.SERVICE_WORKER_UPDATE_AVAILABLE, 10000);
    });

    updates.activated.subscribe(event => {
      this.dialogService.emitMessage('succes', nl.SERVICE_WORKER_UPDATE_ACTIVATED, 4000);
    });
  }
}
