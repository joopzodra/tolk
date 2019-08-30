import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DialogMessage {
  type: string,
  body: string,
  time: number
}

type NgBootstrapAlertType = 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary' | 'light' | 'dark'

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialog = new Subject<DialogMessage>();
  public dialogStream = this.dialog.asObservable();

  constructor() { }

  emitMessage(type: NgBootstrapAlertType, body: string, time: number) {
    // type should
    this.dialog.next({type,body, time});
  }
}
