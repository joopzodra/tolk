import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription, fromEvent, merge, interval } from 'rxjs';
import { throttle, startWith } from 'rxjs/operators';

import { DatabaseService, Selection } from './services/database.service';
import { GapiService } from './services/gapi.service';
import {ReportSwUpdateService} from './services/report-sw-update.service';

@Component({
  selector: 'tolk-root',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
      #app-container {
        height: 100vh;
      }
      #display-container {
        overflow-y: scroll;
      }
      #bottom-container {
        position: absolute;
        bottom: 0;
        width: 100%;
        z-index: 2;
      }
      @media only screen and (max-height: 310px) {
        #bottom-container {
        display: none;
        }
      }
  `]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  searchLanguage: string;
  showInfoModal: boolean;
  selectionSearchTerm: string = '';
  selectionStreamSubscription: Subscription;
  viewportChangeStreamSubscription: Subscription;
  gapiStatus: string = '';
  gapiStatusSubscription: Subscription;
  @ViewChild('topContainer', { static: false })
  private topContainer: ElementRef<HTMLDivElement>;
  displayContainerMaxHeight: number;

  constructor(
    private databaseService: DatabaseService,
    private gapiService: GapiService,
    private changeDetector: ChangeDetectorRef,
    private swUpdate: ReportSwUpdateService,
  ) { }

  ngOnInit() {
    this.selectionStreamSubscription = this.databaseService.selectionStream.subscribe(selection => {
      this.selectionSearchTerm = selection.searchTerm;
      this.changeDetector.detectChanges();
    });
    this.gapiStatusSubscription = this.gapiService.gapiStatusStream.subscribe(status => {
      this.gapiStatus = status;
      this.changeDetector.detectChanges();
    });
  }

  ngAfterViewInit() {
    const orientationStream = fromEvent(window, 'orientationchange');
    const resizeStream = fromEvent(window, 'resize').pipe(
      throttle(val => interval(200)),
      startWith(null)
      );
    this.viewportChangeStreamSubscription = merge(
      orientationStream,
      resizeStream
    )
      .subscribe(() => {
        this.displayContainerMaxHeight = this.getDisplayContainerMaxHeight();
        this.changeDetector.detectChanges();
      });
  }

  getDisplayContainerMaxHeight() {
    const viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const topContainerHeight = this.topContainer.nativeElement.clientHeight;
    return viewPortHeight - topContainerHeight - 15;
  }

  onSearchLanguageEvent(lang) {
    this.searchLanguage = lang;
  }

  onShowInfoModalEvent(randomNumber) {
    this.showInfoModal = randomNumber;
  }

  ngOnDestroy() {
    this.selectionStreamSubscription.unsubscribe();
    this.gapiStatusSubscription.unsubscribe();
    this.viewportChangeStreamSubscription.unsubscribe();
  }
}
