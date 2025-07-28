import { Component, OnInit, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SafeHtmlPipe } from '../safe-html.pipe';

@Component({
  selector: 'app-orderform',
  templateUrl: './orderform.component.html',
  styleUrls: ['./orderform.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    SafeHtmlPipe,
    RouterModule,
  ],
})
export class OrderformComponent implements OnInit, AfterViewChecked {
  private listenersAdded = false;
  product_details_arr: any = {};
  product_specs: any = '';
  product_description: any = '';
  background_color_image_url: any = '';
  unit_type_data: any[] = [];
  parameters_arr: any[] = [];
  inchfraction_array: any[] = [];
  color_arr: any = {};
  product_minimum_price: any = 0;
  min_width: any = 0;
  max_width: any = 0;
  min_drop: any = 0;
  max_drop: any = 0;
  ecomsampleprice: any = 0;
  ecomFreeSample: any = '0';
  delivery_duration: any = '';
  visualizertagline: any = '';
  productname: any = '';
  product_list_page_link: any = '';
  fabricname: any = '';
  hide_frame: boolean = false;
  mainframe: any = '';
  product_img_array: any[] = [];
  product_deafultimage: any = {};
  fabric_linked_color_data: any = {};
  related_products_list_data: any[] = [];
  productlisting_frame_url: any = '';
  sample_img_frame_url: any = '';
  v4_product_visualizer_page: any = '';
  fieldscategoryname: any = '';
  productslug: any = '';
  fabricid: any = 0;
  colorid: any = 0;
  matmapid: any = 0;
  pricegroup_id: any = 0;
  supplier_id: any = 0;
  orderForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.orderForm = this.fb.group({
      unit: ['mm'],
      width: [''],
      widthfraction: [''],
      drop: [''],
      dropfraction: [''],
      qty: [1],
      // Add other form controls here
    });
  }

  parameters_data: any[] = [];
  option_data: any[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.fetchInitialData(params);
    
    });
  }
fetchInitialData(params: any): void {
  this.apiService.getProductData(params).subscribe((data: any) => {
    if (data) {
      const responseData = data[0].data;
      this.parameters_data = responseData;
      console.log(responseData);
      this.apiService.filterbasedlist(params, "", 5).subscribe((filterData: any) => {
 
        const filterresponseData = filterData[0].data;
         
      
        this.parameters_data.forEach((field) => {
        if( filterresponseData.optionarray[field.fieldid] != undefined){
            if (field.fieldtypeid == 3) {
              this.apiService.getOptionlist(
                params,
                0,
                3,
                0,
                field.fieldid,
                filterresponseData.optionarray[field.fieldid]
              ).subscribe((optionData: any) => {
                const optionresponseData = optionData[0].data[0].optionsvalue;
                this.option_data[field.fieldid] = optionresponseData;
              });
            }
          }
        });
       
      });
    }
  });
}


get_field_type_name(chosen_field_type_id: any): string {
  const field_types: { [key: string]: string } = {
    '3': 'list',
    '5': 'fabric_and_color',
    '6': 'number',
    '7': 'x_footage',
    '8': 'number',  // width (simple number)
    '9': 'y_footage',
    '10': 'height',
    '11': 'width_with_fraction',  // special width with fraction
    '12': 'drop_with_fraction',   // special drop with fraction
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


get_blindmatrix_v4_parameters_HTML(
  field_type_id: any,
  field_args: any,
  option_data: any = [],
): any {
  const field_type_name = this.get_field_type_name(field_type_id);
  if (!field_type_name) {
    return '';
  }

  switch (field_type_name) {
    case 'unit_type':
      return this.blindmatrix_render_list_field(field_args, option_data);
    case 'list':
      return this.blindmatrix_render_list_field(field_args, option_data);
    case 'number':
      return this.blindmatrix_render_number_field(field_args);
    case 'width_with_fraction':
      return this.blindmatrix_render_width_with_fraction_field(field_args);
    case 'drop_with_fraction':
      return this.blindmatrix_render_drop_with_fraction_field(field_args);
    case 'hidden':
      return this.blindmatrix_render_hidden_field(field_args);
    default:
      return '';
  }
}

// Add new methods for width and drop with fraction
blindmatrix_render_width_with_fraction_field(field_args: any): any {
  let field_html = '';
  if (field_args.showfieldonjob == '1') {
    field_html += `<div class="d-flex blindmatrix-v4-parameter-wrapper blindmatrix-v4-parameter-wrapper-width">`;
    field_html += `<label class="blindmatrix-v4-parameter-label">${field_args.fieldname}</label>`;
    field_html += `<div class="d-flex align-items-center">`;
    field_html += `<input type="number" class="blindmatrix-v4-parameter-input" formControlName="width" id="width" min="${this.min_width}" max="${this.max_width}">`;
    field_html += `<select class="blindmatrix-v4-parameter-fraction" formControlName="widthfraction" id="widthfraction">`;
    this.inchfraction_array.forEach((fraction) => {
      field_html += `<option value="${fraction.value}">${fraction.name}</option>`;
    });
    field_html += `</select>`;
    field_html += `</div>`;
    field_html += `</div>`;
  }
  return field_html;
}

blindmatrix_render_drop_with_fraction_field(field_args: any): any {
  let field_html = '';
  if (field_args.showfieldonjob == '1') {
    field_html += `<div class="d-flex blindmatrix-v4-parameter-wrapper blindmatrix-v4-parameter-wrapper-drop">`;
    field_html += `<label class="blindmatrix-v4-parameter-label">${field_args.fieldname}</label>`;
    field_html += `<div class="d-flex align-items-center">`;
    field_html += `<input type="number" class="blindmatrix-v4-parameter-input" formControlName="drop" id="drop" min="${this.min_drop}" max="${this.max_drop}">`;
    field_html += `<select class="blindmatrix-v4-parameter-fraction" formControlName="dropfraction" id="dropfraction">`;
    this.inchfraction_array.forEach((fraction) => {
      field_html += `<option value="${fraction.value}">${fraction.name}</option>`;
    });
    field_html += `</select>`;
    field_html += `</div>`;
    field_html += `</div>`;
  }
  return field_html;
}

// Fix the template literals in existing methods
blindmatrix_render_list_field(field_args: any, option_data: any): any {
  let field_html = '';
  if (field_args.showfieldonjob == '1') {
    field_html += `<div class="d-flex blindmatrix-v4-parameter-wrapper blindmatrix-v4-parameter-wrapper-list">`;
    field_html += `<label class="blindmatrix-v4-parameter-label">${field_args.fieldname}</label>`;
    field_html += `<select class="blindmatrix-v4-parameter-input" formControlName="${field_args.labelnamecode}" id="${field_args.labelnamecode}" data-field-args='${JSON.stringify(field_args)}'>`;
    field_html += `<option value="">Select Option</option>`;
    option_data.forEach((option: any) => {
      field_html += `<option value="${option.optionid}">${option.optionname}</option>`;
    });
    field_html += `</select>`;
    field_html += `</div>`;
  }
  return field_html;
}

blindmatrix_render_number_field(field_args: any): any {
  let field_html = '';
  if (field_args.showfieldonjob == '1') {
    field_html += `<div class="d-flex blindmatrix-v4-parameter-wrapper blindmatrix-v4-parameter-wrapper-number">`;
    field_html += `<label class="blindmatrix-v4-parameter-label">${field_args.fieldname}</label>`;
    field_html += `<input type="number" class="blindmatrix-v4-parameter-input" formControlName="${field_args.labelnamecode}" id="${field_args.labelnamecode}" value="${field_args.value || ''}">`;
    field_html += `</div>`;
  }
  return field_html;
}

blindmatrix_render_hidden_field(field_args: any): any {
  return `<input type="hidden" formControlName="${field_args.labelnamecode}" id="${field_args.labelnamecode}" value="${field_args.value || ''}">`;
}

onFieldChange(event: any, field_args: any): void {
  console.log('cvcx');
  const selectedValue = event.target.value;
  switch (field_args.fieldtypeid) {
    case 34:
      this.handleUnitTypeChange(selectedValue);
      break;
    // Add other cases here
    default:
      break;
  }
}

handleUnitTypeChange(value: any): void {
  console.log('Unit type changed to:', value);
  // You can add more logic here to handle the change
}

  freesample(button: any): void {
    const free_sample_data = JSON.parse(
      button.getAttribute('data-free_sample_data')
    );
    this.apiService.addFreeSample(free_sample_data).subscribe(response => {
      // Handle response
    });
  }

  onSubmit(): void {
    this.apiService.addToCart(this.orderForm.value).subscribe(response => {
      // Handle response
    });
  }

  // Add the missing properties and methods here
  isBlinds = true; // or false based on your logic
  objectKeys = Object.keys;

  isSelectedFrame(product_img: any): boolean {
    // Implement your logic here
    return true;
  }

  getFrameImageUrl(product_img: any): string {
    // Implement your logic here
    return product_img.image_url;
  }

  getFreeSampleData(related_product: any = null): string {
    const sample_data = {
      // populate with data
    };
    return JSON.stringify(sample_data);
  }

  getRelatedProductLink(related_product: any): string[] {
    return ['/product', related_product.slug];
  }

  getRelatedProductImageUrl(related_product: any): string {
    return related_product.image_url;
  }

  getRelatedProductName(related_product: any): string {
    return related_product.name;
  }

  ngAfterViewChecked(): void {
    if (!this.listenersAdded) {
      const selects = this.el.nativeElement.querySelectorAll('.blindmatrix-v4-parameter-input');
      selects.forEach((select: any) => {
        const fieldArgs = select.getAttribute('data-field-args');
        if (fieldArgs) {
          this.renderer.listen(select, 'change', (event) => {
            this.onFieldChange(event, JSON.parse(fieldArgs));
          });
        }
      });
      this.listenersAdded = true;
    }
  }
}
