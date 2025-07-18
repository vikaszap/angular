import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderformdeleteComponent } from './orderformdelete.component';

describe('OrderformdeleteComponent', () => {
  let component: OrderformdeleteComponent;
  let fixture: ComponentFixture<OrderformdeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderformdeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderformdeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
