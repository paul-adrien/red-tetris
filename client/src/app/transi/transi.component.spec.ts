import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransiComponent } from './transi.component';

describe('TransiComponent', () => {
  let component: TransiComponent;
  let fixture: ComponentFixture<TransiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
