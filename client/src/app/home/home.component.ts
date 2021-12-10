import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { pieceService } from '../services/piece.service';
import { WebsocketService } from '../services/websocketService';

@Component({
  selector: 'app-home',
  template: `
    <!-- <button (click)="checkPieceId('test')">check piece id</button>
    <button (click)="checkPlayerId('test')">check player id</button>
    <button (click)="createPiece('test', 'test')">Create piece</button>
    <button (click)="createPiece('test', 'test2')">Create piece with other player</button>
    <button (click)="getPieceList()">Piece list</button>
    <button (click)="playerList()">Player list</button>
    <button (click)="leavePiece('test', 'test')">test leave piece</button>
    <button (click)="leavePiece('test', 'test2')">test1 leave piece</button> -->

    <div class="container">
      <div>
        <h1>Create a new piece</h1>
        <p>Your name:</p>
        <input type="text" maxlength="20" #name>
        <p class="errorMsg" *ngIf="pieceService.playerNameError != ''">{{pieceService.playerNameError}}</p>
        <p>Piece name:</p>
        <input type="text" maxlength="20" #pieceName>
        <p class="errorMsg" *ngIf="pieceService.pieceNameError != ''">{{pieceService.pieceNameError}}</p>
        <br>
        <button (click)="createNewPiece(name.value, pieceName.value)">Create</button>
      </div>
      <button (click)="getPieceList()">Voir les rooms existantes</button>
      <div *ngIf="this.pieceService.pieceList.length > 0">
        <h1>Join a piece</h1>
        <div class="pieceList" *ngFor="let piece of this.pieceService.pieceList; index as index">
          <p>{{piece.id}}</p>
          <div class="row">
            <div class="col-sm-2">Your name: </div>
            <div class="col-sm-6">
              <input type="text" maxlength="15" #joinName>
            </div>
            <div class="col-sm-2">
              <button (click)="joinPiece(piece.id, joinName.value, index)">Join</button>
            </div>
          </div>
          <p class="errorMsg" *ngIf="pieceService.playerNameErrorJoin == index">this player name has been already use</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnChanges {

  // pieceList = [];

  constructor(private cd: ChangeDetectorRef,
    private socketService: WebsocketService,
    private router: Router,
    readonly pieceService: pieceService) {
    this.socketService.listenToServer('res check piece id').subscribe((data) => {
      this.cd.detectChanges()
    });
    this.socketService.listenToServer('res check player id').subscribe((data) => {
      this.cd.detectChanges()
    });
    this.socketService.listenToServer('res check player join id').subscribe((data) => {
      this.cd.detectChanges()
    });

    this.socketService.listenToServer('res create piece').subscribe((data) => {
      this.router.navigate([`${data.piece.id}/${data.player.name}`]);
    });
    this.socketService.listenToServer('res join piece').subscribe((data) => {
      this.router.navigate([`${data.piece.id}/${data.player.name}`]);
    });
    this.socketService.listenToServer('res piece list').subscribe((data) => {
      this.cd.detectChanges();
    });
    this.socketService.listenToServer('updatePiece').subscribe((data) => {
      this.cd.detectChanges();
    });

    this.socketService.listenToServer('res player list').subscribe((data) => {
      console.log(data);
    });
    this.socketService.listenToServer('delete piece').subscribe((data) => {
      console.log(data);
    });
    this.socketService.listenToServer('delete player piece').subscribe((data) => {
      console.log(data);
      this.getPieceList();
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    console.log('changes')
  }

  checkPieceId(id) {
    this.socketService.emitToServer('check piece id', { pieceId: id, id: this.socketService.socket.id })
  }

  checkPlayerId(id) {
    this.socketService.emitToServer('check player id', { playerId: id, id: this.socketService.socket.id })
  }

  getPieceList() {
    console.log('test')
    this.socketService.emitToServer('piece list', { id: this.socketService.socket.id })
  }

  playerList() {
    this.socketService.emitToServer('player list', { id: this.socketService.socket.id })
  }

  createPiece(pieceId: String, playerName: String) {
    this.socketService.emitToServer('create piece', { pieceId: pieceId, playerName: playerName, id: this.socketService.socket.id })
  }

  joinPiece(pieceId: String, playerName: String, index: Number) {
    this.socketService.emitToServer('join piece', { pieceId: pieceId, playerName: playerName, id: this.socketService.socket.id, index: index })
  }

  leavePiece(pieceId: String, playerName: String) {
    this.socketService.emitToServer('leave piece', { pieceId: pieceId, playerName: playerName, id: this.socketService.socket.id })
  }

  createNewPiece(name: string, pieceName: string) {
    console.log(name, pieceName);
    this.createPiece(pieceName, name);
  }

}
