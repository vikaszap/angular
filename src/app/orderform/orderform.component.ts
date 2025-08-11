import { Component, OnInit, OnDestroy, ElementRef, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subject, forkJoin, Observable, of, from } from 'rxjs';
import { switchMap, mergeMap, map, catchError, takeUntil, finalize, toArray } from 'rxjs/operators';

// Interfaces (keep your existing interfaces)
interface ProductField {
  fieldid: number;
  fieldname: string;
  labelnamecode: string;
  fieldtypeid: number;
  showfieldonjob: number;
  showfieldecomonjob: number;
  optiondefault?: string;
  optionsvalue?: any[];
  value?: string;
  selection?: any;
  mandatory?: any;
  valueid?: string;
  optionid?: any;
  level?: number;
  parentFieldId?: number;
  masterparentfieldid?: number;
  allparentFieldId?: string;
}

interface ProductOption {
  subdatacount: number;
  optionid: string;
  optionname: string;
  optionimage: string;
  fieldoptionlinkid: number;
  availableForEcommerce?: number;
}

interface FractionOption {
  value: string;
  name: string;
}

@Component({
  selector: 'app-orderform',
  templateUrl: './orderform.component.html',
  styleUrls: ['./orderform.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderformComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly MAX_NESTING_LEVEL = 8;

  // Form state
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  // Product data
  showFractions: boolean = false;
  product_details_arr: Record<string, string> = {};
  product_specs: string = '';
  product_description: string = '';
  background_color_image_url: string = '';
  unit_type_data: any[] = [];
  parameters_arr: any[] = [];
  inchfraction_array: FractionOption[] = [
    { value: '0', name: '0"' },
    { value: '0.125', name: '1/8"' },
    { value: '0.25', name: '1/4"' },
    { value: '0.375', name: '3/8"' },
    { value: '0.5', name: '1/2"' },
    { value: '0.625', name: '5/8"' },
    { value: '0.75', name: '3/4"' },
    { value: '0.875', name: '7/8"' }
  ];
  color_arr: Record<string, any> = {};
  product_minimum_price: number = 0;
  min_width: number = 0;
  max_width: number = 0;
  min_drop: number = 0;
  max_drop: number = 0;
  ecomsampleprice: number = 0;
  ecomFreeSample: string = '0';
  delivery_duration: string = '';
  visualizertagline: string = '';
  productname: string = '';
  product_list_page_link: string = '';
  fabricname: string = '';
  hide_frame: boolean = false;
  mainframe: string = '';
  product_img_array: any[] = [];
  product_deafultimage: Record<string, any> = {};
  fabric_linked_color_data: Record<string, any> = {};
  related_products_list_data: any[] = [];
  productlisting_frame_url: string = '';
  sample_img_frame_url: string = '';
  v4_product_visualizer_page: string = '';
  fieldscategoryname: string = '';
  productslug: string = '';
  fabricid: number = 0;
  colorid: number = 0;
  matmapid: number = 0;
  pricegroup_id: number = 0;
  supplier_id: number = 0;
  
  // Form controls
  orderForm: FormGroup;
  previousFormValue: any;
  apiUrl: string = '';
  
  // Data arrays
  parameters_data: ProductField[] = [];
  option_data: Record<number, ProductOption[]> = {};
  routeParams:any;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.orderForm = this.fb.group({
      unit: ['', Validators.required],
      width: ['', [Validators.required, Validators.min(this.min_width), Validators.max(this.max_width)]],
      widthfraction: [''],
      drop: ['', [Validators.required, Validators.min(this.min_drop), Validators.max(this.max_drop)]],
      dropfraction: [''],
      qty: [1, [Validators.required, Validators.min(1)]]
    });
    this.previousFormValue = this.orderForm.value;
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.fetchInitialData(params);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchInitialData(params: any): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.apiService.getProductData(params).pipe(
      takeUntil(this.destroy$),
      switchMap((data: any) => {
        if (data && data[0]?.data) {
          this.parameters_data = data[0].data;
          this.apiUrl = params.api_url;
          this.routeParams = params;
          this.initializeFormControls();
          return this.loadOptionData(params);
        }
        this.errorMessage = 'Invalid product data received';
        return of(null);
      }),
      catchError(err => {
        console.error('Error fetching product data:', err);
        this.errorMessage = 'Failed to load product data. Please try again.';
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
        this.cd.markForCheck();
      })
    ).subscribe();
  }

  private initializeFormControls(): void {
    const formControls: Record<string, any> = {
      unit: ['mm', Validators.required],
      width: ['', [Validators.required, Validators.min(this.min_width), Validators.max(this.max_width)]],
      widthfraction: [''],
      drop: ['', [Validators.required, Validators.min(this.min_drop), Validators.max(this.max_drop)]],
      dropfraction: [''],
      qty: [1, [Validators.required, Validators.min(1)]]
    };

    this.parameters_data.forEach(field => {
      field.level = 1;
      
      if (field.showfieldecomonjob == 1) {
        formControls[`field_${field.fieldid}`] = [
          field.value || '',
          field.mandatory == 1 ? [Validators.required] : []
        ];
      }
    });

    this.orderForm = this.fb.group(formControls);
    this.previousFormValue = this.orderForm.value;
    
    this.orderForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(values => {
      this.onFormChanges(values, this.routeParams);
    });
  }

private loadOptionData(params: any): Observable<any> {
  return this.apiService.filterbasedlist(params, '').pipe(
    takeUntil(this.destroy$),
    switchMap((filterData: any) => {
      if (!filterData?.[0]?.data?.optionarray) return of([]);  // <-- changed null to []

      const filterresponseData = filterData[0].data;
      const optionRequests: Observable<any>[] = [];

      this.parameters_data.forEach((field: ProductField) => {
         let valueToSet: any;
        if ([3, 5, 20].includes(field.fieldtypeid)) {
          let matrial = 0;
          let filter = '';

          if (field.fieldtypeid === 3) {
            matrial = 0;
            filter = filterresponseData.optionarray[field.fieldid];
          } else if (field.fieldtypeid === 5) {
            matrial = 1;
            filter = filterresponseData.coloridsarray;
          } else if (field.fieldtypeid === 20) {
            matrial = 2;
            filter = filterresponseData.coloridsarray;
          }

          optionRequests.push(
            this.apiService.getOptionlist(
              params,
              1,
              field.fieldtypeid,
              matrial,
              field.fieldid,
              filter
            ).pipe(
              map((optionData: any) => ({ fieldId: field.fieldid, optionData })),
              catchError(err => {
                console.error(`Error loading options for field ${field.fieldid}:`, err);
                return of(null);
              })
            )
          );
        }else if([14,34,17,13].includes(field.fieldtypeid)){
          const control = this.orderForm.get(`field_${field.fieldid}`);
            if (control) {
              if(field.fieldtypeid ==14){
                valueToSet = 1;
              }else{
                valueToSet = field.optiondefault !== undefined && field.optiondefault !== null && field.optiondefault != ""
                ? Number(field.optiondefault)
                : '';
              }
              control.setValue(valueToSet, { emitEvent: false });
            }
        }
      });

      return optionRequests.length > 0 
        ? forkJoin(optionRequests).pipe(map(responses => responses.filter(r => r !== null)))
        : of([]);
    }),
    map((responses: any[]) => {
      responses.forEach((response: { fieldId: number, optionData: any }) => {
        const field = this.parameters_data.find(f => f.fieldid === response.fieldId);
        if (!field) return;

        const options = response.optionData?.[0]?.data?.[0]?.optionsvalue;
        const filteredOptions = Array.isArray(options) 
          ? options.filter((option: any) => option.availableForEcommerce !== 0)
          : [];

        if (filteredOptions.length === 0) {
          this.orderForm.removeControl(`field_${field.fieldid}`);
          return;
        }

        this.option_data[field.fieldid] = filteredOptions;
        const control = this.orderForm.get(`field_${field.fieldid}`);

        if (control) {
          console.log(`field_${field.fieldid}`);
          let valueToSet: any;
          if (field.fieldtypeid === 3 && field.selection == 1) {
            valueToSet = field.optiondefault
              ? field.optiondefault.toString().split(',').filter((val: string) => val !== '').map(Number)
              : [];
          } else if (field.fieldtypeid === 20) {
            valueToSet = +params.color_id;
          } else if (field.fieldtypeid === 5) {
            valueToSet = +params.fabric_id;
          } else {
            valueToSet = field.optiondefault !== undefined && field.optiondefault !== null && field.optiondefault != ""
              ? Number(field.optiondefault)
              : '';
          }

          control.setValue(valueToSet, { emitEvent: false });
          //this.handleOptionSelectionChange(params, field, valueToSet);
        }
      });

      this.parameters_data = this.parameters_data.filter((field: ProductField) => {
        if ([34, 17, 13].includes(field.fieldtypeid)) {
          return Array.isArray(field.optionsvalue) && field.optionsvalue.length > 0;
        } else if ([3, 5, 20].includes(field.fieldtypeid)) {
          return this.option_data[field.fieldid]?.length > 0;
        }
        return true;
      });

      return true;
    }),
    catchError(err => {
      console.error('Error in option data loading:', err);
      return of(null);
    })
  );
}


  private handleOptionSelectionChange(params: any, field: ProductField, value: any): void {
    if (!field || value === null || value === undefined || value === '') {
      this.clearExistingSubfields(field.fieldid);
      return;
    }

    this.clearExistingSubfields(field.fieldid);
    const options = this.option_data[field.fieldid];
    if (!options || options.length === 0) return;

    if (Array.isArray(value)) {
      const selectedOptions = options.filter(opt => value.includes(opt.optionid));
      if (selectedOptions.length === 0) return;

      from(selectedOptions).pipe(
        mergeMap(option => this.processSelectedOption(params, field, option)),
        toArray(),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.updateFieldValues(field, selectedOptions);
        this.cd.markForCheck();
      });
    } else {
      const selectedOption = options.find(opt => opt.optionid == value);
      if (!selectedOption) return;

      this.processSelectedOption(params, field, selectedOption).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.updateFieldValues(field, selectedOption);
        this.cd.markForCheck();
      });
    }
  }

  private processSelectedOption(params: any, parentField: ProductField, option: ProductOption): Observable<any> {
    if (!option?.subdatacount || option.subdatacount <= 0) return of(null);

    const parentLevel = parentField.level || 1;
    if (parentLevel >= this.MAX_NESTING_LEVEL) return of(null);

    return this.apiService.sublist(
      params,
      parentLevel + 1,
      parentField.fieldtypeid,
      option.fieldoptionlinkid,
      option.optionid,
      parentField.masterparentfieldid
    ).pipe(
      takeUntil(this.destroy$),
      switchMap((subFieldResponse: any) => {
        const sublist = subFieldResponse?.[0]?.data;
        if (!Array.isArray(sublist)) return of(null);

        return from(sublist.filter((subfield: ProductField) => subfield.fieldtypeid === 3)).pipe(
          mergeMap(subfield => this.processSubfield(params, subfield, parentField, parentLevel + 1)),
          toArray()
        );
      }),
      catchError(err => {
        console.error('Error processing selected option:', err);
        return of(null);
      })
    );
  }

  private processSubfield(params: any, subfield: ProductField, parentField: ProductField, level: number): Observable<any> {
    subfield.parentFieldId = parentField.fieldid;
    subfield.level = level;
    subfield.masterparentfieldid = parentField.masterparentfieldid || parentField.fieldid;
    subfield.allparentFieldId = parentField.allparentFieldId 
      ? `${parentField.allparentFieldId},${subfield.fieldid}`
      : `${parentField.fieldid},${subfield.fieldid}`;

    const parentIndex = this.parameters_data.findIndex(f => f.fieldid === parentField.fieldid);
    if (parentIndex !== -1) {
      this.parameters_data.splice(parentIndex + 1, 0, subfield);
    } else {
      this.parameters_data.push(subfield);
    }

    this.addSubfieldFormControlSafe(subfield);
    return this.loadSubfieldOptions(params, subfield);
  }

  private loadSubfieldOptions(params: any, subfield: ProductField): Observable<any> {
    return this.apiService.filterbasedlist(params, '', String(subfield.fieldtypeid), String(subfield.fieldid)).pipe(
      takeUntil(this.destroy$),
      switchMap((filterData: any) => {
        const filter = filterData?.[0]?.data?.optionarray?.[subfield.fieldid] || '';
        return this.apiService.getOptionlist(
          params,
          subfield.level,
          subfield.fieldtypeid,
          0,
          subfield.fieldid,
          filter
        ).pipe(
          takeUntil(this.destroy$),
          map((optionData: any) => {
            const options = optionData?.[0]?.data?.[0]?.optionsvalue || [];
            const filteredOptions = options.filter((opt: any) => 
              opt.availableForEcommerce === undefined || 
              opt.availableForEcommerce === 1
            );

            if (filteredOptions.length === 0) {
              throw new Error('No valid options available');
            }

            this.option_data[subfield.fieldid] = filteredOptions;
            
            const control = this.orderForm.get(`field_${subfield.fieldid}`);
            if (control && subfield.optiondefault) {
              control.setValue(subfield.optiondefault, { emitEvent: false });
            }

            return filteredOptions;
          }),
          catchError(err => {
            console.error('Error loading subfield options:', err);
            this.removeFieldSafely(subfield.fieldid);
            return of(null);
          })
        );
      }),
      catchError(err => {
        console.error('Error fetching subfield filter data:', err);
        this.removeFieldSafely(subfield.fieldid);
        return of(null);
      })
    );
  }

  private addSubfieldFormControlSafe(subfield: ProductField): void {
    const controlName = `field_${subfield.fieldid}`;
    
    if (this.orderForm.get(controlName)) {
      return;
    }

    const formControl = this.fb.control(
      subfield.value || '',
      subfield.mandatory == 1 ? [Validators.required] : []
    );

    this.orderForm.addControl(controlName, formControl);
  }

  private removeFieldSafely(fieldId: number): void {
    this.parameters_data = this.parameters_data.filter(f => f.fieldid !== fieldId);
    
    const controlName = `field_${fieldId}`;
    if (this.orderForm.contains(controlName)) {
      this.orderForm.removeControl(controlName);
    }
    
    delete this.option_data[fieldId];
  }

  private clearExistingSubfields(parentFieldId: number): void {
    const removeFieldIds: number[] = [];
    
    const collectDescendants = (pId: number) => {
      this.parameters_data.forEach(f => {
        if (f.parentFieldId === pId) {
          removeFieldIds.push(f.fieldid);
          collectDescendants(f.fieldid);
        }
      });
    };

    collectDescendants(parentFieldId);

    this.parameters_data = this.parameters_data.filter(f => !removeFieldIds.includes(f.fieldid));

    removeFieldIds.forEach(fieldId => {
      const controlName = `field_${fieldId}`;
      if (this.orderForm.contains(controlName)) {
        this.orderForm.removeControl(controlName);
      }
      delete this.option_data[fieldId];
    });
  }

  private updateFieldValues(field: ProductField, selectedOption: any): void {
    if (Array.isArray(selectedOption)) {
      field.value = selectedOption.map(opt => opt.optionname).join(', ');
      field.valueid = selectedOption.map(opt => opt.optionid).join(',');
      field.optionsvalue = selectedOption;
    } else {
      field.value = selectedOption.optionname;
      field.valueid = selectedOption.optionid;
      field.optionsvalue = [selectedOption];
    }
    field.optionid = field.valueid;
  }

  onFormChanges(values: any, params: any): void {
    console.log(values);
    if (!this.previousFormValue) {
      this.previousFormValue = { ...values };
      return;
    }

    for (const key in values) {
      if (values[key] !== this.previousFormValue[key] && key.startsWith('field_')) {
        const fieldId = parseInt(key.replace('field_', ''), 10);
        const field = this.parameters_data.find(f => f.fieldid === fieldId);

        if (field && [3, 5, 20].includes(field.fieldtypeid)) {
          this.handleOptionSelectionChange(params, field, values[key]);
        } else if (field && field.fieldtypeid === 34) {
          this.handleUnitTypeChange(values[key], params);
        }
      }
    }
    this.previousFormValue = { ...values };
  }
  handleUnitTypeChange(value: any, params: any): void {
    const unitValue = typeof value === 'string' ? parseInt(value, 10) : value;
    console.log(unitValue);
    this.showFractions = (unitValue === 4);

    this.apiService.getFractionData(params, unitValue).pipe(
      takeUntil(this.destroy$),
      catchError(err => {
        console.error('Error fetching fraction data:', err);
        this.inchfraction_array = [];
        return of(null);
      })
    ).subscribe((FractionData: any) => {
      if (FractionData?.result?.inchfraction) {
        this.inchfraction_array = FractionData.result.inchfraction.map((item: any) => ({
          name: item.name,
          value: item.decimalvalue
        }));
      } else {
        this.inchfraction_array = [];
      }
      this.cd.markForCheck();
    });
  }

  onSubmit(): void {
    if (this.orderForm.invalid || this.isSubmitting) {
      this.markFormGroupTouched(this.orderForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.apiService.addToCart(this.orderForm.value).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.isSubmitting = false;
        this.cd.markForCheck();
      })
    ).subscribe({
      next: (response) => {
        console.log('Added to cart successfully', response);
        // Add any success handling here (e.g., show confirmation, navigate)
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.errorMessage = 'Failed to add to cart. Please try again.';
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

 public freesample(button: any): void {
    try {
      const free_sample_data = JSON.parse(button.getAttribute('data-free_sample_data'));
      this.apiService.addFreeSample(free_sample_data).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          console.log('Free sample request successful', response);
          // Add success handling (e.g., show confirmation message)
        },
        error: (err) => {
          console.error('Error requesting free sample:', err);
          // Add error handling
        }
      });
    } catch (err) {
      console.error('Error parsing free sample data:', err);
    }
  }

  public  get_field_type_name(chosen_field_type_id: any): string {
    const field_types: Record<string, string> = {
      '3': 'list',
      '5': 'fabric_and_color',
      '6': 'number',
      '7': 'x_footage',
      '8': 'number', 
      '9': 'y_footage',
      '10': 'height',
      '11': 'width_with_fraction', 
      '12': 'drop_with_fraction',   
      '13': 'pricegroup',
      '14': 'qty',
      '17': 'supplier',
      '18': 'text',
      '31': 'x_square_yard',
      '32': 'y_square_yard',
      '34': 'unit_type',
      '21': 'shutter_materials',
      '25': 'accessories_list',
      '20': 'slats_materials',
    };

    return field_types[chosen_field_type_id] || '';
  }

  public isSelectedFrame(product_img: any): boolean {
    return product_img?.is_default || false;
  }

  public getFrameImageUrl(product_img: any): string {
    return product_img?.image_url || '';
  }

  public getFreeSampleData(related_product: any = null): string {
    const sample_data = {
      fabric_id: related_product ? related_product.fd_id : this.fabricid,
      color_id: related_product ? related_product.cd_id : this.colorid,
      price_group_id: related_product ? related_product.groupid : this.pricegroup_id,
      fabricname: related_product ? this.getRelatedProductName(related_product) : this.fabricname,
      fabric_image_url: related_product ? this.getRelatedProductImageUrl(related_product) : this.background_color_image_url
    };
    return JSON.stringify(sample_data);
  }

  public getRelatedProductLink(related_product: any): string[] {
    return ['/product', related_product?.slug || ''];
  }

  public getRelatedProductImageUrl(related_product: any): string {
    return related_product?.image_url || '';
  }

  public getRelatedProductName(related_product: any): string {
    return related_product?.name || '';
  }

  trackByFieldId(index: number, field: ProductField): number {
    return field.fieldid;
  }

  // Helper property for template
  get isBlinds(): boolean {
    return true; // Update this based on your actual logic
  }

  // Helper function for template
  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }
}