import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListesDesMachines } from './listes-des-machines';

describe('ListesDesMachines', () => {
  let component: ListesDesMachines;
  let fixture: ComponentFixture<ListesDesMachines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListesDesMachines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListesDesMachines);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
