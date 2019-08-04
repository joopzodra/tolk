import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {NgbAlertModule, NgbDropdownModule, NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { DisplayComponent } from './display/display.component';
import { AuthComponent } from './auth/auth.component';
import { SheetComponent } from './sheet/sheet.component';
import { DialogComponent } from './dialog/dialog.component';
import { GapiComponent } from './gapi/gapi.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    DisplayComponent,
    AuthComponent,
    SheetComponent,
    DialogComponent,
    GapiComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbDropdownModule,
    NgbButtonsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
