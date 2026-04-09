import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddNewAlarme } from './popup-add-new-alarme';

describe('PopupAddNewAlarme', () => {
  let component: PopupAddNewAlarme;
  let fixture: ComponentFixture<PopupAddNewAlarme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupAddNewAlarme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupAddNewAlarme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
