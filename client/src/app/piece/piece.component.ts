import { PopUpGameComponent } from "./../pop-up-game/pop-up-game.component";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { pieceService } from "../services/piece.service";
import { WebsocketService } from "../services/websocketService";
import { interval } from "rxjs";

@Component({
  selector: "app-piece",
  template: `
    <div class="container">
      <div class="title">{{ this.pieceService.pieceName }}</div>

      <div class="buttons">
        <div
          class="primary-button"
          *ngIf="
            this.pieceService.start === false &&
            this.pieceService.player &&
            this.pieceService.pieceCreator === this.pieceService.player.name
          "
          (click)="this.pieceService.startGame()"
        >
          Commencer la partie
        </div>
        <div class="primary-button" (click)="this.pieceService.leavePiece()">
          Quitter la partie
        </div>
      </div>
      <div class="game-container">
        <div class="board" *ngIf="this.pieceService.player">
          <div
            class="tetriRow"
            *ngFor="let row of this.pieceService.player.game.spectrum"
          >
            <div class="colonne" *ngFor="let col of row">
              <div [style]="pieceService.colors(col)" class="cube"></div>
            </div>
          </div>
        </div>
        <div class="player-container">
          <div
            class="nextTetro"
            *ngIf="
              this.pieceService.start === true && this.pieceService.mode === 0
            "
          >
            <p>Next:</p>
            <div class="next-container">
              <div
                class="tetriRow"
                *ngFor="
                  let row of this.pieceService.tetroList[
                    this.pieceService.currentTetro + 1
                  ].tetro
                "
              >
                <div class="min-colonne" *ngFor="let col of row">
                  <div [style]="pieceService.colors(col)" class="cube"></div>
                </div>
              </div>
            </div>
          </div>
          <p>Créateur: {{ this.pieceService.pieceCreator }}</p>
          <div class="" *ngIf="this.pieceService.start === false">
            <div class="modeItem">Choix du mode de jeu:</div>
            <label class="modeItem">
              <input
                (click)="this.pieceService.changeGameMode(0)"
                type="radio"
                value="critical"
                name="priority"
                [checked]="this.pieceService.mode == 0"
                [disabled]="
                  this.pieceService.pieceCreator !==
                  this.pieceService.player.name
                "
              />
              <span>Facile</span>
            </label>
            <label class="modeItem">
              <input
                (click)="this.pieceService.changeGameMode(1)"
                type="radio"
                value="high"
                name="priority"
                [checked]="this.pieceService.mode == 1"
                [disabled]="
                  this.pieceService.pieceCreator !==
                  this.pieceService.player.name
                "
              />
              <span>Normal</span>
            </label>
            <label class="modeItem">
              <input
                (click)="this.pieceService.changeGameMode(2)"
                type="radio"
                value="medium"
                name="priority"
                [checked]="this.pieceService.mode == 2"
                [disabled]="
                  this.pieceService.pieceCreator !==
                  this.pieceService.player.name
                "
              />
              <span>Difficile</span>
            </label>
            <label class="modeItem">
              <input
                (click)="this.pieceService.changeGameMode(3)"
                type="radio"
                value="low"
                name="priority"
                [checked]="this.pieceService.mode == 3"
                [disabled]="
                  this.pieceService.pieceCreator !==
                  this.pieceService.player.name
                "
              />
              <span>Hardcore</span>
            </label>
          </div>
          <p>
            Player:
            {{ this.pieceService.player.name }}
          </p>
          <div>Score: {{ pieceService.score }}</div>
          <div *ngIf="this.pieceService.start" class="other-container">
            <div *ngFor="let player of pieceService.playersInGame">
              <div
                class="text"
                *ngIf="player.name !== this.pieceService.player.name"
              >
                Player: {{ player.name }}
              </div>
              <div
                class="text"
                *ngIf="player.name !== this.pieceService.player.name"
              >
                Score: {{ player?.score }}
              </div>
              <div
                class="board"
                *ngIf="player.name !== this.pieceService.player.name"
              >
                <div class="tetriRow" *ngFor="let row of player.game.spectrum">
                  <div class="min-colonne" *ngFor="let col of row">
                    <div [style]="pieceService.colors(col)" class="cube"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="!this.pieceService.start" class="other-container">
            <div *ngFor="let player of pieceService.piecePlayers">
              <div
                class="text"
                *ngIf="player !== this.pieceService.player.name"
              >
                Player: {{ player }}
              </div>
              <div
                class="text"
                *ngIf="player !== this.pieceService.player.name"
              >
                Score: 0
              </div>
              <div
                class="board"
                *ngIf="player !== this.pieceService.player.name"
              >
                <div
                  class="tetriRow"
                  *ngFor="let row of this.pieceService.player.game.spectrum"
                >
                  <div class="min-colonne" *ngFor="let col of row">
                    <div [style]="pieceService.colors(col)" class="cube"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./piece.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieceComponent implements OnInit, OnDestroy {
  public timer = null;
  public dialogRef;

  constructor(
    private routes: ActivatedRoute,
    readonly pieceService: pieceService,
    private socketService: WebsocketService,
    private router: Router,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.socketService?.listenToServer("res start piece").subscribe((data) => {
      console.log("interval listen");
      if (
        this.timer === null &&
        this.pieceService?.pieceName === data?.piece?.id &&
        this.pieceService?.start !== true
      ) {
        this.pieceService.start = true;
        this.timerInterval();
      }
    });
    this.socketService?.listenToServer("res player lose").subscribe((data) => {
      this.cd.detectChanges();
      console.log(
        "icibg",
        this.pieceService.win,
        this.pieceService.player.name
      );
      if (!this.dialogRef) {
        this.dialogRef = this.dialog.open(PopUpGameComponent, {
          data: {
            isWin: this.pieceService.win,
          },
          backdropClass: "backdrop",
        });
        setTimeout(() => {
          this.dialogRef.close();
        }, 10000);
      }
    });
    this.socketService?.listenToServer("updatePlayer").subscribe((data) => {
      if (data?.piece?.id === this.pieceService?.pieceName) {
        console.log(data);
        this.pieceService?.pieceList?.map((p) => {
          if (p?.id === data?.piece?.id) p = data?.piece;
        });
        if (data?.piece?.id === this.pieceService?.pieceName) {
          if (
            this.pieceService?.piecePlayers &&
            this.pieceService.piecePlayers
              .map((p) => {
                return p;
              })
              .indexOf(data?.player?.name) == -1
          )
            this.pieceService.piecePlayers.push(data?.player?.name);
        }
        this.cd.detectChanges();
      }
    });
    this.socketService
      ?.listenToServer("res send spectrum")
      .subscribe((data) => {
        this.cd.detectChanges();
      });
    this.socketService?.listenToServer("res change mode").subscribe((data) => {
      this.cd.detectChanges();
    });
  }

  ngOnInit(): void {
    if (this.timer) this.timer = null;
    this.socketService?.emitToServer("piece list", {
      id: this.socketService?.socket?.id,
    });
    if (!this.pieceService?.pieceName) this.router?.navigate([`/home`]);
  }

  @HostListener("window:keydown", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (event?.keyCode === 37) {
      this.pieceService.stopAll(event);
      this.pieceService.move("left");
    }
    if (event?.keyCode === 38) {
      this.pieceService.stopAll(event);
      this.pieceService.move("up");
    }
    if (event?.keyCode === 39) {
      this.pieceService.stopAll(event);
      this.pieceService.move("right");
    }
    if (event?.keyCode === 40) {
      this.pieceService.stopAll(event);
      this.pieceService.move("down");
    }
    if (event?.keyCode === 32) {
      this.pieceService.stopAll(event);
      this.pieceService.move("downMax");
    }
  }

  timerInterval() {
    this.timer = setInterval(async () => {
      console.log("test");
      this.cd.detectChanges();
      this.pieceService.lock = true;
      if (this.pieceService?.start === true) {
        if (this.pieceService.newTetro === true) {
          this.pieceService.DrawNewTetro(
            this.pieceService.player.game.spectrum,
            this.pieceService.tetroList[this.pieceService.currentTetro]
          );
          this.pieceService.lock = false;
        } else {
          if (
            this.pieceService.currentTetro >=
            this.pieceService.tetroList.length - 5
          )
            this.socketService.emitToServer("new tetrominos", {
              pieceId: this.pieceService.pieceName,
            });
          this.pieceService.unDrawTetro(
            this.pieceService.player.game.spectrum,
            this.pieceService.tetroList[this.pieceService.currentTetro]
          );
          if (this.pieceService.malus > 0) this.pieceService.lineMalus();
          if (
            this.pieceService.checkNewPlace(
              this.pieceService.player.game.spectrum,
              this.pieceService.tetroList[this.pieceService.currentTetro],
              1,
              0
            )
          ) {
            this.pieceService.tetroList[this.pieceService.currentTetro].position
              .y++;
            this.pieceService.DrawNewTetro(
              this.pieceService.player.game.spectrum,
              this.pieceService.tetroList[this.pieceService.currentTetro]
            );
            this.pieceService.lock = false;
            this.pieceService.score++;
          } else {
            if (
              !this.pieceService.checkNewPlace(
                this.pieceService.player.game.spectrum,
                this.pieceService.tetroList[this.pieceService.currentTetro],
                0,
                0
              )
            ) {
              this.pieceService.tetroList[this.pieceService.currentTetro]
                .position.y--;
            }
            this.pieceService.DrawNewTetro(
              this.pieceService.player.game.spectrum,
              this.pieceService.tetroList[this.pieceService.currentTetro]
            );
            this.pieceService.currentTetro++;
            if (
              this.pieceService.checkNewPlace(
                this.pieceService.player.game.spectrum,
                this.pieceService.tetroList[this.pieceService.currentTetro],
                1,
                0
              )
            ) {
              this.pieceService.lineClear(
                this.pieceService.player.game.spectrum
              );
              this.pieceService.DrawNewTetro(
                this.pieceService.player.game.spectrum,
                this.pieceService.tetroList[this.pieceService.currentTetro]
              );
            } else {
              this.endGame();
            }
          }
        }
        if (this.pieceService.malusRotate > 0) {
          this.pieceService.malusRotate--;
          this.pieceService.move("up");
        }
        if (this.pieceService.malusAcc > 0) {
          this.pieceService.malusAcc--;
          this.pieceService.move("down");
        }
        this.pieceService.sendSpectrum();
      }
    }, 900);
  }

  endGame() {
    this.pieceService.start = false;
    clearInterval(this.timer);
    this.timer = null;
    this.pieceService.end = "END";

    this.socketService.emitToServer("player lose", {
      pieceId: this.pieceService.pieceName,
      player: this.pieceService.player,
      id: this.socketService.socket.id,
    });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    if (this.pieceService && this.pieceService.pieceName) {
      console.log("leave piece");
      this.pieceService.leavePiece();
    } else {
    }
  }
}
