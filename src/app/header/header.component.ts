import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { DatabaseService } from '../services/database.service';
import { nl } from '../helpers/nl';

@Component({
  selector: 'tolk-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    #show-info-modal {
      margin-top: -8px;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {

  spreadSheetTitle = '';
  sheetMetaSubscription: Subscription;
  @Output() showInfoModalEvent = new EventEmitter<number>();

  constructor(private databaseService: DatabaseService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    const title = localStorage.getItem('spreadsheetTitle');
    this.spreadSheetTitle = title ? title : nl.NO_SPREADSHEET_TITLE;

    this.databaseService.sheetMetaStream.subscribe(sheetMeta => {
      this.spreadSheetTitle = sheetMeta.spreadsheetTitle;
      this.changeDetector.detectChanges();
    });
  }

  showInfoModal() {
    // Emit a random number because a constant value doesn't trigger ngOnchanges in the InfoModalComponent.
    this.showInfoModalEvent.emit(Math.random());
  }

  ngOnDestroy() {
    this.sheetMetaSubscription.unsubscribe();
  }
}
