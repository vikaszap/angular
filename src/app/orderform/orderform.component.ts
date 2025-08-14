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
import { switchMap, mergeMap, map,tap, catchError, takeUntil, finalize, toArray } from 'rxjs/operators';

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
  field_has_sub_option?: boolean;
  optionvalue?: any[];
  subchild?: ProductField[];
  optionquantity?: string;
  fieldlevel?: number;
}

interface ProductOption {
  subdatacount: number;
  optionid: string | number;
  optionname: string;
  optionimage: string;
  optionsvalue: any;
  fieldoptionlinkid: number;
  availableForEcommerce?: number;
  pricegroups: string;
  optionid_pricegroupid:string;
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
  unittype: number = 1;
  pricegroup: string = "";
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    // initial minimal group; will be replaced in initializeFormControls
    this.orderForm = this.fb.group({
        unit: ['', Validators.required],
        width: [
          '',
          [
            Validators.required,
            Validators.min(this.min_width),
            ...(this.max_width > 0 ? [Validators.max(this.max_width)] : [])
          ]
        ],
        widthfraction: [''],
        drop: [
          '',
          [
            Validators.required,
            Validators.min(this.min_drop),
            ...(this.max_drop > 0 ? [Validators.max(this.max_drop)] : [])
          ]
        ],
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
          
          return forkJoin([
            this.loadOptionData(params),
            this.apiService.getminandmax(
              this.routeParams,
              this.routeParams.color_id,
              this.unittype,
              this.routeParams.pricing_group
            )
          ]);
        }
        this.errorMessage = 'Invalid product data received';
        return of(null);
      }),
      tap((results) => {
        if (results) {
          const [_, minmaxdata] = results;
          if (minmaxdata?.data) {
            
            this.min_width = minmaxdata.data.widthminmax.min;
            this.min_drop = minmaxdata.data.dropminmax.min;
            this.max_width = minmaxdata.data.widthminmax.max;
            this.max_drop = minmaxdata.data.dropminmax.max;
          }
        }
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
       width: ['', [
        Validators.required,
        Validators.min(this.min_width),
        ...(this.max_width > 0 ? [Validators.max(this.max_width)] : [])
      ]],
      widthfraction: [''],
       drop: ['', [
        Validators.required,
        Validators.min(this.min_drop),
        ...(this.max_drop > 0 ? [Validators.max(this.max_drop)] : [])
      ]],
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
    //console.log('parameters_data after form initialization:', JSON.parse(JSON.stringify(this.parameters_data)));
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
              if (field.fieldtypeid === 34) {
                 this.unittype = valueToSet;
              }else if(field.fieldtypeid === 13){
                this.pricegroup = valueToSet;
              }
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
      this.clearExistingSubfields(field.fieldid,field.allparentFieldId);
      return;
    }

    this.clearExistingSubfields(field.fieldid,field.allparentFieldId);

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
        if ((field.fieldtypeid === 5 &&  field.level == 1 && selectedOption.optionid_pricegroupid) || (field.fieldtypeid === 20)){
          this.pricegroup = selectedOption.optionid_pricegroupid.split('_')[1];
        }
        if ((field.fieldtypeid === 5 &&  field.level == 2) ||  (field.fieldtypeid === 20)) {
            this.colorid = value;
            this.updateMinMaxValidators();
        }
        this.cd.markForCheck();
      });
    }
  }
    private updateMinMaxValidators(): void {
    this.apiService.getminandmax(this.routeParams, String(this.colorid), this.unittype, Number(this.pricegroup))
      .pipe(takeUntil(this.destroy$))
      .subscribe(minmaxdata => {
        if (minmaxdata?.data) {
          this.min_width = minmaxdata.data.widthminmax.min;
          this.min_drop = minmaxdata.data.dropminmax.min;
          this.max_width = minmaxdata.data.widthminmax.max;
          this.max_drop = minmaxdata.data.dropminmax.max;

          this.orderForm.controls['width'].setValidators([
            Validators.required,
            Validators.min(this.min_width),
            ...(this.max_width > 0 ? [Validators.max(this.max_width)] : [])
          ]);
          this.orderForm.controls['width'].updateValueAndValidity();

          this.orderForm.controls['drop'].setValidators([
            Validators.required,
            Validators.min(this.min_drop),
            ...(this.max_drop > 0 ? [Validators.max(this.max_drop)] : [])
          ]);
          this.orderForm.controls['drop'].updateValueAndValidity();
        }
      });
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
          [3, 5, 20, 21,18,6].includes(subfield.fieldtypeid)
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
private processSubfield(
  params: any,
  subfield: ProductField,
  parentField: ProductField,
  level: number
): Observable<any> {
  subfield.parentFieldId = parentField.fieldid;
  subfield.level = level;
  subfield.masterparentfieldid = parentField.masterparentfieldid || parentField.fieldid;
  subfield.allparentFieldId = parentField.allparentFieldId
    ? `${parentField.allparentFieldId},${subfield.fieldid}`
    : `${parentField.fieldid},${subfield.fieldid}`;

  // --- parameters_data (flat list) ---
  const alreadyExistsFlat = this.parameters_data.some(f => f.fieldid === subfield.fieldid && f.allparentFieldId === subfield.allparentFieldId);
  if (!alreadyExistsFlat) {
    const parentIndex = this.parameters_data.findIndex(f => f.fieldid === parentField.fieldid);
    if (parentIndex !== -1) {
      this.parameters_data.splice(parentIndex + 1, 0, { ...subfield });
    } else {
      this.parameters_data.push({ ...subfield });
    }
    //console.log('Added subfield to parameters_data:', subfield.fieldid);
  } else {
    const existingFlat = this.parameters_data.find(f => f.fieldid === subfield.fieldid && f.allparentFieldId === subfield.allparentFieldId);
    if (existingFlat) {
      existingFlat.parentFieldId = subfield.parentFieldId;
      existingFlat.level = subfield.level;
      existingFlat.masterparentfieldid = subfield.masterparentfieldid;
      existingFlat.allparentFieldId = subfield.allparentFieldId;
    }
  }

  // --- parentField.subchild (nested list) ---
  if (!parentField.subchild) {
    parentField.subchild = [];
  }

  const alreadyExistsNested = parentField.subchild.some(
    f => f.fieldid === subfield.fieldid && f.allparentFieldId === subfield.allparentFieldId
  );

  if (!alreadyExistsNested) {
    parentField.subchild.push({ ...subfield });
    /*
    console.log(
      'Added subfield:',
      subfield.fieldid,
      'to parent:',
      parentField.fieldid,
      '. Current state:',
      JSON.parse(JSON.stringify(this.parameters_data))
    );
    */
  } else {
    const existingNested = parentField.subchild.find(
      f => f.fieldid === subfield.fieldid && f.allparentFieldId === subfield.allparentFieldId
    );
    if (existingNested) {
      existingNested.parentFieldId = subfield.parentFieldId;
      existingNested.level = subfield.level;
      existingNested.masterparentfieldid = subfield.masterparentfieldid;
      existingNested.allparentFieldId = subfield.allparentFieldId;
    }
  }

  // --- Form control ---
  this.addSubfieldFormControlSafe(subfield);

  if (subfield.field_has_sub_option) {
    return this.loadSubfieldOptions(params, subfield).pipe(
      map(res => res || null),
      catchError(err => {
          console.error('Error in processSubfield:', err);
          this.removeFieldSafely(subfield.fieldid, subfield.allparentFieldId);
          return of(null);
        })
    );
  } else {
    return of(null);
  }
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
private removeFieldSafely(fieldId: number, fieldPath?: string): void {
  if (!fieldPath) {
    const field = this.parameters_data.find(f => f.fieldid === fieldId);
    if (!field) return;
    fieldPath = field.allparentFieldId || fieldId.toString();
  }

  this.parameters_data = this.parameters_data.filter(
    f => !(f.fieldid === fieldId && f.allparentFieldId === fieldPath)
  );

  const controlName = `field_${fieldId}`;
  if (this.orderForm.contains(controlName)) {
    this.orderForm.removeControl(controlName);
  }

  if (this.option_data[fieldId]) {
    delete this.option_data[fieldId];
  }

  this.cd.markForCheck();
}

private clearExistingSubfields(parentFieldId: number, parentPath?: string): void {
  // 1. Determine the parent path
  if (!parentPath) {
    const parent = this.parameters_data.find(f => f.fieldid === parentFieldId);
    if (!parent) return;
    parentPath = parent.allparentFieldId || parent.fieldid.toString();
  }

  // 2. Special handling for main field (has no parentFieldId)
  const isMainField = !this.parameters_data.some(f => 
    f.fieldid === parentFieldId && f.parentFieldId
  );

  // 3. Find fields to remove - different matching for main vs nested fields
  const fieldsToRemove = this.parameters_data.filter(f => {
    if (!f.allparentFieldId) return false;
    
    if (isMainField) {
      // For main field, match either:
      // - Direct children: allparentFieldId === "mainId"
      // - Descendants: allparentFieldId.startsWith("mainId,")
      return f.allparentFieldId === parentPath || 
             f.allparentFieldId.startsWith(`${parentPath},`);
    } else {
      // For nested fields, only match proper descendants
      return f.allparentFieldId.startsWith(`${parentPath},`);
    }
  });

  if (fieldsToRemove.length === 0) return;

  // 4. Remove from flat list
  this.parameters_data = this.parameters_data.filter(f => 
    !fieldsToRemove.some(toRemove => 
      toRemove.fieldid === f.fieldid && 
      toRemove.allparentFieldId === f.allparentFieldId
    )
  );

  // 5. Clean nested structure
  this.cleanNestedStructure(parentFieldId, fieldsToRemove, isMainField);

  // 6. Remove form controls and clean up
  fieldsToRemove.forEach(field => {
    const controlName = `field_${field.fieldid}`;
    if (this.orderForm.contains(controlName)) {
      this.orderForm.removeControl(controlName);
    }
    delete this.option_data[field.fieldid];
  });

  this.cd.markForCheck();
}

private cleanNestedStructure(parentFieldId: number, fieldsToRemove: ProductField[], isMainField: boolean) {
  const fieldsToRemoveSet = new Set(fieldsToRemove.map(f => f.fieldid));

  // Handle main field specially
  if (isMainField) {
    const mainField = this.parameters_data.find(f => f.fieldid === parentFieldId);
    if (mainField?.subchild) {
      mainField.subchild = mainField.subchild.filter(child => 
        !fieldsToRemoveSet.has(child.fieldid)
      );
    }
    return;
  }

  // Recursive cleaner for nested fields
  const cleanSubchild = (field: ProductField) => {
    if (!field.subchild) return;
    
    field.subchild = field.subchild.filter(child => 
      !fieldsToRemoveSet.has(child.fieldid)
    );
    
    field.subchild.forEach(cleanSubchild);
  };

  this.parameters_data.forEach(cleanSubchild);
}

  /**
   * Update field's value, valueid and optionsvalue, used after selection processing.
   */

  private updateFieldValues(field: ProductField, selectedOption: any =[]): void {
    const fieldInState = this.parameters_data.find(f => 
        f.fieldid === field.fieldid && f.allparentFieldId === field.allparentFieldId
    );
  
    const targetField = fieldInState || field; 

    if (Array.isArray(selectedOption)) {
      targetField.value = selectedOption.map(opt => opt.optionname).join(', ');
      targetField.valueid = selectedOption.map(opt => String(opt.optionid)).join(',');
      targetField.optionvalue = selectedOption;
      targetField.optionquantity = targetField.optionquantity = selectedOption.map(() => '1').join(',');
    } else {
      if(selectedOption.optionname){
          targetField.value = selectedOption.optionname;
          targetField.valueid = String(selectedOption.optionid);
          targetField.optionvalue = [selectedOption];
          targetField.optionquantity = "1";
      }else{
        targetField.value = selectedOption;
        targetField.valueid = "";
        targetField.optionvalue = [];
      }
    }
    
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
          this.handleRestOptionChange(params, field, values[key]);
        }else if(field  && [14, 18, 6].includes(field.fieldtypeid)){
           this.handleRestChange(params, field, values[key]);
        }else if(field  && [ 7,11,31].includes(field.fieldtypeid)){
           this.handleWidthChange(params, field, values[key]);
        }if(field  && [9,12,32].includes(field.fieldtypeid)){
           this.handleDropChange(params, field, values[key]);
        }else if(field) {
         this.handleRestOptionChange(params, field, values[key]);
        }
      }
     //console.log('parameters_data after form updated:', JSON.parse(JSON.stringify(this.parameters_data)));
    }
    this.previousFormValue = { ...values };
  }
  private handleWidthChange(params: any, field: ProductField, value: any): void {
    let fractionValue = 0;

    if (this.showFractions) {
      fractionValue = Number(this.orderForm.get('widthfraction')?.value) || 0;
    }

    const totalWidth = Number(value) + fractionValue;
    this.updateFieldValues(field, totalWidth);
  }
  private handleDropChange(params: any, field: ProductField, value: any): void {
    let fractionValue = 0;
    
    if (this.showFractions) {
      fractionValue = Number(this.orderForm.get('dropfraction')?.value) || 0;
    }

    const totalDrop = Number(value) + fractionValue;
    this.updateFieldValues(field, totalDrop);
  }
  
  private handleRestOptionChange(params: any, field: ProductField, value: any): void {
    if (value === null || value === undefined || value === '') {
      return;
    }

    const options = field.optionsvalue;
    if (!options || options.length === 0) return;

    const selectedOption = options.find(opt => `${opt.optionid}` === `${value}`);
     
    if (!selectedOption) return;

    this.updateFieldValues(field, [selectedOption]);
  }
  private handleRestChange(params: any, field: ProductField, value: any): void {
      this.updateFieldValues(field, value);
  }
  handleUnitTypeChange(value: any, params: any): void {
    const unitValue = typeof value === 'string' ? parseInt(value, 10) : value;
    this.unittype =  unitValue;
    console.log(this.unittype);
    this.showFractions = (unitValue === 4);
    this.updateMinMaxValidators();
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
