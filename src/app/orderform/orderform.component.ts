import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-orderform',
  templateUrl: './orderform.component.html',
  styleUrls: ['./orderform.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
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
    // This function will be implemented later
  }

  blindmatrix_v4_render_colors_HTML(color_field_args: any): any {
    // This function will be implemented later
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
}
