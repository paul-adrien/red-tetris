import { TestBed } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { WebsocketService } from "./websocketService";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { pieceService } from "./piece.service";

describe("pieceService", () => {
  let service: pieceService;

  var data = {
    piece: {
      id: "test",
      creator: "test",
      start: false,
      playersId: ["test"],
      mode: 0,
    },
    player: {
      name: "test",
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [WebsocketService],
    });
    service = TestBed.inject(pieceService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("init piece", () => {
    service.initPiece(data);
    expect(service.pieceName).toEqual("test");
  });

  it("change game mode", () => {
    let mode = service.changeGameMode(2);
    expect(mode).toEqual(2);
  });

  it("test color", () => {
    let test = service.colors(0);
    service.colors(1);
    service.colors(2);
    service.colors(3);
    service.colors(4);
    service.colors(5);
    service.colors(6);
    service.colors(7);
    service.colors(404);
    expect(test).toEqual("background: white");
  });
});
