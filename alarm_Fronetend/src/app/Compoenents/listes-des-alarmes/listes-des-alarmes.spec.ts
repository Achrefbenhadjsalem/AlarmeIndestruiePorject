import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListesDesAlarmes } from './listes-des-alarmes';

describe('ListesDesAlarmes', () => {
  let component: ListesDesAlarmes;
  let fixture: ComponentFixture<ListesDesAlarmes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListesDesAlarmes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListesDesAlarmes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
