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
    <div class="primary-button refresh" (click)="getPieceList()">
      rafraichir
    </div>
    <div class="container">
      <div class="item-container">
        <div class="item-title">Créer une nouvelle salle</div>
        <div class="input-name">Nom d'utilisateur:</div>
        <input
          type="text"
          maxlength="20"
          #name
          [class.error]="pieceService.playerNameError != ''"
        />
        <div class="errorMsg" *ngIf="pieceService.playerNameError != ''">
          {{ pieceService.playerNameError }}
        </div>
        <div class="input-name">Nom de la salle:</div>
        <input
          type="text"
          maxlength="20"
          #pieceName
          [class.error]="pieceService.pieceNameError !== ''"
        />
        <div class="errorMsg" *ngIf="pieceService.pieceNameError !== ''">
          {{ pieceService.pieceNameError }}
        </div>
        <div
          class="primary-button"
          (click)="createPiece(pieceName.value, name.value)"
        >
          Créer
        </div>
      </div>
      <div
        class="item-container"
        *ngFor="let piece of this.pieceService.pieceList; index as index"
        [ngClass]="this.getColorClass(index + 1)"
      >
        <div class="item-title">{{ piece.id }}</div>
        <div class="input-name">Nom d'utilisateur:</div>
        <input
          type="text"
          maxlength="15"
          #joinName
          [class.error]="pieceService.playerNameErrorJoin == index"
        />
        <div
          [class.black]="(index + 1) % 7 === 5 || (index + 1) % 7 === 4"
          class="errorMsg"
          *ngIf="pieceService.playerNameErrorJoin == index"
        >
          Ce nom est déjà utilisé
        </div>

        <div
          class="primary-button"
          (click)="joinPiece(piece.id, joinName.value, index)"
        >
          Rejoindre la salle
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  constructor(
    private cd: ChangeDetectorRef,
    private socketService: WebsocketService,
    private router: Router,
    readonly pieceService: pieceService
  ) {
    this.socketService
      .listenToServer("res check piece id")
      .subscribe((data) => {
        this.pieceService.pieceNameError = "wrong piece name";
        this.cd.detectChanges();
      });
    this.socketService
      .listenToServer("res check player id")
      .subscribe((data) => {
        this.pieceService.playerNameError = "wrong player name";
        this.cd.detectChanges();
      });

    this.socketService.listenToServer("res piece list").subscribe((data) => {
      this.pieceService.pieceList = data;
      this.cd.detectChanges();
    });
    this.socketService.listenToServer("updatePiece").subscribe((data) => {
      this.pieceService.pieceList.push(data.piece);
      this.cd.detectChanges();
    });
  }

  ngOnInit(): void {}

  checkPieceId(id) {
    this.socketService.emitToServer("check piece id", {
      pieceId: id,
      id: this.socketService?.socket?.id,
    });
  }

  checkPlayerId(id) {
    this.socketService.emitToServer("check player id", {
      playerId: id,
      id: this.socketService?.socket?.id,
    });
  }

  getPieceList() {
    this.socketService.emitToServer("piece list", {
      id: this.socketService?.socket?.id,
    });
  }

  playerList() {
    this.socketService.emitToServer("player list", {
      id: this.socketService?.socket?.id,
    });
  }

  createPiece(pieceId: String, playerName: String) {
    this.socketService.emitToServer("create piece", {
      pieceId: pieceId,
      playerName: playerName,
      id: this.socketService?.socket?.id,
    });
  }

  joinPiece(pieceId: String, playerName: String, index: Number) {
    this.socketService.emitToServer("join piece", {
      pieceId: pieceId,
      playerName: playerName,
      id: this.socketService?.socket?.id,
      index: index,
    });
  }

  leavePiece(pieceId: String, playerName: String) {
    this.socketService.emitToServer("leave piece", {
      pieceId: pieceId,
      playerName: playerName,
      id: this.socketService?.socket?.id,
    });
  }

  getColorClass(index: number) {
    const tmp = index % 7;

    switch (tmp) {
      case 0:
        return "light-blue";
      case 1:
        return "blue";

      case 2:
        return "green";

      case 3:
        return "yellow";

      case 4:
        return "red";

      case 5:
        return "orange";

      case 6:
        return "purple";
    }
  }
}
