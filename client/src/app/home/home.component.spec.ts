import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClient, HttpHandler } from "@angular/common/http";

import { HomeComponent } from "./home.component";
import { WebsocketService } from "../services/websocketService";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { io } from "socket.io-client";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let service: WebsocketService;

  var base_url = "http://localhost:3000";

  var socket;
  var originalTimeout;

  beforeAll(() => {
    socket = io(base_url);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [WebsocketService],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
    service = TestBed.inject(WebsocketService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    expect(service).toBeTruthy();
  });

  it("create/join piece", () => {
    socket.emit("join piece", {
      pieceId: "test_pieceId",
      playerName: "test_playerName",
      id: socket.id,
    });
    component.checkPieceId("a");
    component.checkPlayerId("a");
    component.getPieceList();
    component.playerList();
    component.createPiece("test", "test");
    component.joinPiece("test", "test2", 0);
    component.leavePiece("test", "test");
    component.leavePiece("test", "test2");
    expect(component).toBeTruthy();
  });

  it("test get color class", () => {
    var light_blue = component.getColorClass(0);
    component.getColorClass(1);
    component.getColorClass(2);
    component.getColorClass(3);
    component.getColorClass(4);
    component.getColorClass(5);
    component.getColorClass(6);
    expect(light_blue).toEqual("light-blue");
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});
