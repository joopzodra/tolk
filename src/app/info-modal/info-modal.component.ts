import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalContentComponent } from './info-modal-content/info-modal-content.component';

@Component({
  selector: 'tolk-info-modal',
  template: '',
})
export class InfoModalComponent implements OnChanges {

  @Input() showInfoModal: boolean

  constructor(private modalService: NgbModal) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.showInfoModal.firstChange) {
      this.modalService.open(InfoModalContentComponent)
    }
  }

}
