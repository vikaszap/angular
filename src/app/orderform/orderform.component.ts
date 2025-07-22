import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
export class OrderformComponent implements OnInit {
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

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      unit: ['mm'],
      width: [''],
      widthfraction: [''],
      drop: [''],
      dropfraction: [''],
      // Add other form controls here
    });
  }

  ngOnInit(): void {
    this.fetchInitialData();
  }

  fetchInitialData(): void {
    // Replace with actual product slug
    this.apiService.getProductData('your_product_slug').subscribe((data: any) => {
      this.product_details_arr = data.product_details_arr;
      this.product_specs = data.product_specs;
      this.product_description = data.product_description;
      this.background_color_image_url = data.background_color_image_url;
      this.unit_type_data = data.unit_type_data;
      this.parameters_arr = data.parameters_arr;
      this.inchfraction_array = data.inchfraction_array;
      this.color_arr = data.color_arr;
      this.product_minimum_price = data.product_minimum_price;
      this.min_width = data.min_width;
      this.max_width = data.max_width;
      this.min_drop = data.min_drop;
      this.max_drop = data.max_drop;
      this.ecomsampleprice = data.ecomsampleprice;
      this.ecomFreeSample = data.ecomFreeSample;
      this.delivery_duration = data.delivery_duration;
      this.visualizertagline = data.visualizertagline;
      this.productname = data.productname;
      this.product_list_page_link = data.product_list_page_link;
      this.fabricname = data.fabricname;
      this.hide_frame = data.hide_frame;
      this.mainframe = data.mainframe;
      this.product_img_array = data.product_img_array;
      this.product_deafultimage = data.product_deafultimage;
      this.fabric_linked_color_data = data.fabric_linked_color_data;
      this.related_products_list_data = data.related_products_list_data;
      this.productlisting_frame_url = data.productlisting_frame_url;
      this.sample_img_frame_url = data.sample_img_frame_url;
      this.v4_product_visualizer_page = data.v4_product_visualizer_page;
      this.fieldscategoryname = data.fieldscategoryname;
      this.productslug = data.productslug;
      this.fabricid = data.fabricid;
      this.colorid = data.colorid;
      this.matmapid = data.matmapid;
      this.pricegroup_id = data.pricegroup_id;
      this.supplier_id = data.supplier_id;
    });
  }

  get_blindmatrix_v4_parameters_HTML(
    field_type_id: any,
    field_args: any
  ): any {
    const field_type_name = this.get_field_type_name(field_type_id);
    if (!field_type_name) {
      return '';
    }

    switch (field_type_name) {
      case 'list':
        return this.blindmatrix_render_list_field(field_args);
      case 'number':
        return this.blindmatrix_render_number_field(field_args);
      case 'hidden':
        return this.blindmatrix_render_hidden_field(field_args);
      // Add other cases here
      default:
        return '';
    }
  }

  get_field_type_name(chosen_field_type_id: any): string {
    const field_types: { [key: string]: string } = {
      '3': 'list',
      '5': 'fabric_and_color',
      '6': 'number',
      '7': 'x_footage',
      '8': 'width',
      '9': 'y_footage',
      '10': 'height',
      '11': 'width',
      '12': 'drop',
      '13': 'pricegroup',
      '14': 'qty',
      '17': 'supplier',
      '18': 'text',
      '31': 'x_square_yard',
      '32': 'y_square_yard',
      '34': 'unit_type',
      '21': 'shutter_materials', //shutter_materials
      '25': 'accessories_list',
      '20': 'color',
    };

    if (!chosen_field_type_id) {
      return '';
    }

    let field_type_name = field_types[chosen_field_type_id] || '';

    if (!field_type_name) {
      return '';
    }

    switch (chosen_field_type_id) {
      case '6':
      case '7':
      case '8':
      case '9':
      case '10':
      case '11':
      case '12':
      case '31':
      case '32':
        field_type_name = 'number';
        break;
      case '13':
      case '14':
      case '17':
      case '34':
      case '20':
        field_type_name = 'hidden';
        break;
      case '21':
        field_type_name = 'list';
        break;
    }

    return field_type_name;
  }

  blindmatrix_v4_render_colors_HTML(color_field_args: any): any {
    // This function will be implemented later
  }

  blindmatrix_render_list_field(field_args: any): any {
    let field_html = '';
    if (field_args.showfieldonjob == '1') {
      field_html += `<div class="d-flex blindmatrix-v4-parameter-wrapper blindmatrix-v4-parameter-wrapper-list">`;
      field_html += `<label class="blindmatrix-v4-parameter-label">${field_args.fieldname}</label>`;
      field_html += `<select class="blindmatrix-v4-parameter-input" name="${field_args.labelnamecode}" id="${field_args.labelnamecode}">`;
      field_args.optionsvalue.forEach((option: any) => {
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
      field_html += `<input type="number" class="blindmatrix-v4-parameter-input" name="${field_args.labelnamecode}" id="${field_args.labelnamecode}" value="${field_args.value || ''}">`;
      field_html += `</div>`;
    }
    return field_html;
  }

  blindmatrix_render_hidden_field(field_args: any): any {
    return `<input type="hidden" name="${field_args.labelnamecode}" id="${field_args.labelnamecode}" value="${field_args.value || ''}">`;
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
}
