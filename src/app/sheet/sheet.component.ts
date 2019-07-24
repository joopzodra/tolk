import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {AuthService} from '../services/auth.service';
import {SheetService} from '../services/sheet.service';

/* 
 * Using changeDetector.detectChanges() in the subscription because, very oddly, on siging out the default change detection
 * is just triggered on a second attempt.
 */

@Component({
  selector: 'trapp-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SheetComponent implements OnInit {

  isSignedIn: boolean

  constructor(
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private sheetService: SheetService
  ) { }

  ngOnInit() {
    this.authService.isSignedIn.subscribe(isSignedIn => {
      this.isSignedIn = isSignedIn;
      this.changeDetector.detectChanges()
    });
  }

  loadSheet() {
    this.sheetService.makeApiCall('14_wotj6Bfckgf4uqWm1jUh9ru-7wEGYL-HeLM06kexI');
  }

   loadPublicSheet() {
    // https://docs.google.com/spreadsheets/d/e/2PACX-1vQW715j0SQX7GwnZmoetwH4DhntJh81sQZS7IJQwHVzQ1TsQq3V0oH8AQsubHP9XogAHL2l_3MwQ8My/pubhtml
    this.sheetService.makeApiCall('12n9gbtJl-Sg1g5SdtLE2OTvvJOcnVZWDdPRXmJq_C4o');
  }

}
