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
    <div *ngIf="this.isLoad" class="container">
      <img
        class="volume"
        (click)="this.playPause()"
        [src]="
          this.audioBack.muted
            ? 'assets/volume-mute-sharp.svg'
            : 'assets/volume-medium-sharp.svg'
        "
      />
      <div class="title">{{ this.pieceService?.pieceName }}</div>

      <div class="buttons">
        <div
          class="primary-button"
          *ngIf="
            this.pieceService?.start === false &&
            this.pieceService?.player &&
            this.pieceService?.pieceCreator === this.pieceService?.player?.name
          "
          (click)="this.pieceService?.startGame()"
        >
          Commencer la partie
        </div>
        <div
          class="primary-button"
          (click)="this.pieceService?.leavePiece() && endGame()"
        >
          Quitter la partie
        </div>
      </div>
      <div class="game-container">
        <div class="board" *ngIf="this.pieceService?.player">
          <div
            class="tetriRow"
            *ngFor="let row of this.pieceService?.player?.game?.spectrum"
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
              this.pieceService?.start === true && this.pieceService?.mode === 0
            "
          >
            <p>Prochaine:</p>
            <div class="next-container">
              <div
                class="tetriRow"
                *ngFor="
                  let row of this.pieceService?.tetroList[
                    this.pieceService?.currentTetro + 1
                  ].tetro
                "
              >
                <div class="min-colonne" *ngFor="let col of row">
                  <div [style]="pieceService?.colors(col)" class="cube"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="info-text">
            Player:
            {{ this.pieceService?.player?.name }}
          </div>
          <div class="info-text">
            Cr??ateur: {{ this.pieceService.pieceCreator }}
          </div>
          <div class="info-text" *ngIf="this.pieceService.start === false">
            <div class="modeItem">Choix du mode de jeu:</div>
            <label class="modeItem">
              <input
                (click)="this.pieceService.changeGameMode(0)"
                type="radio"
                value="critical"
                name="priority"
                [checked]="this.pieceService.mode == 0"
                [disabled]="
                  this.pieceService?.pieceCreator !==
                  this.pieceService?.player?.name
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
                  this.pieceService?.pieceCreator !==
                  this.pieceService?.player?.name
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
                  this.pieceService?.player?.name
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
                  this.pieceService?.player?.name
                "
              />
              <span>Hardcore</span>
            </label>
          </div>

          <div>Score: {{ pieceService.score }}</div>
          <div *ngIf="this.pieceService.start" class="other-container">
            <div *ngFor="let player of pieceService.playersInGame">
              <div
                class="text"
                *ngIf="player?.name !== this.pieceService?.player?.name"
              >
                Player: {{ player?.name }}
              </div>
              <div
                class="text"
                *ngIf="player?.name !== this.pieceService?.player?.name"
              >
                Score: {{ player?.score }}
              </div>
              <div
                class="board"
                *ngIf="player?.name !== this.pieceService?.player?.name"
              >
                <div
                  class="tetriRow"
                  *ngFor="let row of player?.game?.spectrum"
                >
                  <div class="min-colonne" *ngFor="let col of row">
                    <div [style]="pieceService.colors(col)" class="cube"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="!this.pieceService?.start" class="other-container">
            <div *ngFor="let player of pieceService?.piecePlayers">
              <div
                class="text"
                *ngIf="player !== this.pieceService?.player.name"
              >
                Player: {{ player }}
              </div>
              <div
                class="text"
                *ngIf="player !== this.pieceService?.player?.name"
              >
                Score: {{ player?.score || 0 }}
              </div>
              <div
                class="board"
                *ngIf="player !== this.pieceService?.player?.name"
              >
                <div
                  class="tetriRow"
                  *ngFor="let row of this.pieceService?.player?.game?.spectrum"
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
  public audioBack;
  public audioWin;
  public audioLose;

  public isLoad = false;

  constructor(
    private routes: ActivatedRoute,
    readonly pieceService: pieceService,
    private socketService: WebsocketService,
    private router: Router,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.audioBack = new Audio();
    this.audioLose = new Audio();
    this.audioWin = new Audio();
    this.audioBack.src = "assets/tetris-music.mp3";
    this.audioBack.load();
    this.audioBack.loop = true;
    this.audioBack.addEventListener("ended", this.loop, false);
    this.audioBack.addEventListener(
      "canplaythrough",
      () => {
        this.isLoad = true;
        this.cd.detectChanges();
      },
      false
    );
    this.audioWin.src = "assets/victory.mp3";
    this.audioLose.src = "assets/lose.mp3";
    this.audioWin.load();
    this.audioLose.load();
    this.socketService?.listenToServer("res start piece").subscribe((data) => {
      if (
        this.pieceService?.pieceName === data?.piece?.id &&
        this.pieceService?.start !== true
      ) {
        this.pieceService.start = true;
        this.pieceService.resStartGame(data);

        this.audioBack.play();

        clearInterval(this.timer);
        this.timerInterval();
      }
    });
    this.socketService?.listenToServer("res player lose").subscribe((data) => {
      if (data?.piece?.id === this.pieceService?.pieceName) {
        this.cd.detectChanges();
        if (
          !this.dialogRef &&
          this.pieceService.player.name !== data?.winner &&
          this.pieceService.player.name === data.player?.name
        ) {
          this.pieceService.start = false;
          clearInterval(this.timer);
          this.pieceService.end = "END";
          this.dialogRef = this.dialog?.open(PopUpGameComponent, {
            data: {
              isWin: false,
            },
            backdropClass: "backdrop",
          });
          this.audioBack.pause();
          this.audioBack.currentTime = 0;
          this.audioLose.play();
          setTimeout(() => {
            this.audioLose.pause();
            this.audioLose.currentTime = 0;
            this.dialogRef.close();
            this.dialogRef = undefined;
          }, 10000);
        } else if (
          !this.dialogRef &&
          data.piece.start === false &&
          this.pieceService.player.name === data?.winner
        ) {
          this.pieceService.start = false;
          clearInterval(this.timer);
          this.pieceService.end = "END";
          this.dialogRef = this.dialog?.open(PopUpGameComponent, {
            data: {
              isWin: true,
            },
            backdropClass: "backdrop",
          });
          this.audioBack.pause();
          this.audioBack.currentTime = 0;
          this.audioWin.play();
          setTimeout(() => {
            this.audioWin.pause();
            this.audioWin.currentTime = 0;
            this.dialogRef.close();
            this.dialogRef = undefined;
          }, 10000);
        }
      }
    });
    this.socketService?.listenToServer("updatePlayer").subscribe((data) => {
      if (data?.piece?.id === this.pieceService?.pieceName) {
        this.pieceService?.pieceList?.map((p) => {
          if (p?.id === data?.piece?.id) p = data?.piece;
        });
        if (data?.piece?.id === this.pieceService?.pieceName) {
          if (
            this.pieceService?.piecePlayers &&
            this.pieceService?.piecePlayers
              .map((p) => {
                return p;
              })
              .indexOf(data?.player?.name) == -1
          )
            this.pieceService?.piecePlayers.push(data?.player?.name);
        }
        this.cd.detectChanges();
      }
    });
    this.socketService
      ?.listenToServer("res send spectrum")
      .subscribe((data) => {
        if (data.pieceId === this.pieceService.pieceName) {
          this.pieceService.playersInGame.map((p) => {
            if (p.name === data.player.name) {
              p.game.spectrum = data.player.game.spectrum;
              p.score = data.player.score;
            }
          });
          this.cd.detectChanges();
        }
      });
    this.socketService?.listenToServer("res change mode").subscribe((data) => {
      if (data.piece.id === this.pieceService.pieceName) {
        this.pieceService.mode = data.piece.mode;
        this.cd.detectChanges();
      }
    });
  }

  ngOnInit(): void {
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
      this.pieceService.lock = true;
      if (this.pieceService?.start === true) {
        if (this.pieceService?.newTetro === true) {
          this.pieceService.DrawNewTetro(
            this.pieceService.player.game.spectrum,
            this.pieceService.tetroList[this.pieceService.currentTetro]
          );
          this.pieceService.lock = false;
        } else {
          if (
            this.pieceService?.currentTetro >=
            this.pieceService?.tetroList.length - 5
          )
            this.socketService.emitToServer("new tetrominos", {
              pieceId: this.pieceService.pieceName,
            });
          this.pieceService.unDrawTetro(
            this.pieceService.player.game.spectrum,
            this.pieceService.tetroList[this.pieceService.currentTetro]
          );
          if (this.pieceService?.malus > 0) this.pieceService.lineMalus();
          if (
            this.pieceService?.checkNewPlace(
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
              !this.pieceService?.checkNewPlace(
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
              this.pieceService?.checkNewPlace(
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
        if (this.pieceService?.malusRotate > 0) {
          this.pieceService.malusRotate--;
          this.pieceService.move("up");
        }
        if (this.pieceService?.malusAcc > 0) {
          this.pieceService.malusAcc--;
          this.pieceService.move("down");
        }
        this.pieceService?.sendSpectrum();
      } else {
        clearInterval(this.timer);
      }
    }, 900);
  }

  endGame() {
    this.pieceService.start = false;
    clearInterval(this.timer);
    this.pieceService.end = "END";

    this.socketService.emitToServer("player lose", {
      pieceId: this.pieceService?.pieceName,
      player: this.pieceService?.player,
      id: this.socketService?.socket?.id,
    });
  }

  public playPause() {
    this.audioBack.muted = !this.audioBack.muted;
    this.audioLose.muted = !this.audioLose.muted;
    this.audioWin.muted = !this.audioWin.muted;
    this.cd.detectChanges();
  }

  public loop() {
    this.audioBack.currentTime = 0;
    this.audioBack.play();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    this.audioBack.pause();
    this.audioBack.currentTime = 0;
    this.audioLose.pause();
    this.audioLose.currentTime = 0;
    this.audioWin.pause();
    this.audioWin.currentTime = 0;
    if (this.pieceService && this.pieceService?.pieceName) {
      this.pieceService.leavePiece();
    }
  }
}
