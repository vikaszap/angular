import { Component, OnInit, OnDestroy, ElementRef, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subject, takeUntil, forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
}

interface ProductOption {
  subdatacount: any;
  optionid: string;
  optionname: string;
  optionimage: string;
  fieldoptionlinkid:number;
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
  private routeParams: any;

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
  
  // Data arrays with proper typing
  parameters_data: ProductField[] = [];
  option_data: Record<number, ProductOption[]> = {};

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {
    this.orderForm = this.fb.group({
      unit: ['mm', Validators.required],
      width: ['', [Validators.required, Validators.min(this.min_width), Validators.max(this.max_width)]],
      widthfraction: [''], 
      drop: ['', [Validators.required, Validators.min(this.min_drop), Validators.max(this.max_drop)]],
      dropfraction: [''],
      qty: [1, [Validators.required, Validators.min(1)]],
    });
    this.previousFormValue = this.orderForm.value;
  }

  ngOnInit(): void {
    (window as any).orderFormComponent = this;
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.routeParams = params;
      this.fetchInitialData(params);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchInitialData(params: any): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.apiService.getProductData(params).subscribe({
      next: (data: any) => {
        if (data && data[0]?.data) {
          this.parameters_data = data[0].data;
          this.apiUrl = params.api_url;
          this.initializeFormControls();
          this.loadOptionData(params);
        } else {
          this.errorMessage = 'Invalid product data received';
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching product data:', err);
        this.errorMessage = 'Failed to load product data. Please try again.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  private initializeFormControls(): void {
    const formControls: Record<string, any> = {
      unit: ['mm', Validators.required],
      width: ['', [Validators.required, Validators.min(this.min_width), Validators.max(this.max_width)]],
      widthfraction: [''], 
      drop: ['', [Validators.required, Validators.min(this.min_drop), Validators.max(this.max_drop)]],
      dropfraction: [''],
      qty: [1, [Validators.required, Validators.min(1)]],
    };

    this.parameters_data.forEach(field => {
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
    this.cd.detectChanges();
  }

private loadOptionData(params: any): void {
  const optionRequests: Observable<{ fieldId: number, optionData: any }>[] = [];

  this.parameters_data.forEach((field: ProductField) => {
    if (field.fieldtypeid === 34 || field.fieldtypeid === 17 || field.fieldtypeid === 13) {
      if (Array.isArray(field.optionsvalue)) {
        if (field.optionsvalue.length === 0) {
          this.orderForm.removeControl(`field_${field.fieldid}`);
          return;
        }
        const control = this.orderForm.get(`field_${field.fieldid}`);
        if (control) {
          const valueToSet = field.optiondefault !== undefined && field.optiondefault !== null
            ? Number(field.optiondefault)
            : '';
          control.setValue(valueToSet, { emitEvent: false });
        }
      }
    } else if (field.fieldtypeid === 3 || field.fieldtypeid === 5 || field.fieldtypeid === 20) {
      let matrial: number = 0;
      if (field.fieldtypeid === 5) matrial = 1;
      if (field.fieldtypeid === 20) matrial = 2;

      const optionRequest = this.apiService.filterbasedlist(params, '', String(field.fieldtypeid), String(field.fieldid)).pipe(
        map((filterData: any) => {
          let filter: any = '';
          if (filterData && filterData[0]?.data) {
            if (field.fieldtypeid === 3) {
              filter = filterData[0].data.optionarray?.[field.fieldid] || '';
            } else if (field.fieldtypeid === 5 || field.fieldtypeid === 20) {
              filter = filterData[0].data.coloridsarray || '';
            }
          }
          return { field, matrial, filter };
        }),
        switchMap(({ field, matrial, filter }) =>
          this.apiService.getOptionlist(params, 1, field.fieldtypeid, matrial, field.fieldid, filter).pipe(
            map((optionData: any) => ({ fieldId: field.fieldid, optionData }))
          )
        )
      );
      optionRequests.push(optionRequest);
    }
  });

  if (optionRequests.length > 0) {
    forkJoin(optionRequests).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (responses: any) => {
        responses.forEach((response: any) => {
         response.subscribe({
          next: (res:any)=>{
            const field = this.parameters_data.find((f: ProductField) => f.fieldid === res.fieldId);
            if (!field) return;

            if ([3, 5, 20].includes(field.fieldtypeid)) {
              const options = res.optionData?.[0]?.data?.[0]?.optionsvalue;
              const filteredOptions = Array.isArray(options)
                ? options.filter((option: any) => option.availableForEcommerce === undefined || option.availableForEcommerce === 1)
                : [];

              if (filteredOptions.length === 0) {
                this.orderForm.removeControl(`field_${field.fieldid}`);
                return;
              }

              this.option_data[field.fieldid] = filteredOptions;

              const control = this.orderForm.get(`field_${field.fieldid}`);
              if (control) {
                let valueToSet: any;
                if (field.fieldtypeid === 3) {
                  if (field.selection == 1) {
                    valueToSet = field.optiondefault ? field.optiondefault.toString().split(',').filter((val: string) => val !== '').map(Number) : [];
                  } else {
                    valueToSet = field.optiondefault !== undefined && field.optiondefault !== null && field.optiondefault !== ""
                      ? Number(field.optiondefault)
                      : '';
                  }
                  control.setValue(valueToSet, { emitEvent: false });
                  this.handleOptionSelectionChange(params, field, valueToSet);
                } else if (field.fieldtypeid === 20) {
                  const colorid: string = params.color_id;
                  const coloridval: number = +colorid;
                  control.setValue(coloridval, { emitEvent: false });
                  this.handleOptionSelectionChange(params, field, coloridval);
                } else if (field.fieldtypeid === 5) {
                  const fabric_id: string = params.fabric_id;
                  const fabric_idval: number = +fabric_id;
                  control.setValue(fabric_idval, { emitEvent: false });
                  this.handleOptionSelectionChange(params, field, fabric_idval);
                }
              }
            }
          }
         })
        });

        this.parameters_data = this.parameters_data.filter((field: ProductField) => {
          if (field.fieldtypeid === 34 || field.fieldtypeid === 17 || field.fieldtypeid === 13) {
            return Array.isArray(field.optionsvalue) && field.optionsvalue.length > 0;
          } else if ([3, 5, 20].includes(field.fieldtypeid)) {
            return this.option_data[field.fieldid]?.length > 0;
          }
          return true;
        });

        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading options:', err);
        this.errorMessage = 'Failed to load product options. Please try again.';
        this.cd.detectChanges();
      }
    });
  } else {
    this.parameters_data = this.parameters_data.filter((field: ProductField) => {
      if (field.fieldtypeid === 34 || field.fieldtypeid === 17 || field.fieldtypeid === 13) {
        return Array.isArray(field.optionsvalue) && field.optionsvalue.length > 0;
      }
      return true;
    });
    this.cd.detectChanges();
  }
}
  private handleOptionSelectionChange(params: any, field: ProductField, value: any): void {
  if (!field || Array.isArray(value)) {
    // Skip multi-select or invalid field
    return;
  }

  const options = this.option_data[field.fieldid];
  if (!options) return;

  const selectedOption = options.find(opt => opt.optionid == value);

  if (selectedOption && selectedOption.subdatacount && selectedOption.subdatacount > 0) {
    this.apiService.sublist(
      params,
      2,
      3,
      selectedOption.fieldoptionlinkid,
      selectedOption.optionid,
      field.fieldid
    ).subscribe({
      next: (subFeild: any) => {
        if (subFeild && subFeild[0]?.data) {
          const sublist = subFeild[0].data;
          sublist.forEach((subfield: ProductField) => {
            if (subfield.fieldtypeid === 3) {
              this.parameters_data.push(subfield);
              this.apiService.filterbasedlist(params, '', String(subfield.fieldtypeid), String(subfield.fieldid)).subscribe({
                next: (filterData: any) => {
                  let filter: any = '';
                  if (filterData && filterData[0]?.data) {
                    filter = filterData[0].data.optionarray?.[subfield.fieldid] || '';
                  }
                  this.apiService.getOptionlist(params, 1, subfield.fieldtypeid, 0, subfield.fieldid, filter).subscribe({
                    next: (optionData: any) => {
                      const options = optionData?.[0]?.data?.[0]?.optionsvalue;
                      if (Array.isArray(options)) {
                        this.option_data[subfield.fieldid] = options;
                        const formControl = this.fb.control(
                          subfield.value || '',
                          subfield.mandatory == 1 ? [Validators.required] : []
                        );
                        this.orderForm.addControl(`field_${subfield.fieldid}`, formControl);
                        this.cd.detectChanges();
                      }
                    },
                    error: (err) => {
                      console.error(`Error fetching options for subfield ${subfield.fieldid}:`, err);
                    }
                  });
                },
                error: (err) => {
                  console.error(`Error fetching filter data for subfield ${subfield.fieldid}:`, err);
                }
              });
            }
          });
        }
      },
      error: (err) => {
        console.error('Error fetching sublist:', err);
      }
    });
  }

  if (selectedOption) {
    field.value = selectedOption.optionname;
    field.valueid = selectedOption.optionid;
    field.optionid = selectedOption.optionid;
    field.optionsvalue = [selectedOption];
  } else {
    field.value = '';
    field.valueid = '';
    field.optionid = '';
    field.optionsvalue = [];
  }

  this.cd.detectChanges();
}
  get_field_type_name(chosen_field_type_id: any): string {
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

  onFormChanges(values: any, params: any): void {
    if (!this.previousFormValue) {
      this.previousFormValue = { ...values };
      return;
    }

    for (const key in values) {
      if (values[key] !== this.previousFormValue[key]) {
        if (key.startsWith('field_')) {
          const fieldId = parseInt(key.replace('field_', ''), 10);
          const field = this.parameters_data.find(f => f.fieldid === fieldId);
          if (field) {
            console.log('Field changed:', field.fieldname, 'New value:', values[key]);
            switch (field.fieldtypeid) {
              case 3:
              case 5:
              case 20:
                this.handleOptionSelectionChange(params,field, values[key]);
                break;
              case 34: 
                this.handleUnitTypeChange(values[key], params);
                break;
              default:
                break;
            }
          }
        } else {
          if (key === 'width' || key === 'widthfraction') {
            const widthField = this.parameters_data.find(f => f.fieldtypeid === 11);
            if (widthField) {
              console.log('Field changed:', widthField.fieldname, 'New value:', { 
                width: values.width, 
                fraction: values.widthfraction 
              });
            }
          } else if (key === 'drop' || key === 'dropfraction') {
            const dropField = this.parameters_data.find(f => f.fieldtypeid === 12);
            if (dropField) {
              console.log('Field changed:', dropField.fieldname, 'New value:', { 
                drop: values.drop, 
                fraction: values.dropfraction 
              });
            }
          }
        }
      }
    }

    this.previousFormValue = { ...values };
  }

  handleUnitTypeChange(value: any, params: any): void {
    const unitValue = typeof value === 'string' ? parseInt(value, 10) : value;
    this.showFractions = (unitValue === 4);

    this.apiService.getFractionData(params, unitValue).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (FractionData: any) => {
        if (FractionData?.result?.inchfraction) {
          this.inchfraction_array = FractionData.result.inchfraction.map((item: any) => ({
            name: item.name,
            value: item.decimalvalue
          }));
        } else {
          this.inchfraction_array = [];
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching fraction data:', err);
        this.inchfraction_array = [];
        this.cd.detectChanges();
      }
    });
  }

  freesample(button: any): void {
    try {
      const free_sample_data = JSON.parse(button.getAttribute('data-free_sample_data'));
      this.apiService.addFreeSample(free_sample_data).subscribe({
        next: (response) => {
          console.log('Free sample request successful', response);
        },
        error: (err) => {
          console.error('Error requesting free sample:', err);
        }
      });
    } catch (err) {
      console.error('Error parsing free sample data:', err);
    }
  }

  onSubmit(): void {
    if (this.orderForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.apiService.addToCart(this.orderForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        console.log('Added to cart successfully', response);
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to add to cart. Please try again.';
        console.error('Error adding to cart:', err);
        this.cd.detectChanges();
      }
    });
  }

  // Helper methods
  isBlinds = true;
  objectKeys = Object.keys;

  isSelectedFrame(product_img: any): boolean {
    return product_img?.is_default || false;
  }

  getFrameImageUrl(product_img: any): string {
    return product_img?.image_url || '';
  }

  getFreeSampleData(related_product: any = null): string {
    const sample_data = {
      fabric_id: related_product ? related_product.fd_id : this.fabricid,
      color_id: related_product ? related_product.cd_id : this.colorid,
      price_group_id: related_product ? related_product.groupid : this.pricegroup_id,
      fabricname: related_product ? this.getRelatedProductName(related_product) : this.fabricname,
      fabric_image_url: related_product ? this.getRelatedProductImageUrl(related_product) : this.background_color_image_url
    };
    return JSON.stringify(sample_data);
  }

  getRelatedProductLink(related_product: any): string[] {
    return ['/product', related_product?.slug || ''];
  }

  getRelatedProductImageUrl(related_product: any): string {
    return related_product?.image_url || '';
  }

  getRelatedProductName(related_product: any): string {
    return related_product?.name || '';
  }

  trackByFieldId(index: number, field: ProductField): number {
    return field.fieldid;
  }
}