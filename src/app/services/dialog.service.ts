import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DialogMessage {
  type: string,
  body: string,
  time: number
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialog = new Subject<DialogMessage>();
  public dialogStream = this.dialog.asObservable();

  constructor() { }

  emitMessage(type: string, body: string, time: number) {
    this.dialog.next({type,body, time});
  }
}
