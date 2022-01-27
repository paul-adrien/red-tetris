import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { hashKey } from "../customUrlSerializer";
import { pieceService } from "../services/piece.service";
import { WebsocketService } from "../services/websocketService";

@Component({
  selector: "app-transi",
  template: ``,
  styleUrls: ["./transi.component.css"],
})
export class TransiComponent implements OnInit {
  constructor(
    private router: Router,
    private socketService: WebsocketService,
    private pieceService: pieceService
  ) {}

  ngOnInit(): void {
    const url = this.router?.url;
    let pieceId = url?.split("#")[1]?.split("[")[0];
    let playerName = url?.split("[")[1]?.split("]")[0];
    this.socketService?.emitToServer("join piece", {
      pieceId: pieceId,
      playerName: playerName,
      id: this.socketService?.socket?.id,
    });
  }
}
