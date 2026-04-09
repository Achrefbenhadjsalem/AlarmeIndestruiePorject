import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAlarmes } from './edit-alarmes';

describe('EditAlarmes', () => {
  let component: EditAlarmes;
  let fixture: ComponentFixture<EditAlarmes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAlarmes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAlarmes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
