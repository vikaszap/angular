import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombrogridComponent } from './combrogrid.component';

describe('CombrogridComponent', () => {
  let component: CombrogridComponent;
  let fixture: ComponentFixture<CombrogridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombrogridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombrogridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
