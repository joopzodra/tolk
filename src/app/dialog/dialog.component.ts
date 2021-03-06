import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import {of, Subscription} from 'rxjs';
import {tap, map, concatMap, delay, filter} from 'rxjs/operators';

import {DialogService, DialogMessage} from '../services/dialog.service';
import {nl} from '../helpers/nl';

@Component({
  selector: 'tolk-dialog',
  templateUrl: './dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit, OnDestroy {

  keys = Object.keys;
  messages: {[key: number]: DialogMessage} = {};
  nl = nl;
  dialogSubscription: Subscription;

  constructor(private errorService: DialogService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    let counter = 0;
    this.dialogSubscription = this.errorService.dialogStream
    .pipe(
      filter(message => this.isNewMessage(message)),
      tap(message => {
        this.messages[++counter] = message;
        this.changeDetector.detectChanges();
      }),
      concatMap(message => of(counter).pipe(delay(message.time)))      
      )
    .subscribe(counter => {
      delete this.messages[counter];
      this.changeDetector.detectChanges();
    });
  }

  clearMessage(key: number) {
    delete this.messages[key];
    this.changeDetector.detectChanges();
  }

  isNewMessage(message) {
    return !Object.values(this.messages).some(mess => mess.body === message.body);
  }

  ngOnDestroy() {
    this.dialogSubscription.unsubscribe();
  }
}
