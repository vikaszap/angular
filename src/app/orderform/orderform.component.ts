import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Field {
  fieldid: string;
  fieldname: string;
  fieldtypeid: number;
  mandatory: boolean;
  optionsvalue?: Array<{ optionid: string; optionname: string }>;
}

@Component({
  selector: 'app-orderform',
  templateUrl: './orderform.component.html',
})
export class OrderformComponent implements OnInit {
  wordpressSiteUrl: string = '';
  productId: number = 0;
  productName: string = '';
  selectedSize: string = '';
  selectedColor: string = '';
  previewImage: string = '';
  calculatedPrice: number = 0;

  category: string = '';
  productSlug: string = '';
  fabric: string = '';
  fabricId: number = 0;
  colorId: number = 0;
  matmapid: number = 0;
  pricingGroupId: number = 0;
  supplierId: number = 0;
  recipeid: string = '';
  api_key: string = '';
  api_url: string = '';
  api_name: string = '';

  fields: Field[] = [];
  form!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({});
    this.route.queryParams.subscribe(params => {
      this.wordpressSiteUrl = params['site'] || '';
      this.productId = +(params['product_id'] || 0);
      this.category = params['category'] || '';
      this.recipeid = params['recipeid'] || '';
      this.productSlug = params['product'] || '';
      this.fabric = params['fabric'] || '';
      this.fabricId = +(params['fabric_id'] || 0);
      this.colorId = +(params['color_id'] || 0);
      this.matmapid = +(params['matmapid'] || 0);
      this.pricingGroupId = +(params['pricing_group'] || 0);
      this.supplierId = +(params['supplier'] || 0);
      this.api_url = params['api_url'] || '';
      this.api_key = params['api_key'] || '';
      this.api_name = params['api_name'] || '';

      if (this.recipeid) {
        this.loadProductFields();
      } else {
        this.errorMessage = 'Recipe ID is required';
      }
    });
  }

  loadProductFields() {
    this.isLoading = true;
    this.errorMessage = '';
    this.callV4Api('GET', `products/fields/withdefault/list/${this.recipeid}/1/0`);
  }

  buildForm(): void {
    const controls: { [key: string]: any } = {};
    this.fields.forEach((field) => {
      const validators = field.mandatory ? [Validators.required] : [];
      controls[field.fieldid] = ['', validators];
    });
    this.form = this.fb.group(controls);
  }

  callV4Api(
    method: 'GET' | 'POST' | 'PUT',
    passData: string,
    payload: any = {},
    node: boolean = false,
    appointment: boolean = false
  ) {
    this.apiService.callApi(
      method,
      passData,
      payload,
      node,
      appointment,
      this.api_url,
      this.api_key,
      this.api_name
    ).subscribe({
      next: (response: any) => {
        if (response && response[0] && response[0].data) {
          this.fields = response[0].data;
          this.buildForm();
        } else {
          this.errorMessage = 'No data received from API';
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(`API call failed (${passData}):`, error);
        this.errorMessage = error.message || 'Failed to load product details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSizeChange(size: string) {
    this.selectedSize = size;
  }

  onColorChange(color: string) {
    this.selectedColor = color;
  }

  addToCart() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      product_id: this.productId,
      quantity: 1,
      variation: {
        size: this.selectedSize,
        color: this.selectedColor,
        fabric: this.fabric
      },
      ...this.form.value
    };

    this.isLoading = true;
    this.cartService.addToWooCommerceCart(payload, this.wordpressSiteUrl).subscribe({
      next: () => {
        window.location.href = `${this.wordpressSiteUrl}/cart`;
      },
      error: (err) => {
        console.error('Add to cart failed:', err);
        this.errorMessage = err.message || 'Failed to add product to cart. Please try again.';
        this.isLoading = false;
      }
    });
  }
}