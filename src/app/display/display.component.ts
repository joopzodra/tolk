import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'trapp-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  @Input() searchResult: string
  
  constructor() { }

  ngOnInit() {
  }

}
