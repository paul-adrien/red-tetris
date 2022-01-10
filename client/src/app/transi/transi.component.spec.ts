import { HttpClient, HttpHandler } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { WebsocketService } from "../services/websocketService";

import { TransiComponent } from "./transi.component";

describe("TransiComponent", () => {
  let component: TransiComponent;
  let fixture: ComponentFixture<TransiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransiComponent],
      providers: [HttpClient, HttpHandler, WebsocketService],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
