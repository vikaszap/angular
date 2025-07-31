import { Component, OnInit, OnDestroy, ElementRef, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subject, takeUntil, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
}

interface ProductOption {
  optionid: string;
  optionname: string;
  optionimage: string
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderformComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

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
    this.cd.detectChanges();
  }

  private loadOptionData(params: any): void {
    this.apiService.filterbasedlist(params, '', 5).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (filterData: any) => {
        if (filterData && filterData[0]?.data?.optionarray) {
          const filterresponseData = filterData[0].data;
          const optionRequests: Observable<{ fieldId: number, optionData: any }>[] = [];

          this.parameters_data.forEach((field) => {
            if (filterresponseData.optionarray[field.fieldid] !== undefined && field.fieldtypeid === 3) {
              optionRequests.push(
                this.apiService.getOptionlist(
                  params,
                  0,
                  3,
                  0,
                  field.fieldid,
                  filterresponseData.optionarray[field.fieldid]
                ).pipe(
                  map(optionData => ({ fieldId: field.fieldid, optionData }))
                )
              );
            }
          });

          if (optionRequests.length > 0) {
            forkJoin(optionRequests).pipe(
              takeUntil(this.destroy$)
            ).subscribe({
              next: (responses: { fieldId: number, optionData: any }[]) => {
                responses.forEach(response => {
                  const field = this.parameters_data.find(f => f.fieldid === response.fieldId);
                  if (field && response.optionData && response.optionData[0]?.data?.[0]?.optionsvalue) {
                    this.option_data[field.fieldid] = response.optionData[0].data[0].optionsvalue;

                    if (field.optiondefault !== undefined) {
                      const control = this.orderForm.get(`field_${field.fieldid}`);
                      if (control) {
                        let valueToSet: any;
                        if (field.selection == 1) {
                          valueToSet = field.optiondefault
                            ? field.optiondefault.toString().split(',').filter(val => val !== '').map(Number)
                            : [];
                        } else {
                          valueToSet = field.optiondefault !== undefined && field.optiondefault !== null
                            ? Number(field.optiondefault)
                            : '';
                        }
                        control.setValue(valueToSet, { emitEvent: false });
                      }
                    }
                  }
                });
                this.cd.detectChanges();
              },
              error: (err) => console.error('Error loading options:', err)
            });
          }
        }
      },
      error: (err) => console.error('Error fetching filter data:', err)
    });
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
      '20': 'color',
    };

    return field_types[chosen_field_type_id] || '';
  }

  onFormChanges(values: any): void {
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
              case 34: 
                this.handleUnitTypeChange(values[key]);
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

  handleUnitTypeChange(value: any): void {
    const unitValue = typeof value === 'string' ? parseInt(value, 10) : value;
    this.showFractions = (unitValue === 4);
    console.log('Unit type changed:', value, 'Show fractions:', this.showFractions);
    this.cd.detectChanges();
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