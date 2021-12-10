import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  title: string;
  content: string;
  yes: string;
  no: string;
  percent: number;
  timerEvent: number | undefined;
  public subject: Subject<boolean>;

  constructor(public activeModal: NgbActiveModal) {
    this.percent = 100;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }
}
