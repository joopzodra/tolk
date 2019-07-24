import { Component } from '@angular/core';

@Component({
  selector: 'trapp-root',
  templateUrl: './app.html',
  styles: []
})
export class AppComponent {

  result: string
  
  onResult(result) {
    this.result = result
  }
}
