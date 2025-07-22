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
  productDetails: any = {};
  unitData: any[] = [];
  fabricList: any[] = [];
  colorArr: any = {};

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

      if (this.productId) {
        this.loadInitialData();
      } else {
        this.errorMessage = 'Product ID is required';
      }
    });
  }

  loadInitialData() {
    this.loadProductDetails();
    this.loadUnitData();
    this.loadFabricList();
    // Add other data loading calls here
  }

  loadProductDetails() {
    this.isLoading = true;
    this.errorMessage = '';

    // Get Product List Data
    this.apiService.callApi('POST', 'getproductsdetails', null, false, false, this.api_url, this.api_key, this.api_name)
      .subscribe({
        next: (response: any) => {
          if (response && response.result && response.result.EcomProductlist) {
            const product = response.result.EcomProductlist.find((p: any) => p.pei_productid === this.productId);
            if (product) {
              this.productDetails = product;
              this.productName = this.productDetails.pei_ecomProductName;
              // Now get the recipe ID and load the fields
              if (this.productDetails.recipeid) {
                this.recipeid = this.productDetails.recipeid;
                this.loadProductFields();
              } else {
                this.errorMessage = 'Recipe ID not found for this product.';
                this.isLoading = false;
              }
            } else {
              this.errorMessage = 'Product not found.';
              this.isLoading = false;
            }
          } else {
            this.errorMessage = 'No data received from API';
            this.isLoading = false;
          }
        },
        error: (error: any) => {
          console.error(`API call failed (getproductsdetails):`, error);
          this.errorMessage = error.message || 'Failed to load product details. Please try again.';
          this.isLoading = false;
        }
      });
  }

  loadUnitData() {
    this.apiService.callApi('POST', `unittype/${this.productId}`, null, false, false, this.api_url, this.api_key, this.api_name)
      .subscribe({
        next: (response: any) => {
          if (response && response.result && response.result.unittype) {
            this.unitData = response.result.unittype;
          }
        },
        error: (error: any) => {
          console.error(`API call failed (unittype):`, error);
          this.errorMessage = error.message || 'Failed to load unit data. Please try again.';
        }
      });
  }

  loadFabricList() {
    const fieldscategoryid = this.category === 'blinds-with-fabric' ? 5 : 20;
    const fabricArgs = {
      matmapid: this.matmapid,
      colorid: this.colorId,
      related_fabric: this.fabricId,
      showall: true
    };

    this.apiService.callApi('POST', `fabriclistview/${fieldscategoryid}/${this.productId}`, fabricArgs, false, false, this.api_url, this.api_key, this.api_name)
      .subscribe({
        next: (response: any) => {
          if (response && response.result) {
            this.fabricList = response.result;
            // Find the selected color
            if (this.fabricId === 0) {
              this.colorArr = this.fabricList.find(item => item.cd_id == this.colorId && item.matmapid == this.matmapid);
            } else {
              this.colorArr = this.fabricList.find(item => item.fd_id == this.fabricId && item.cd_id == this.colorId && item.matmapid == this.matmapid);
            }
          }
        },
        error: (error: any) => {
          console.error(`API call failed (fabriclistview):`, error);
          this.errorMessage = error.message || 'Failed to load fabric list. Please try again.';
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

    this.form.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.calculatePrice();
    });
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
        if (response && response.data) {
          this.fields = response.data;
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

  onFieldChange(field: Field, selectedValue: any) {
    if (field.fieldtypeid === 3 && selectedValue) { // Assuming 3 is the field type for lists with sub-components
      this.loadSubComponent(field, selectedValue);
    }
  }

  loadSubComponent(parentField: Field, selectedValue: any) {
    const payload = {
      productid: this.productId,
      recipeid: this.recipeid,
      fieldid: parentField.fieldid,
      fieldlevel: 1, // Assuming level 1 for now
      fieldtypeid: parentField.fieldtypeid,
      optionid: [selectedValue],
      subfieldoptionlinkid: [selectedValue], // This might need to be adjusted based on the API
      orderitemselectedvalues: {
        [parentField.fieldid]: [selectedValue]
      }
    };

    this.apiService.getSubComponents(payload, this.api_url, this.api_key, this.api_name)
      .subscribe({
        next: (response: any) => {
          if (response && response.data) {
            // Find the parent field and add the sub-components to it
            const fieldIndex = this.fields.findIndex(f => f.fieldid === parentField.fieldid);
            if (fieldIndex > -1) {
              // This is a simplified approach. You might need a more robust way to handle sub-fields.
              this.fields[fieldIndex].optionsvalue = this.fields[fieldIndex].optionsvalue?.concat(response.data);
            }
          }
        },
        error: (error: any) => {
          console.error(`API call failed (getSubComponents):`, error);
          this.errorMessage = error.message || 'Failed to load sub-components. Please try again.';
        }
      });
  }

  calculatePrice() {
    if (this.form.invalid) {
      return;
    }

    const formValues = this.form.value;
    const optionData = this.fields.map(field => {
      if (formValues[field.fieldid]) {
        return {
          optionvalue: formValues[field.fieldid],
          fieldtypeid: field.fieldtypeid,
          optionqty: 1
        };
      }
      return null;
    }).filter(option => option !== null);

    const payload = {
      productid: this.productId,
      supplierid: this.supplierId,
      width: formValues['width'],
      drop: formValues['drop'],
      pricegroup: [this.pricingGroupId],
      customertype: 4,
      optiondata: optionData,
      unittype: 2, // Assuming default, will need to be dynamic
      orderitemqty: 1,
      vatpercentage: this.productDetails.vat_percentage || 0,
      rulescostpricecomesfrom: this.productDetails.rules_cost_price_comes_from,
      rulesnetpricecomesfrom: this.productDetails.rules_net_price_comes_from,
      fabricfieldtype: 5,
      widthfieldtypeid: 11,
      dropfieldtypeid: 12,
      colorid: this.colorId,
      fabricid: this.fabricId,
    };

    this.apiService.calculatePrice(payload, this.api_url, this.api_key, this.api_name)
      .subscribe({
        next: (response: any) => {
          if (response && response.finalnetprice) {
            this.calculatedPrice = response.finalnetprice;
          }
        },
        error: (error: any) => {
          console.error(`API call failed (calculatePrice):`, error);
          this.errorMessage = error.message || 'Failed to calculate price. Please try again.';
        }
      });
  }

  addToCart() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.value;
    const blindmatrix_v4_parameters_data = {
      ...formValues,
      product_id: this.productId,
      productname: this.productName,
      fabricname: this.fabric,
      colorname: this.colorArr.colorname,
      matmapid: this.matmapid,
      category: this.category,
      pricing_group_type: this.colorArr.prices,
      supplier_id: this.supplierId,
      unitlabel: "Unit Type",
      min_width: this.colorArr.minwidth,
      max_width: this.colorArr.maxwidth,
      min_drop: this.colorArr.mindrop,
      max_drop: this.colorArr.maxdrop,
      unittype: formValues['unittype'],
      finalcostprice: this.calculatedPrice, // This might need to be adjusted based on the price calculation response
      finalnetprice: this.calculatedPrice,
      netprice: this.calculatedPrice,
      vatprice: 0, // This needs to be calculated
      ecomsampleprice: this.productDetails.pei_ecomsampleprice,
      ecomFreeSample: this.productDetails.pei_ecomFreeSample,
      recipeid: this.recipeid,
      qty: formValues['qty'] || 1,
      // Add all other necessary fields from the PHP code
    };

    this.isLoading = true;
    this.cartService.addToWooCommerceCart({ blindmatrix_v4_parameters_data }, this.wordpressSiteUrl).subscribe({
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