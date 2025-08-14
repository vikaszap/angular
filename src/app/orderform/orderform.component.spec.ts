import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderformComponent, FieldType } from './orderform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../services/api.service';

describe('OrderformComponent', () => {
  let component: OrderformComponent;
  let fixture: ComponentFixture<OrderformComponent>;
  let apiService: ApiService;

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
        },
        ApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderformComponent);
    apiService = TestBed.inject(ApiService);
    component = fixture.componentInstance;

    // Mock initial data loading to avoid running real ngOnInit logic
    spyOn(component as any, 'fetchInitialData').and.callFake(() => {
        component.routeParams = { recipeid: '123', productid: '456' };
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default qty', () => {
    expect(component.orderForm).toBeDefined();
    expect(component.orderForm.get('qty')?.value).toBe(1);
  });

  it('should update field value when simple input changes', () => {
    // 1. Setup
    const testField = {
      fieldid: 101,
      fieldname: 'Test Input',
      fieldtypeid: FieldType.TEXT,
      showfieldecomonjob: 1
    };
    component.parameters_data = [testField as any];

    // Manually initialize form and listeners for this test
    (component as any).initializeFormControls();

    const control = component.orderForm.get('field_101');
    expect(control).toBeTruthy();

    // 2. Action
    control?.setValue('New Value');

    // 3. Assert
    const fieldInState = (component as any).findFieldByIdRecursive(component.parameters_data, 101);
    expect(fieldInState).toBeTruthy();
    expect(fieldInState.value).toBe('New Value');
  });

  it('should call handleOptionSelectionChange when a dropdown value changes', () => {
    // 1. Setup
    const testField = {
      fieldid: 202,
      fieldname: 'Test Dropdown',
      fieldtypeid: FieldType.LIST,
      showfieldecomonjob: 1,
      optionsvalue: [{ optionid: 'opt1', optionname: 'Option 1' }]
    };
    component.parameters_data = [testField as any];
    component.option_data[202] = [{ optionid: 'opt1', optionname: 'Option 1' } as any];

    // Spy on the method we want to test
    spyOn(component as any, 'handleOptionSelectionChange').and.callThrough();
    spyOn(component as any, 'clearExistingSubfields').and.stub();

    // Manually initialize form and listeners
    (component as any).initializeFormControls();

    const control = component.orderForm.get('field_202');
    expect(control).toBeTruthy();

    // 2. Action
    control?.setValue('opt1');

    // 3. Assert
    expect((component as any).handleOptionSelectionChange).toHaveBeenCalled();
    expect((component as any).handleOptionSelectionChange).toHaveBeenCalledWith(
        component.routeParams,
        jasmine.objectContaining({ fieldid: 202 }),
        'opt1'
    );
  });
});