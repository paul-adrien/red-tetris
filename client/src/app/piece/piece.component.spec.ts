import { HttpClient, HttpHandler } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterTestingModule } from "@angular/router/testing";
import { HomeComponent } from "../home/home.component";
import { WebsocketService } from "../services/websocketService";

import { PieceComponent } from "./piece.component";

describe("PieceComponent", () => {
  let component: PieceComponent;
  let fixture: ComponentFixture<PieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "home", component: HomeComponent },
        ]),
        MatDialogModule,
      ],
      providers: [
        HttpClient,
        HttpHandler,
        // InAppBrowser,
        WebsocketService,
        // AuthService
      ],
      declarations: [PieceComponent, HomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
