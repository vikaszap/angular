import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderheadercheckboxComponent } from './orderheadercheckbox.component';

describe('OrderheadercheckboxComponent', () => {
  let component: OrderheadercheckboxComponent;
  let fixture: ComponentFixture<OrderheadercheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderheadercheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderheadercheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
