import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdtitMAchinePopup } from './edtit-machine-popup';

describe('EdtitMAchinePopup', () => {
  let component: EdtitMAchinePopup;
  let fixture: ComponentFixture<EdtitMAchinePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdtitMAchinePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdtitMAchinePopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
