/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { PopUpGameComponent } from "./pop-up-game.component";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";

describe("PopUpGameComponent", () => {
  let component: PopUpGameComponent;
  let fixture: ComponentFixture<PopUpGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpGameComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: { isWin: true } }],
      imports: [MatDialogModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("test when win", () => {
    let url = component.randomGif();
    expect(url).toBeTruthy("./assets/win" + component.number + ".gif");
  });

  it("test when lose", () => {
    component.isWin = false;
    let url = component.randomGif();
    expect(url).toBeTruthy("./assets/lose" + component.number + ".gif");
  });
});
