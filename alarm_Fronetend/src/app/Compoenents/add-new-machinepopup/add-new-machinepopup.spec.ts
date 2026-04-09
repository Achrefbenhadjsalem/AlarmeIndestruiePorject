import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMAchinepopup } from './add-new-machinepopup';

describe('AddNewMAchinepopup', () => {
  let component: AddNewMAchinepopup;
  let fixture: ComponentFixture<AddNewMAchinepopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewMAchinepopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewMAchinepopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
