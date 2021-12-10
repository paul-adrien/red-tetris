
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable()
export class WebsocketService {

    // Our socket connection
    public socket;
    public socketId;

    constructor() { }

    //https://deepinder.me/creating-a-real-time-app-with-angular-8-and-socket-io-with-nodejs
    setupSocketConnection() {
        this.socket = io('http://localhost:8080');
        // this.socket.on('chat message', (data: string) => {
        //     console.log(data);
        // });
    }

    private socketIdSetter = new Subject<any>();
    socketIdSetterObs = this.socketIdSetter.asObservable();
    setSocketId(id: string) {
        this.socketId = id;
        this.socketIdSetter.next();
    }

    listenToServer(connection: string): Observable<any> {
        return new Observable((subscribe) => {
            this.socket.on(connection, (data) => {
                subscribe.next(data);
            });
        });
    }

    emitToServer(connection: string, data: any): void {
        this.socket.emit(connection, data);
    }
}