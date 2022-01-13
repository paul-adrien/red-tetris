import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { io } from "socket.io-client";
import { environment } from "src/environments/environment";

@Injectable()
export class WebsocketService {
  public socket;
  public socketId;

  constructor() {}

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_API);
  }

  private socketIdSetter = new Subject<any>();
  socketIdSetterObs = this.socketIdSetter.asObservable();
  setSocketId(id: string) {
    this.socketId = id;
    this.socketIdSetter?.next();
  }

  listenToServer(connection: string): Observable<any> {
    return new Observable((subscribe) => {
      this.socket?.on(connection, (data) => {
        subscribe.next(data);
      });
    });
  }

  emitToServer(connection: string, data: any): void {
    this.socket?.emit(connection, data);
  }
}
