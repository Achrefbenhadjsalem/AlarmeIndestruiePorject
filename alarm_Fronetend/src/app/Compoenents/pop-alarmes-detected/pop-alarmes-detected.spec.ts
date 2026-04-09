import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopAlarmesDetected } from './pop-alarmes-detected';

describe('PopAlarmesDetected', () => {
  let component: PopAlarmesDetected;
  let fixture: ComponentFixture<PopAlarmesDetected>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopAlarmesDetected]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopAlarmesDetected);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
