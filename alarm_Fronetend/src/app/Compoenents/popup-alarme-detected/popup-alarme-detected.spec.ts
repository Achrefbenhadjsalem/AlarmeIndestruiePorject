import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAlarmeDetected } from './popup-alarme-detected';

describe('PopupAlarmeDetected', () => {
  let component: PopupAlarmeDetected;
  let fixture: ComponentFixture<PopupAlarmeDetected>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupAlarmeDetected]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupAlarmeDetected);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
