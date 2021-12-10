import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { pieceService } from '../services/piece.service';
import { WebsocketService } from '../services/websocketService';

@Component({
  selector: 'app-piece',
  template: `
    <div class="">
      <h1>Tetrice piece</h1>
      <p>Name: {{ this.pieceService.pieceName }}</p>
      <p>Creator: {{ this.pieceService.pieceCreator }}</p>
      <div *ngFor="let player of this.pieceService.piecePlayers; index as index">
        <p>Player n° {{index}}: {{ player }}</p>
      </div>
      <button *ngIf='this.pieceService.start === false && this.pieceService.player && this.pieceService.pieceCreator === this.pieceService.player.name' (click)="this.pieceService.startGame()">Start the game</button>
      <div *ngIf='this.pieceService.start === true' class="row">
        <div *ngIf='this.pieceService.player != null' class="col-md-6">
          <p>{{ this.pieceService.player.name }}</p>
        </div>
      </div>
      <div *ngIf="pieceService.end != ''">{{pieceService.end}}</div>
      <button (click)="this.pieceService.leavePiece()">leave piece</button>
      <button (click)="addMalus()">add malus</button>
      <p>Score: {{pieceService.score}}</p>
      <div class="row">
        <div class="col-sm-4">
          <div class="game">
            <div class="board" *ngIf="this.pieceService.start === true && this.pieceService.player">
              <div class="row" *ngFor='let row of this.pieceService.player.game.spectrum'>
                <div class="col-sm-1 colonne" *ngFor="let col of row">
                  <div style="background-color: {{pieceService.colors(col)}};" class="cube"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ng-container *ngFor="let player of pieceService.playersInGame">
          <div class="col-sm-4" *ngIf='player && player.name !== pieceService.player.name'>
            <div class="game">
              <div class="board" *ngIf="this.pieceService.start === true">
                <div class="row" *ngFor='let row of player.game.spectrum'>
                  <div class="col-sm-1 colonne" *ngFor="let col of row">
                    <div style="background-color: {{pieceService.colors(col)}};" class="cube"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./piece.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieceComponent implements OnInit, OnDestroy {

  public timer = null;

  constructor(private routes: ActivatedRoute,
    readonly pieceService: pieceService,
    private socketService: WebsocketService,
    private router: Router,
    private cd: ChangeDetectorRef) {

    this.socketService.listenToServer('res start piece').subscribe((data) => {
      if (this.timer === null && this.pieceService.pieceName === data.piece.id)
        this.timerInterval();
    });
    this.socketService.listenToServer('updatePlayer').subscribe((data) => {
      if (data.piece.id === this.pieceService.pieceName) {
        console.log(data)
        this.pieceService.pieceList.map((p) => {
          if (p.id === data.piece.id)
            p = data.piece;
        });
        if (data.piece.id === this.pieceService.pieceName) {
          if (this.pieceService.piecePlayers)
            this.pieceService.piecePlayers.push(data.player.name);
        }
        this.cd.detectChanges();
      }
    });
    this.socketService.listenToServer('res send spectrum').subscribe((data) => {
      this.cd.detectChanges();
    });
  }

  ngOnInit(): void {
    this.timer = null;
    this.socketService.emitToServer('piece list', { id: this.socketService.socket.id })
    if (!this.pieceService.pieceName)
      this.router.navigate([`home`]);
  }

  addMalus() {
    this.pieceService.malus++;
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 37) { this.pieceService.stopAll(event); this.pieceService.move('left'); }
    if (event.keyCode === 38) { this.pieceService.stopAll(event); this.pieceService.move('up'); }
    if (event.keyCode === 39) { this.pieceService.stopAll(event); this.pieceService.move('right'); }
    if (event.keyCode === 40) { this.pieceService.stopAll(event); this.pieceService.move('down'); }
    if (event.keyCode === 32) { this.pieceService.stopAll(event); this.pieceService.move('downMax'); }
  }

  timerInterval() {
    this.timer = setInterval((async () => {
      this.cd.detectChanges();
      this.pieceService.lock = true;
      if (this.pieceService.start === true) {
        if (this.pieceService.newTetro === true) {
          this.pieceService.DrawNewTetro(this.pieceService.player.game.spectrum, this.pieceService.tetroList[this.pieceService.currentTetro]);
          this.pieceService.lock = false;
        } else {
          if (this.pieceService.currentTetro >= this.pieceService.tetroList.length - 5)
            this.socketService.emitToServer('new tetrominos', { pieceId: this.pieceService.pieceName });
          this.pieceService.unDrawTetro(this.pieceService.player.game.spectrum, this.pieceService.tetroList[this.pieceService.currentTetro])
          if (this.pieceService.malus > 0)
            this.pieceService.lineMalus(this.pieceService.player.game.spectrum);
          if (this.pieceService.checkNewPlace(this.pieceService.player.game.spectrum, this.pieceService.tetroList[this.pieceService.currentTetro], 1, 0)) {
            this.pieceService.tetroList[this.pieceService.currentTetro].position.y++;
            this.pieceService.DrawNewTetro(this.pieceService.player.game.spectrum, this.pieceService.tetroList[this.pieceService.currentTetro]);
            this.pieceService.lock = false;
            this.pieceService.score++;
          } else {
            this.pieceService.DrawNewTetro(this.pieceService.player.game.spectrum, this.pieceService.tetroList[this.pieceService.currentTetro]);
            this.pieceService.currentTetro++;
            if (this.pieceService.checkNewPlace(this.pieceService.player.game.spectrum, this.pieceService.tetroList[this.pieceService.currentTetro], 1, 0)) {
              this.pieceService.lineClear(this.pieceService.player.game.spectrum);
              this.pieceService.DrawNewTetro(this.pieceService.player.game.spectrum, this.pieceService.tetroList[this.pieceService.currentTetro]);
            } else {
              this.endGame();
            }
          }
        }
        this.pieceService.sendSpectrum();
      }
    }), 900);
  }

  endGame() {
    this.pieceService.start = false;
    clearInterval(this.timer)
    this.timer = null;
    this.pieceService.end = 'END';
    this.socketService.emitToServer('player lose', { pieceId: this.pieceService.pieceName, player: this.pieceService.player, id: this.socketService.socket.id })
  }

  ngOnDestroy() {
    clearInterval(this.timer)
    if (this.pieceService && this.pieceService.pieceName)
      this.pieceService.leavePiece();
  }

}
