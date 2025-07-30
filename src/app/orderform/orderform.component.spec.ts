import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderformComponent } from './orderform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('OrderformComponent', () => {
  let component: OrderformComponent;
  let fixture: ComponentFixture<OrderformComponent>;

  const mockProductData = [{
    data: [
      {
        fieldid: 1,
        fieldname: 'Test Field',
        labelnamecode: 'test_field',
        fieldtypeid: 3,
        showfieldonjob: '1',
        optionsvalue: []
      }
    ]
  }];

  const mockFilterData = [{
    data: {
      optionarray: {
        1: ['option1', 'option2']
      }
    }
  }];

  const mockOptionData = [{
    data: [{
      optionsvalue: [
        { optionid: '1', optionname: 'Option 1' },
        { optionid: '2', optionname: 'Option 2' }
      ]
    }]
  }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        OrderformComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ recipeid: '123', productid: '456' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.orderForm).toBeDefined();
    expect(component.orderForm.get('unit')?.value).toBe('mm');
    expect(component.orderForm.get('qty')?.value).toBe(1);
  });

  it('should handle unit type change', () => {
    component.handleUnitTypeChange('4');
    expect(component.showFractions).toBeTrue();
    
    component.handleUnitTypeChange('2');
    expect(component.showFractions).toBeFalse();
  });

  it('should get field type name correctly', () => {
    expect(component.get_field_type_name('3')).toBe('list');
    expect(component.get_field_type_name('11')).toBe('width_with_fraction');
    expect(component.get_field_type_name('999')).toBe('');
  });

  it('should detect form changes', () => {
    spyOn(console, 'log');
    component.orderForm.get('width')?.setValue('100');
    expect(console.log).toHaveBeenCalled();
  });

});