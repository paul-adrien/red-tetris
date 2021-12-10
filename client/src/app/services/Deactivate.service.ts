import { Injectable, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { pieceService } from './piece.service';
import { PieceComponent } from '../piece/piece.component';
import { ModalComponent } from '../modal/modal.component';

@Injectable({
    providedIn: 'root'
})
export class deactivateService {

    constructor(private modalService: NgbModal,
        private readonly pieceService: pieceService) { }

    canDeactivate(component: PieceComponent) {
        return true
    }
}
