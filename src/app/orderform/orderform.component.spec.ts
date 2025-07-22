import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderform } from './orderform';

describe('Orderform', () => {
  let component: Orderform;
  let fixture: ComponentFixture<Orderform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orderform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Orderform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
