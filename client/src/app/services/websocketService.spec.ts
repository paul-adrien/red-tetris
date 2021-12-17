import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { WebsocketService } from "./websocketService";

describe("SocketService", () => {
  let service: WebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [WebsocketService],
    });
    service = TestBed.inject(WebsocketService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
