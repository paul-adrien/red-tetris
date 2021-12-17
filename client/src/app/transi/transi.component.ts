import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { hashKey } from "../customUrlSerializer";
import { WebsocketService } from "../services/websocketService";

@Component({
  selector: "app-transi",
  template: ``,
  styleUrls: ["./transi.component.css"],
})
export class TransiComponent implements OnInit {
  constructor(private router: Router, private socketService: WebsocketService) {
    this.socketService.listenToServer("res join piece").subscribe((data) => {
      this.router.navigate([
        `${hashKey}${data.piece.id}[${data.player.name}]/piece`,
      ]);
    });
    this.socketService
      .listenToServer("res check player join id")
      .subscribe((data) => {
        this.router.navigate([`home`]);
      });
  }

  ngOnInit(): void {
    const url = this.router.url;
    let paramRoomId = url.split("#")[1].split("[")[0];
    let paramPlayerName = url.split("[")[1].split("]")[0];
    // console.log(paramRoomId, paramPlayerName, this.socketService.socket.id);
    this.socketService.emitToServer("join piece", {
      pieceId: paramRoomId,
      playerName: paramPlayerName,
      id: this.socketService.socket.id,
    });
  }
}
