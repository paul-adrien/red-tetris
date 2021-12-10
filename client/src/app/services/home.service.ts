
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from './websocketService';

@Injectable()
export class homeService {

    constructor(private routes: ActivatedRoute,
        private socketService: WebsocketService) {
    }
}