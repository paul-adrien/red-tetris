import { TestBed } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { WebsocketService } from "./websocketService";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { pieceService } from "./piece.service";

describe("pieceService", () => {
  let service: pieceService;

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
});
