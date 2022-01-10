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
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
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
});
