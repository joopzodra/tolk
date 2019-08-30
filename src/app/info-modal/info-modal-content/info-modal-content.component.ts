import { Component } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tolk-info-modal-content',
  templateUrl: './info-modal-content.component.html',
  styleUrls: ['./info-modal-content.component.css']
})
export class InfoModalContentComponent {

  constructor(public activeModal: NgbActiveModal) { }

}
