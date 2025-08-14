import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subject, forkJoin, Observable, of, from, Subscription } from 'rxjs';
import { switchMap, mergeMap, map,tap, catchError, takeUntil, finalize, toArray } from 'rxjs/operators';

export const FieldType = {
  LIST: 3,
  MATERIALS: 5,
  NUMBER: 6,
  X_FOOTAGE: 7,
  NUMBER_8: 8,
  Y_FOOTAGE: 9,
  HEIGHT: 10,
  WIDTH_WITH_FRACTION: 11,
  DROP_WITH_FRACTION: 12,
  PRICE_GROUP: 13,
  QTY: 14,
  SUPPLIER: 17,
  TEXT: 18,
  MATERIALS_20: 20,
  MATERIALS_21: 21,
  ACCESSORIES_LIST: 25,
  X_SQUARE_YARD: 31,
  Y_SQUARE_YARD: 32,
  UNIT_TYPE: 34,
} as const;

// Interfaces (kept as you had them)
interface ProductField {
  fieldid: number;
  fieldname: string;
  labelnamecode: string;
  fieldtypeid: (typeof FieldType)[keyof typeof FieldType];
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
  private fieldSubscriptions: { [key: string]: Subscription } = {};
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
    Object.values(this.fieldSubscriptions).forEach(sub => sub.unsubscribe());
  }
  
  private fetchInitialData(params: any): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.apiService.getProductData(params).pipe(
      takeUntil(this.destroy$),
      switchMap((data: any) => this.handleInitialDataResponse(data, params)),
      tap((results) => this.handleMinMaxResponse(results)),
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

  private handleInitialDataResponse(data: any, params: any): Observable<any> {
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
  }

  private handleMinMaxResponse(results: any): void {
    if (!results) return;

    const [_, minmaxdata] = results;
    if (minmaxdata?.data) {
      this.min_width = minmaxdata.data.widthminmax.min;
      this.min_drop = minmaxdata.data.dropminmax.min;
      this.max_width = minmaxdata.data.widthminmax.max;
      this.max_drop = minmaxdata.data.dropminmax.max;
    }
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
    //console.log('parameters_data after form initialization:', JSON.parse(JSON.stringify(this.parameters_data)));

    // Setup individual listeners for each control
    this.parameters_data.forEach(field => {
      if (field.showfieldecomonjob == 1) {
        this.setupValueChangeListener(field);
      }
    });
  }

  /**
   * Load top-level option data for fields that require it (3,5,20 etc.)
   */
  private loadOptionData(params: any): Observable<any> {
    return this.apiService.filterbasedlist(params, '').pipe(
      takeUntil(this.destroy$),
      switchMap((filterData: any) => {
        if (!filterData?.[0]?.data?.optionarray) return of([]);

        const filterresponseData = filterData[0].data;
        const optionRequests: Observable<any>[] = [];

        this.parameters_data.forEach((field: ProductField) => {
          if (([FieldType.LIST, FieldType.MATERIALS, FieldType.MATERIALS_20] as number[]).includes(field.fieldtypeid)) {
            optionRequests.push(this.createOptionRequest(field, params, filterresponseData));
          } else if (([FieldType.QTY, FieldType.UNIT_TYPE, FieldType.SUPPLIER, FieldType.PRICE_GROUP] as number[]).includes(field.fieldtypeid)) {
            this.setDefaultValueForSimpleField(field);
          }
        });

        return optionRequests.length > 0
          ? forkJoin(optionRequests).pipe(map(responses => responses.filter(r => r !== null)))
          : of([]);
      }),
      map((responses: any[]) => this.processOptionResponses(responses, params)),
      catchError(err => {
        console.error('Error in option data loading:', err);
        return of(null);
      })
    );
  }

  private setDefaultValueForSimpleField(field: ProductField): void {
    const control = this.orderForm.get(`field_${field.fieldid}`);
    if (!control) return;

    let valueToSet: any = '';
    if (field.fieldtypeid === FieldType.QTY) {
      valueToSet = 1;
    } else if (field.fieldtypeid === FieldType.SUPPLIER) {
      this.supplier_id = (field.optiondefault !== undefined && field.optiondefault !== null && field.optiondefault !== '')
        ? Number(field.optiondefault)
        : (Array.isArray(field.optionsvalue) && field.optionsvalue.length > 0 ? Number(field.optionsvalue[0].id || field.optionsvalue[0].optionid || 0) : null);
      valueToSet = this.supplier_id ?? '';
    } else { // This covers UNIT_TYPE and PRICE_GROUP
      valueToSet = (field.optiondefault !== undefined && field.optiondefault !== null && field.optiondefault !== '')
        ? Number(field.optiondefault)
        : '';
    }

    control.setValue(valueToSet, { emitEvent: false });
    if (field.fieldtypeid === FieldType.UNIT_TYPE) {
      this.unittype = valueToSet;
    } else if (field.fieldtypeid === FieldType.PRICE_GROUP) {
      this.pricegroup = valueToSet;
    }
  }

  private createOptionRequest(field: ProductField, params: any, filterresponseData: any): Observable<any> {
    let matrial = 0;
    let filter = '';

    if (field.fieldtypeid === FieldType.LIST) {
      matrial = 0;
      filter = filterresponseData.optionarray[field.fieldid];
    } else if (field.fieldtypeid === FieldType.MATERIALS) {
      matrial = 1;
      filter = filterresponseData.coloridsarray;
    } else if (field.fieldtypeid === FieldType.MATERIALS_20) {
      matrial = 2;
      filter = filterresponseData.coloridsarray;
    }

    return this.apiService.getOptionlist(
      params, 1, field.fieldtypeid, matrial, field.fieldid, filter
    ).pipe(
      map((optionData: any) => ({ fieldId: field.fieldid, optionData })),
      catchError(err => {
        console.error(`Error loading options for field ${field.fieldid}:`, err);
        return of(null); // Return null to not break forkJoin
      })
    );
  }

  private processOptionResponses(responses: any[], params: any): boolean {
    responses.forEach((response: { fieldId: number, optionData: any }) => {
      const field = this.parameters_data.find(f => f.fieldid === response.fieldId);
      if (!field) return;

      const options = response.optionData?.[0]?.data?.[0]?.optionsvalue;
      const filteredOptions = Array.isArray(options)
        ? options.filter((option: any) => option.availableForEcommerce !== 0)
        : [];

      if (filteredOptions.length === 0) {
        if (this.orderForm.contains(`field_${field.fieldid}`)) {
          this.orderForm.removeControl(`field_${field.fieldid}`);
        }
        return;
      }

      this.option_data[field.fieldid] = filteredOptions;
      this.setControlValueForComplexField(field, params);
    });

    this.parameters_data = this.parameters_data.filter((field: ProductField) => {
      if (([FieldType.UNIT_TYPE, FieldType.SUPPLIER, FieldType.PRICE_GROUP] as number[]).includes(field.fieldtypeid)) {
        return Array.isArray(field.optionsvalue) && field.optionsvalue.length > 0;
      } else if (([FieldType.LIST, FieldType.MATERIALS, FieldType.MATERIALS_20] as number[]).includes(field.fieldtypeid)) {
        return this.option_data[field.fieldid]?.length > 0;
      }
      return true;
    });

    return true;
  }

  private setControlValueForComplexField(field: ProductField, params: any): void {
    const control = this.orderForm.get(`field_${field.fieldid}`);
    if (!control) return;

    let valueToSet: any;
    if (field.fieldtypeid === FieldType.LIST && field.selection == 1) {
      valueToSet = field.optiondefault
        ? field.optiondefault.toString().split(',').filter((val: string) => val !== '').map(Number)
        : [];
    } else if (field.fieldtypeid === FieldType.MATERIALS_20) {
      valueToSet = +params.color_id || '';
    } else if (field.fieldtypeid === FieldType.MATERIALS) {
      valueToSet = +params.fabric_id || '';
    } else {
      valueToSet = (field.optiondefault !== undefined && field.optiondefault !== null && field.optiondefault !== '')
        ? Number(field.optiondefault)
        : '';
    }
    control.setValue(valueToSet, { emitEvent: false });
  }

  /**
   * Called whenever a field's option selection changes (top-level or subfield).
   * Responsible for clearing existing subfields and re-loading as necessary.
   */
  private handleOptionSelectionChange(params: any, field: ProductField, value: any): void {
    if (!field) return;

    // This is now much simpler.
    this.clearExistingSubfields(field.fieldid);

    if (value === null || value === undefined || value === '') {
      return;
    }

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
        if ((field.fieldtypeid === FieldType.MATERIALS &&  field.level == 1 && selectedOption.optionid_pricegroupid) || (field.fieldtypeid === FieldType.MATERIALS_20)){
          this.pricegroup = selectedOption.optionid_pricegroupid.split('_')[1];
        }
        if ((field.fieldtypeid === FieldType.MATERIALS &&  field.level == 2) ||  (field.fieldtypeid === FieldType.MATERIALS_20)) {
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
          ([FieldType.LIST, FieldType.MATERIALS, FieldType.MATERIALS_20, FieldType.MATERIALS_21,FieldType.TEXT,FieldType.NUMBER] as number[]).includes(subfield.fieldtypeid)
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
private setupValueChangeListener(field: ProductField): void {
    const controlName = `field_${field.fieldid}`;
    const control = this.orderForm.get(controlName);
    if (!control) return;

    if (this.fieldSubscriptions[controlName]) {
      this.fieldSubscriptions[controlName].unsubscribe();
    }

    this.fieldSubscriptions[controlName] = control.valueChanges.subscribe(value => {
      const params = this.routeParams;

      if (([FieldType.LIST, FieldType.MATERIALS, FieldType.MATERIALS_20] as number[]).includes(field.fieldtypeid)) {
        // This handler is complex (clears children, fetches sub-options) and remains separate.
        this.handleOptionSelectionChange(params, field, value);
      } else if (field.fieldtypeid === FieldType.UNIT_TYPE) {
        // This has a side-effect (fetching fraction data) and also updates the field value.
        this.handleUnitTypeChange(value, params);
        const selectedOption = field.optionsvalue?.find(opt => `${opt.optionid}` === `${value}`);
        if(selectedOption) this.updateFieldValues(field, selectedOption);
      } else if (([FieldType.X_FOOTAGE, FieldType.WIDTH_WITH_FRACTION, FieldType.X_SQUARE_YARD] as number[]).includes(field.fieldtypeid)) {
        const fractionValue = this.showFractions ? (Number(this.orderForm.get('widthfraction')?.value) || 0) : 0;
        this.updateFieldValues(field, Number(value) + fractionValue);
      } else if (([FieldType.Y_FOOTAGE, FieldType.DROP_WITH_FRACTION, FieldType.Y_SQUARE_YARD] as number[]).includes(field.fieldtypeid)) {
        const fractionValue = this.showFractions ? (Number(this.orderForm.get('dropfraction')?.value) || 0) : 0;
        this.updateFieldValues(field, Number(value) + fractionValue);
      } else if (field.optionsvalue && field.optionsvalue.length > 0) {
        // For any other field that has an options list (e.g., supplier, pricegroup)
        const selectedOption = field.optionsvalue.find(opt => `${opt.optionid}` === `${value}`);
        if(selectedOption) this.updateFieldValues(field, selectedOption);
      } else {
        // For simple fields without options (e.g., text, number, qty)
        this.updateFieldValues(field, value);
      }
    });
  }
private processSubfield(
  params: any,
  subfield: ProductField,
  parentField: ProductField,
  level: number
): Observable<any> {
  // SIMPLIFIED LOGIC: No longer interacts with the flat parameters_data array.
  // It only works with the nested subchild property.
  subfield.parentFieldId = parentField.fieldid;
  subfield.level = level;
  subfield.masterparentfieldid = parentField.masterparentfieldid || parentField.fieldid;
  // The 'allparentFieldId' property is no longer needed.

  if (!parentField.subchild) {
    parentField.subchild = [];
  }

  // Add the new subfield to its parent's subchild array.
  // We don't check for existence because clearExistingSubfields now wipes the array.
  parentField.subchild.push({ ...subfield });

  // Add the form control and set up its listener.
  this.addSubfieldFormControlSafe(subfield);
  this.setupValueChangeListener(subfield);

  // Load options if necessary.
  if (subfield.field_has_sub_option) {
    return this.loadSubfieldOptions(params, subfield).pipe(
      map(res => res || null),
      catchError(err => {
        console.error('Error in processSubfield:', err);
        // Simplified error handling: just remove the control.
        // The field itself will be removed the next time clearExistingSubfields is called.
        this.recursivelyRemoveControls([{...subfield}]);
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

        if (([FieldType.LIST, FieldType.MATERIALS, FieldType.MATERIALS_20] as number[]).includes(subfield.fieldtypeid)) {
          let matrial = 0;
          let filter = '';

          if (subfield.fieldtypeid === FieldType.LIST) {
            matrial = 0;
            filter = filterresponseData.optionarray[subfield.fieldid];
          } else if (subfield.fieldtypeid === FieldType.MATERIALS) {
            matrial = 2;
            filter = filterresponseData.coloridsarray;
          } else if (subfield.fieldtypeid === FieldType.MATERIALS_20) {
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
                this.recursivelyRemoveControls([{...subfield}]);
                return null;
              }

              this.option_data[subfield.fieldid] = filteredOptions;

              // set default value safely (without emitting)
              const control = this.orderForm.get(`field_${subfield.fieldid}`);
              if (control) {
                let valueToSet: any;
                if (subfield.fieldtypeid === FieldType.LIST && subfield.selection == 1) {
                  valueToSet = subfield.optiondefault
                    ? subfield.optiondefault.toString().split(',').filter((val: string) => val !== '').map(Number)
                    : [];
                } else if (subfield.fieldtypeid === FieldType.MATERIALS && subfield.level == 2) {
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
              this.recursivelyRemoveControls([{...subfield}]);
              return of(null);
            })
          );
        }

        // if not a handled fieldtype, just return null
        return of(null);
      }),
      catchError(err => {
        console.error('Error fetching subfield filter data:', err);
        this.recursivelyRemoveControls([{...subfield}]);
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
private clearExistingSubfields(parentFieldId: number): void {
    const parentField = this.findFieldByIdRecursive(this.parameters_data, parentFieldId);
    if (!parentField || !parentField.subchild) {
        return;
    }

    // Recursively clean up all descendants before clearing the array
    this.recursivelyRemoveControls(parentField.subchild);

    // Now, simply clear the children array
    parentField.subchild = [];
    
    this.cd.markForCheck();
}

private recursivelyRemoveControls(fields: ProductField[]): void {
    if (!fields) return;

    for (const field of fields) {
        // 1. Recurse to children first
        if (field.subchild && field.subchild.length > 0) {
            this.recursivelyRemoveControls(field.subchild);
        }

        // 2. Clean up the current field's dependencies
        const controlName = `field_${field.fieldid}`;
        if (this.orderForm.contains(controlName)) {
            this.orderForm.removeControl(controlName);
        }
        if (this.fieldSubscriptions[controlName]) {
            this.fieldSubscriptions[controlName].unsubscribe();
            delete this.fieldSubscriptions[controlName];
        }
        if (this.option_data[field.fieldid]) {
            delete this.option_data[field.fieldid];
        }
    }
}

private findFieldByIdRecursive(fields: ProductField[], fieldId: number): ProductField | null {
    for (const field of fields) {
        if (field.fieldid === fieldId) {
            return field;
        }
        if (field.subchild) {
            const found = this.findFieldByIdRecursive(field.subchild, fieldId);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

  /**
   * Update field's value, valueid and optionsvalue, used after selection processing.
   */

  private updateFieldValues(field: ProductField, selectedOption: any = []): void {
    // The `field` object passed to this function is the direct reference
    // to the field in the nested parameters_data structure, so we can mutate it directly.
    const targetField = field;

    if (Array.isArray(selectedOption)) {
      // Handle an array of selected option objects (for multi-select)
      targetField.value = selectedOption.map(opt => opt.optionname).join(', ');
      targetField.valueid = selectedOption.map(opt => String(opt.optionid)).join(',');
      targetField.optionvalue = selectedOption;
      targetField.optionquantity = selectedOption.map(() => '1').join(',');
    } else if (selectedOption && typeof selectedOption === 'object' && selectedOption.optionname) {
      // Handle a single selected option object
      targetField.value = selectedOption.optionname;
      targetField.valueid = String(selectedOption.optionid);
      targetField.optionvalue = [selectedOption];
      targetField.optionquantity = "1";
    } else {
      // Handle a primitive value (e.g., from a text input, number input)
      targetField.value = String(selectedOption);
      targetField.valueid = ""; // Primitives don't have a separate valueid
      targetField.optionvalue = []; // No option object associated
    }
  }

  /**
   * Called on valueChanges; detects changed field_x controls and triggers handlers.
   */
  handleUnitTypeChange(value: any, params: any): void {
    const unitValue = typeof value === 'string' ? parseInt(value, 10) : value;
    this.unittype =  unitValue;
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
      [FieldType.LIST]: 'list',
      [FieldType.MATERIALS]: 'materials',
      [FieldType.NUMBER]: 'number',
      [FieldType.X_FOOTAGE]: 'x_footage',
      [FieldType.NUMBER_8]: 'number',
      [FieldType.Y_FOOTAGE]: 'y_footage',
      [FieldType.HEIGHT]: 'height',
      [FieldType.WIDTH_WITH_FRACTION]: 'width_with_fraction',
      [FieldType.DROP_WITH_FRACTION]: 'drop_with_fraction',
      [FieldType.PRICE_GROUP]: 'pricegroup',
      [FieldType.QTY]: 'qty',
      [FieldType.SUPPLIER]: 'supplier',
      [FieldType.TEXT]: 'text',
      [FieldType.X_SQUARE_YARD]: 'x_square_yard',
      [FieldType.Y_SQUARE_YARD]: 'y_square_yard',
      [FieldType.UNIT_TYPE]: 'unit_type',
      [FieldType.MATERIALS_21]: 'materials',
      [FieldType.ACCESSORIES_LIST]: 'accessories_list',
      [FieldType.MATERIALS_20]: 'materials',
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
