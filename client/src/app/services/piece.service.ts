import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { hashKey } from "../customUrlSerializer";
import { WebsocketService } from "./websocketService";

@Injectable({
  providedIn: "root",
})
export class pieceService implements OnDestroy {
  public pieceList = [];
  public pieceNameError = "";
  public playerNameError = "";
  public playerNameErrorJoin = -1;

  public pieceName = "";
  public piecePlayers = [];
  public pieceCreator = "";
  public pieceStart = "";
  public player = null;

  public start = false;
  public timer: number;
  public tetroList = [];
  public currentTetro = 0;
  public playersInGame = null;
  public newTetro = true;
  public malus = 0;
  public malusRotate = 0;
  public malusAcc = 0;
  public lock = false;
  public score = 0;
  public mode = 0;
  public win = null;

  public end = "";

  constructor(private routes: Router, private socketService: WebsocketService) {
    this.socketService
      .listenToServer("res create/join piece")
      .subscribe((data) => {
        this.initPiece(data);
        this.routes.navigate([
          `${hashKey}${data.piece.id}[${data.player.name}]/piece`,
        ]);
      });

    this.socketService
      .listenToServer("res check player join id")
      .subscribe((data) => {
        this.playerNameErrorJoin = data.index;
      });

    this.socketService
      .listenToServer("res new tetrominos")
      .subscribe((data) => {
        if (data.piece.id === this.pieceName) {
          var i = 0;
          var l = this.tetroList.length;
          data.piece.tetroList.forEach((tetro) => {
            if (++i >= l) this.tetroList.push(tetro);
          });
        }
      });

    this.socketService.listenToServer("res player lose").subscribe((data) => {
      if (data && data.piece && data.piece.id === this.pieceName) {
        if (data?.player && this.socketService.socket.id == data.player?.id)
          this.player.game.spectrum = data?.player?.game?.spectrum;
        this.pieceCreator = data?.piece?.creator;
        this.piecePlayers = data?.piece?.playersId;
        if (data.piece.start === true) {
          //un joueur a perdu
          this.win = false;
        } else {
          if (this.end !== "END") {
            //winner
            this.win = true;
          }
          this.start = false;
          this.end = "END";
        }
      }
    });

    this.socketService.listenToServer("res malus").subscribe((data) => {
      if (
        data.pieceId === this.pieceName &&
        this.player.name !== data.playerName
      ) {
        if (this.mode == 2) {
          this.malus += data.nbMalus - 1;
          let malId = Math.floor(Math.random() * 3);
          if (malId == 0) {
            this.malusRotate += 7 * this.malus;
          } else if (malId == 1) {
            this.malusAcc += 7 * this.malus;
          } else {
            this.socketService.emitToServer("malus hardcore", {
              pieceId: this.pieceName,
              playerName: this.player.name,
              id: this.socketService.socket.id,
              malus: this.malus,
            });
          }
        } else if (this.mode == 3) {
          this.malus += data.nbMalus;
          this.malusRotate += 7 * this.malus;
          this.malusAcc += 7 * this.malus;
          this.socketService.emitToServer("malus hardcore", {
            pieceId: this.pieceName,
            playerName: this.player.name,
            id: this.socketService.socket.id,
            malus: data.nbMalus,
          });
        } else if (this.mode != 0) {
          this.malus += data.nbMalus - 1;
        }
      }
    });

    this.socketService
      .listenToServer("res malus hardcore")
      .subscribe((data) => {
        this.tetroList.splice(this.currentTetro + 1, 0, data);
      });
  }

  ngOnDestroy() {
    this.leavePiece();
  }

  startGame() {
    this.socketService?.emitToServer("start piece", {
      pieceId: this.pieceName,
      playerName: this.player.name,
      id: this.socketService?.socket?.id,
    });
  }

  resStartGame(data) {
    if (data?.piece?.id === this.pieceName) {
      data.players.map((p) => {
        if (p.name === this.player?.name)
          this.player.game.spectrum = p?.game?.spectrum;
      });
      this.tetroList = data?.piece?.tetroList;
      this.playersInGame = data.players;
      this.newTetro = true;
      this.currentTetro = 0;
      this.malus = 0;
      this.malusRotate = 0;
      this.malusAcc = 0;
      this.win = false;
    }
  }

  initPiece(data) {
    this.pieceName = data?.piece?.id;
    this.pieceCreator = data?.piece?.creator;
    this.pieceStart = data?.piece?.start;
    this.piecePlayers = data?.piece?.playersId;
    this.player = data?.player;
    this.start = data?.piece?.start;
    this.mode = data?.piece?.mode;
  }

  colors(id) {
    if (id == 0) return "background: white";
    else if (id == 1) return "background: radial-gradient(#07f9f9,#05aff2)";
    // longbar
    else if (id == 2) return "background: radial-gradient(#079BDB,#056cf2)";
    // P
    else if (id == 3) return "background: radial-gradient(#FFA029,#ff6b35)";
    // L
    else if (id == 4) return "background: radial-gradient(#F9F907,#f2cb05)";
    // squqre
    else if (id == 5) return "background: radial-gradient(#25f369,#038c0c)";
    // 4
    else if (id == 6) return "background: radial-gradient(#f040ff,#a000f1)";
    // T
    else if (id == 7) return "background: radial-gradient(#fd745f,#f22929)";
    // Z
    else if (id == 404) return "background: black";
  }

  stopAll = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  async lineMalus() {
    this.player.game.spectrum.splice(0, 1);
    this.player.game.spectrum.push([
      404, 404, 404, 404, 404, 404, 404, 404, 404, 404,
    ]);
    this.malus--;
  }

  async lineClear(spectrum) {
    var i = 0;
    await spectrum.forEach((row, y) => {
      if (row.every((col) => col > 0 && col != 404)) {
        spectrum.splice(y, 1);
        spectrum.unshift(Array(10).fill(0));
        i++;
      }
    });
    if (i > 1) {
      this.socketService.emitToServer("malus", {
        pieceId: this.pieceName,
        playerName: this.player.name,
        nbMalus: i,
      });
      if (i == 2) {
        this.score += 250;
      } else if (i == 3) {
        this.score += 550;
      } else this.score += 1000;
    } else if (i == 1) {
      this.score += 100;
    }
  }

  unDrawTetro(spectrum: [][], tetro) {
    spectrum.forEach((row: any, y) => {
      row.forEach((col: any, x) => {
        if (
          y >= tetro.position.y &&
          y < tetro.position.y + 4 &&
          x >= tetro.position.x &&
          x < tetro.position.x + 4 &&
          tetro.tetro[y - tetro.position.y] &&
          tetro.tetro[y - tetro.position.y][x - tetro.position.x]
        ) {
          row[x] = 0;
        }
      });
    });
    this.newTetro = false;
  }

  DrawNewTetro(spectrum: [][], tetro) {
    spectrum.forEach((row: [][], y) => {
      row.forEach((col: [], x) => {
        if (
          y >= tetro.position.y &&
          y < tetro.position.y + 4 &&
          x >= tetro.position.x &&
          x < tetro.position.x + 4 &&
          tetro.tetro[y - tetro.position.y] &&
          tetro.tetro[y - tetro.position.y][x - tetro.position.x]
        ) {
          row[x] = tetro.tetro[y - tetro.position.y][x - tetro.position.x];
        }
      });
    });
    this.newTetro = false;
  }

  checkNewPlace(spectrum, tetro, moveY, moveX) {
    return tetro.tetro.every((row, y) => {
      return row.every((col, x) => {
        let posY = y + tetro.position.y + moveY;
        let posX = x + tetro.position.x + moveX;
        if (
          col == 0 ||
          (spectrum[posY] &&
            spectrum[posY][posX] != undefined &&
            spectrum[posY][posX] === 0)
        )
          return true;
        else return false;
      });
    });
  }

  maxDown(spectrum, tetro) {
    var i = 0;
    while (this.checkNewPlace(spectrum, tetro, i + 1, 0)) {
      i++;
    }
    return i;
  }

  rotate(tetro) {
    let clone = JSON.parse(JSON.stringify(tetro));
    for (let i = 0; i < tetro.length; ++i) {
      for (let y = 0; y < i; ++y) {
        [tetro[y][i], tetro[i][y]] = [tetro[i][y], tetro[y][i]];
      }
    }
    tetro.forEach((row) => row.reverse());
    if (
      this.checkNewPlace(
        this.player.game.spectrum,
        this.tetroList[this.currentTetro],
        0,
        0
      )
    ) {
      this.DrawNewTetro(
        this.player.game.spectrum,
        this.tetroList[this.currentTetro]
      );
      return;
    } else {
      this.tetroList[this.currentTetro].tetro = clone;
      this.DrawNewTetro(
        this.player.game.spectrum,
        this.tetroList[this.currentTetro]
      );
    }
  }

  move(event) {
    if (this.start == true && this.lock == false) {
      if (event === "left") {
        this.unDrawTetro(
          this.player.game.spectrum,
          this.tetroList[this.currentTetro]
        );
        if (
          this.checkNewPlace(
            this.player.game.spectrum,
            this.tetroList[this.currentTetro],
            0,
            -1
          )
        )
          this.tetroList[this.currentTetro].position.x--;
        this.DrawNewTetro(
          this.player.game.spectrum,
          this.tetroList[this.currentTetro]
        );
      } else if (event === "up") {
        this.unDrawTetro(
          this.player.game.spectrum,
          this.tetroList[this.currentTetro]
        );
        this.rotate(this.tetroList[this.currentTetro].tetro);
      } else if (event === "right") {
        this.unDrawTetro(
          this.player.game.spectrum,
          this.tetroList[this.currentTetro]
        );
        if (
          this.checkNewPlace(
            this.player.game.spectrum,
            this.tetroList[this.currentTetro],
            0,
            1
          )
        )
          this.tetroList[this.currentTetro].position.x++;
        this.DrawNewTetro(
          this.player.game.spectrum,
          this.tetroList[this.currentTetro]
        );
      } else if (event === "down") {
        this.unDrawTetro(
          this.player.game.spectrum,
          this.tetroList[this.currentTetro]
        );
        if (
          this.checkNewPlace(
            this.player.game.spectrum,
            this.tetroList[this.currentTetro],
            1,
            0
          )
        ) {
          this.tetroList[this.currentTetro].position.y++;
          this.score += 1;
        }
        this.DrawNewTetro(
          this.player.game.spectrum,
          this.tetroList[this.currentTetro]
        );
      } else if (event === "downMax") {
        this.unDrawTetro(
          this.player.game.spectrum,
          this.tetroList[this.currentTetro]
        );
        let yMax = this.maxDown(
          this.player.game.spectrum,
          this.tetroList[this.currentTetro]
        );
        this.score += 2 * yMax;
        this.tetroList[this.currentTetro].position.y +=
          yMax - (this.malus > 0 ? 1 : 0);
        this.DrawNewTetro(
          this.player.game.spectrum,
          this.tetroList[this.currentTetro]
        );
      }
      this.sendSpectrum();
    }
  }

  sendSpectrum() {
    this.socketService.emitToServer("send spectrum", {
      pieceId: this.pieceName,
      player: this.player,
      id: this.socketService?.socket?.id,
      score: this.score,
    });
  }

  changeGameMode(mode: number) {
    this.socketService?.emitToServer("change mode", {
      pieceId: this.pieceName,
      mode: mode,
      id: this.socketService?.socket?.id,
    });
    return mode;
  }

  async leavePiece() {
    if (this.pieceName) {
      {
        this.socketService.emitToServer("leave piece", {
          pieceId: this.pieceName,
          playerName: this.player?.name,
          id: this.socketService?.socket?.id,
        });
      }
      this.pieceName = "";
      this.piecePlayers = [];
      this.pieceCreator = "";
      this.pieceStart = "";
      this.player = null;
      this.start = false;
      this.tetroList = [];
      this.currentTetro = 0;
      this.playersInGame = null;
      this.newTetro = true;
      this.malus = 0;
      this.lock = false;
      this.score = 0;
      this.end = "";
    }
    this.routes.navigate(["home"]);
  }
}
