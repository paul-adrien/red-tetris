import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { hashKey } from "../customUrlSerializer";
import { pieceService } from "../services/piece.service";
import { WebsocketService } from "../services/websocketService";

@Component({
  selector: "app-home",
  template: `
    <div class="title">Bienvenue sur Red-Tetris</div>
    <div class="container">
      <div class="item-container">
        <div class="item-title">Créer une nouvelle salle</div>
        <div class="input-name">Nom d'utilisateur:</div>
        <input type="text" maxlength="20" #name />
        <p class="errorMsg" *ngIf="pieceService.playerNameError != ''">
          {{ pieceService.playerNameError }}
        </p>
        <div class="input-name">Nom de la salle:</div>
        <input type="text" maxlength="20" #pieceName />
        <p class="errorMsg" *ngIf="pieceService.pieceNameError != ''">
          {{ pieceService.pieceNameError }}
        </p>
        <div
          class="primary-button"
          (click)="createNewPiece(name.value, pieceName.value)"
        >
          Créer
        </div>
      </div>
      <div
        class="item-container"
        *ngFor="let piece of this.pieceList; index as index"
      >
        <div class="item-title">{{ piece.id }}</div>
        <div class="input-name">Your name:</div>
        <input type="text" maxlength="15" #joinName />

        <div
          [ngClass]="this.getColorClass(index + 1)"
          class="primary-button"
          (click)="joinPiece(piece.id, joinName.value, index)"
        >
          Rejoindre la salle
        </div>
        <p class="errorMsg" *ngIf="pieceService.playerNameErrorJoin == index">
          this player name has been already use
        </p>
      </div>
    </div>

    <button (click)="getPieceList()">Voir les rooms existantes</button>
  `,
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnChanges {
  public pieceList = [];

  constructor(
    private cd: ChangeDetectorRef,
    private socketService: WebsocketService,
    private router: Router,
    readonly pieceService: pieceService
  ) {
    this.socketService
      .listenToServer("res check piece id")
      .subscribe((data) => {
        this.cd.detectChanges();
      });
    this.socketService
      .listenToServer("res check player id")
      .subscribe((data) => {
        this.cd.detectChanges();
      });
    this.socketService
      .listenToServer("res check player join id")
      .subscribe((data) => {
        this.cd.detectChanges();
      });

    this.socketService.listenToServer("res create piece").subscribe((data) => {
      this.router.navigate([
        `${hashKey}${data.piece.id}[${data.player.name}]/piece`,
      ]);
    });
    this.socketService.listenToServer("res join piece").subscribe((data) => {
      this.router.navigate([
        `${hashKey}${data.piece.id}[${data.player.name}]/piece`,
      ]);
    });
    this.socketService.listenToServer("res piece list").subscribe((data) => {
      this.cd.detectChanges();
    });
    this.socketService.listenToServer("updatePiece").subscribe((data) => {
      this.cd.detectChanges();
    });

    this.socketService.listenToServer("res player list").subscribe((data) => {
      console.log(data);
    });
    this.socketService.listenToServer("delete piece").subscribe((data) => {
      console.log(data);
    });
    this.socketService
      .listenToServer("delete player piece")
      .subscribe((data) => {
        console.log(data);
        this.getPieceList();
      });
  }

  ngOnInit(): void {}

  ngOnChanges() {
    console.log("changes");
  }

  checkPieceId(id) {
    this.socketService.emitToServer("check piece id", {
      pieceId: id,
      id: this.socketService.socket.id,
    });
  }

  checkPlayerId(id) {
    this.socketService.emitToServer("check player id", {
      playerId: id,
      id: this.socketService.socket.id,
    });
  }

  getPieceList() {
    console.log("test");
    this.socketService.emitToServer("piece list", {
      id: this.socketService.socket.id,
    });
  }

  playerList() {
    this.socketService.emitToServer("player list", {
      id: this.socketService.socket.id,
    });
  }

  createPiece(pieceId: String, playerName: String) {
    this.socketService.emitToServer("create piece", {
      pieceId: pieceId,
      playerName: playerName,
      id: this.socketService.socket.id,
    });
  }

  joinPiece(pieceId: String, playerName: String, index: Number) {
    this.socketService.emitToServer("join piece", {
      pieceId: pieceId,
      playerName: playerName,
      id: this.socketService.socket.id,
      index: index,
    });
  }

  leavePiece(pieceId: String, playerName: String) {
    this.socketService.emitToServer("leave piece", {
      pieceId: pieceId,
      playerName: playerName,
      id: this.socketService.socket.id,
    });
  }

  createNewPiece(name: string, pieceName: string) {
    console.log(name, pieceName);
    this.createPiece(pieceName, name);
  }

  getColorClass(index: number) {
    const tmp = index % 7;

    switch (tmp) {
      case 0:
        return "light-blue";
      case 1:
        return "orange";

      case 2:
        return "green";

      case 3:
        return "yellow";

      case 4:
        return "red";

      case 5:
        return "blue";

      case 6:
        return "purple";
    }
  }
}
