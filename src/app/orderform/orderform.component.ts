import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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

// Interfaces (kept as you had them)
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
  optionid: string | number;
  optionname: string;
  optionimage: string;
  optionsvalue: any;
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

  // Form / UI state
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;

  // Product data
  showFractions = false;
  product_details_arr: Record<string, string> = {};
  product_specs = '';
  product_description = '';
  background_color_image_url = '';
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
  product_minimum_price = 0;
  min_width = 0;
  max_width = 0;
  min_drop = 0;
  max_drop = 0;
  ecomsampleprice = 0;
  ecomFreeSample = '0';
  delivery_duration = '';
  visualizertagline = '';
  productname = '';
  product_list_page_link = '';
  fabricname = '';
  hide_frame = false;
  mainframe = '';
  product_img_array: any[] = [];
  product_deafultimage: Record<string, any> = {};
  fabric_linked_color_data: Record<string, any> = {};
  related_products_list_data: any[] = [];
  productlisting_frame_url = '';
  sample_img_frame_url = '';
  v4_product_visualizer_page = '';
  fieldscategoryname = '';
  productslug = '';
  fabricid = 0;
  colorid = 0;
  matmapid = 0;
  pricegroup_id = 0;
  supplier_id: number | null = null;

  // Form controls
  orderForm: FormGroup;
  previousFormValue: any;
  apiUrl = '';

  // Data arrays
  parameters_data: ProductField[] = [];
  option_data: Record<number, ProductOption[]> = {};
  routeParams: any;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    // initial minimal group; will be replaced in initializeFormControls
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
      // Add only ecom-visible fields initially
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

  /**
   * Load top-level option data for fields that require it (3,5,20 etc.)
   */
  private loadOptionData(params: any): Observable<any> {
    return this.apiService.filterbasedlist(params, '').pipe(
      takeUntil(this.destroy$),
      switchMap((filterData: any) => {
        // if no optionarray, return empty responses
        if (!filterData?.[0]?.data?.optionarray) return of([]);

        const filterresponseData = filterData[0].data;
        const optionRequests: Observable<any>[] = [];

        this.parameters_data.forEach((field: ProductField) => {
          // top-level select-like fields that need optionlist fetch
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
          } else if ([14, 34, 17, 13].includes(field.fieldtypeid)) {
            // fields that don't need external option fetch but need default value set
            const control = this.orderForm.get(`field_${field.fieldid}`);
            if (control) {
              let valueToSet: any = '';

              if (field.fieldtypeid === 14) {
                valueToSet = 1;
              } else if (field.fieldtypeid === 17) {
                this.supplier_id = (field.optiondefault !== undefined && field.optiondefault !== null && field.optiondefault !== '')
                  ? Number(field.optiondefault)
                  : (Array.isArray(field.optionsvalue) && field.optionsvalue.length > 0 ? Number(field.optionsvalue[0].id || field.optionsvalue[0].optionid || 0) : null);
                valueToSet = this.supplier_id ?? '';
              } else {
                valueToSet = (field.optiondefault !== undefined && field.optiondefault !== null && field.optiondefault !== '')
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
            // remove control if no options available
            if (this.orderForm.contains(`field_${field.fieldid}`)) {
              this.orderForm.removeControl(`field_${field.fieldid}`);
            }
            return;
          }

          this.option_data[field.fieldid] = filteredOptions;
          const control = this.orderForm.get(`field_${field.fieldid}`);

          if (control) {
            let valueToSet: any;

            if (field.fieldtypeid === 3 && field.selection == 1) {
              valueToSet = field.optiondefault
                ? field.optiondefault.toString().split(',').filter((val: string) => val !== '').map(Number)
                : [];
            } else if (field.fieldtypeid === 20) {
              valueToSet = +params.color_id || '';
            } else if (field.fieldtypeid === 5) {
              valueToSet = +params.fabric_id || '';
            } else {
              valueToSet = (field.optiondefault !== undefined && field.optiondefault !== null && field.optiondefault !== '')
                ? Number(field.optiondefault)
                : '';
            }
            control.setValue(valueToSet, { emitEvent: false });
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

  /**
   * Called whenever a field's option selection changes (top-level or subfield).
   * Responsible for clearing existing subfields and re-loading as necessary.
   */
  private handleOptionSelectionChange(params: any, field: ProductField, value: any): void {
    if (!field) return;

    if (value === null || value === undefined || value === '') {
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
      const selectedOption = options.find(opt => `${opt.optionid}` == `${value}`);
      if (!selectedOption) return;

      this.processSelectedOption(params, field, selectedOption).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.updateFieldValues(field, selectedOption);
        this.cd.markForCheck();
      });
    }
  }

  /**
   * If an option itself has subdata, fetch them (sublist) and add subfields.
   */
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
      parentField.masterparentfieldid,
      this.supplier_id
    ).pipe(
      takeUntil(this.destroy$),
      switchMap((subFieldResponse: any) => {
        const sublist = subFieldResponse?.[0]?.data;
        if (!Array.isArray(sublist)) return of(null);

        // filter to only fields that we know how to handle
        const relevant = sublist.filter((subfield: ProductField) =>
          [3, 5, 20, 21].includes(subfield.fieldtypeid)
        );

        if (relevant.length === 0) return of(null);

        return from(relevant).pipe(
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

  /**
   * Insert subfield into parameters_data (if not already present), add form control, and load its options.
   */
  private processSubfield(params: any, subfield: ProductField, parentField: ProductField, level: number): Observable<any> {
    // set relationships and level
    subfield.parentFieldId = parentField.fieldid;
    subfield.level = level;
    subfield.masterparentfieldid = parentField.masterparentfieldid || parentField.fieldid;
    subfield.allparentFieldId = parentField.allparentFieldId
      ? `${parentField.allparentFieldId},${subfield.fieldid}`
      : `${parentField.fieldid},${subfield.fieldid}`;

    // Prevent duplicate insertion — if already present, update relationships and skip re-insertion
    const alreadyExists = this.parameters_data.some(f => f.fieldid === subfield.fieldid);
    if (!alreadyExists) {
      const parentIndex = this.parameters_data.findIndex(f => f.fieldid === parentField.fieldid);
      if (parentIndex !== -1) {
        this.parameters_data.splice(parentIndex + 1, 0, subfield);
      } else {
        this.parameters_data.push(subfield);
      }
    } else {
      // Update existing entry's relational properties to be safe
      const existing = this.parameters_data.find(f => f.fieldid === subfield.fieldid);
      if (existing) {
        existing.parentFieldId = subfield.parentFieldId;
        existing.level = subfield.level;
        existing.masterparentfieldid = subfield.masterparentfieldid;
        existing.allparentFieldId = subfield.allparentFieldId;
      }
    }

    // Add the control if not present
    this.addSubfieldFormControlSafe(subfield);

    // Load options for this subfield (if applicable)
    return this.loadSubfieldOptions(params, subfield).pipe(
      // ensure we always return an observable even if loadSubfieldOptions results in null
      map(res => res || null),
      catchError(err => {
        console.error('Error in processSubfield:', err);
        // if anything goes wrong, remove this subfield to keep UI consistent
        this.removeFieldSafely(subfield.fieldid);
        return of(null);
      })
    );
  }

  /**
   * Load options for a subfield using filterbasedlist + getOptionlist
   */
  private loadSubfieldOptions(params: any, subfield: ProductField): Observable<any> {
    return this.apiService.filterbasedlist(params, '', String(subfield.fieldtypeid), String(subfield.fieldid)).pipe(
      takeUntil(this.destroy$),
      switchMap((filterData: any) => {
        if (!filterData?.[0]?.data?.optionarray) return of(null);

        const filterresponseData = filterData[0].data;

        if ([3, 5, 20].includes(subfield.fieldtypeid)) {
          let matrial = 0;
          let filter = '';

          if (subfield.fieldtypeid === 3) {
            matrial = 0;
            filter = filterresponseData.optionarray[subfield.fieldid];
          } else if (subfield.fieldtypeid === 5) {
            matrial = 2;
            filter = filterresponseData.coloridsarray;
          } else if (subfield.fieldtypeid === 20) {
            matrial = 2;
            filter = filterresponseData.coloridsarray;
          }

          return this.apiService.getOptionlist(
            params,
            subfield.level,
            subfield.fieldtypeid,
            matrial,
            subfield.fieldid,
            filter
          ).pipe(
            takeUntil(this.destroy$),
            map((optionData: any) => {
              const options = optionData?.[0]?.data?.[0]?.optionsvalue || [];
              const filteredOptions = Array.isArray(options)
                ? options.filter((opt: any) =>
                    opt.availableForEcommerce === undefined || opt.availableForEcommerce === 1
                  )
                : [];

              if (filteredOptions.length === 0) {
                // If no options, remove the subfield and return null
                this.removeFieldSafely(subfield.fieldid);
                return null;
              }

              this.option_data[subfield.fieldid] = filteredOptions;

              // set default value safely (without emitting)
              const control = this.orderForm.get(`field_${subfield.fieldid}`);
              if (control) {
                let valueToSet: any;
                if (subfield.fieldtypeid === 3 && subfield.selection == 1) {
                  valueToSet = subfield.optiondefault
                    ? subfield.optiondefault.toString().split(',').filter((val: string) => val !== '').map(Number)
                    : [];
                } else if (subfield.fieldtypeid === 5 && subfield.level == 2) {
                  valueToSet = +params.color_id || '';
                } else {
                  valueToSet = (subfield.optiondefault !== undefined && subfield.optiondefault !== null && subfield.optiondefault !== '')
                    ? Number(subfield.optiondefault)
                    : '';
                }

                control.setValue(valueToSet, { emitEvent: false });

                // We want to trigger sub-subfields for this subfield's default value only once.
                // Ensure subfield already present (we added it in processSubfield) and call handler.
                // Because processSubfield uses duplication-guards, repeated calls won't create duplicates.
                if (valueToSet !== null && valueToSet !== '' && valueToSet !== undefined) {
                  // small microtask to avoid synchronous reentrancy issues
                  setTimeout(() => this.handleOptionSelectionChange(params, subfield, valueToSet), 0);
                }
              }

              return filteredOptions;
            }),
            catchError(err => {
              console.error('Error loading subfield options:', err);
              this.removeFieldSafely(subfield.fieldid);
              return of(null);
            })
          );
        }

        // if not a handled fieldtype, just return null
        return of(null);
      }),
      catchError(err => {
        console.error('Error fetching subfield filter data:', err);
        this.removeFieldSafely(subfield.fieldid);
        return of(null);
      })
    );
  }

  /**
   * Add a control only if it doesn't already exist.
   */
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

  /**
   * Remove a field from parameters_data and the form safely.
   */
  private removeFieldSafely(fieldId: number): void {
    this.parameters_data = this.parameters_data.filter(f => f.fieldid !== fieldId);

    const controlName = `field_${fieldId}`;
    if (this.orderForm.contains(controlName)) {
      this.orderForm.removeControl(controlName);
    }

    if (this.option_data[fieldId]) {
      delete this.option_data[fieldId];
    }
  }

  /**
   * Clear all descendant subfields of a given parentFieldId (recursive).
   */
  private clearExistingSubfields(parentFieldId: number): void {
    const removeSet = new Set<number>();

    const collectDescendants = (pId: number) => {
      // iterate over a copy to avoid mutation issues while collecting
      [...this.parameters_data].forEach(f => {
        if (f.parentFieldId === pId) {
          if (!removeSet.has(f.fieldid)) {
            removeSet.add(f.fieldid);
            collectDescendants(f.fieldid);
          }
        }
      });
    };

    collectDescendants(parentFieldId);

    if (removeSet.size === 0) return;

    // remove from parameters_data
    this.parameters_data = this.parameters_data.filter(f => !removeSet.has(f.fieldid));

    // remove controls & option_data
    removeSet.forEach(fieldId => {
      const controlName = `field_${fieldId}`;
      if (this.orderForm.contains(controlName)) {
        this.orderForm.removeControl(controlName);
      }
      if (this.option_data[fieldId]) {
        delete this.option_data[fieldId];
      }
    });

    // mark for check after structural changes
    this.cd.markForCheck();
  }

  /**
   * Update field's value, valueid and optionsvalue, used after selection processing.
   */
  private updateFieldValues(field: ProductField, selectedOption: any): void {
    if (Array.isArray(selectedOption)) {
      field.value = selectedOption.map(opt => opt.optionname).join(', ');
      field.valueid = selectedOption.map(opt => String(opt.optionid)).join(',');
      field.optionsvalue = selectedOption;
    } else {
      field.value = selectedOption.optionname;
      field.valueid = String(selectedOption.optionid);
      field.optionsvalue = [selectedOption];
    }
    field.optionid = field.valueid;
  }

  /**
   * Called on valueChanges; detects changed field_x controls and triggers handlers.
   */
  onFormChanges(values: any, params: any): void {
    if (!this.previousFormValue) {
      this.previousFormValue = { ...values };
      return;
    }

    for (const key in values) {
      if (!key.startsWith('field_')) continue;

      if (values[key] !== this.previousFormValue[key]) {
        const fieldId = parseInt(key.replace('field_', ''), 10);
        const field = this.parameters_data.find(f => f.fieldid === fieldId);

        if (field && [3, 5, 20].includes(field.fieldtypeid)) {
          // Trigger selection change handler
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

  public get_field_type_name(chosen_field_type_id: any): string {
    const field_types: Record<string, string> = {
      '3': 'list',
      '5': 'materials',
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
      '21': 'materials',
      '25': 'accessories_list',
      '20': 'materials',
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
    return true; // Update based on actual logic
  }

  // Helper function for template
  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }
}
