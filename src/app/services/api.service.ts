import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Console } from 'console';

interface ApiCommonParams {
  api_url: string;
  api_key: string;
  api_name: string;
  recipeid?: string;
  productid?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/wordpress/wp-content/plugins/blindmatrix-v4-api/api.php'; // Default API URL

  constructor(private http: HttpClient) {}

  /**
   * Generic API call method supporting GET, POST, PUT
   */
  callApi(
    method: string,
    passData: string,
    payload: any = null,
    node: boolean = false,
    appointment: boolean = false,
    api_url: string,
    api_key: string,
    api_name: string
  ): Observable<any> {
    let url = '';

    if (appointment) {
      url = `${api_url}/api/public/api/`;
    } else if (node) {
      url = `https://curtainmatrix.co.uk/devsource/nodeapi/`;
    } else {
      url = `${api_url}/api/public/api/`;
    }

    url += passData;

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'companyname': api_name,
      'platform': 'Ecommerce',
      'Ecommercekey': api_key,
      'activity': JSON.stringify({
        ipaddress: '',
        location: '',
        devicenameversion: '',
        browsernameversion: ''
      })
    });

    switch (method.toUpperCase()) {
      case 'POST':
        return this.http.post(url, payload || {}, { headers });
      case 'PUT':
        return this.http.put(url, payload || {}, { headers });
      case 'GET':
      default:
        let params = new HttpParams();
        if (payload) {
          Object.keys(payload).forEach(key => {
            if (payload[key] !== undefined && payload[key] !== null) {
              params = params.set(key, payload[key].toString());
            }
          });
        }
        return this.http.get(url, { headers, params });
    }
  }

  /**
   * Get product data with default fields
   */
  getProductData(params: ApiCommonParams): Observable<any> {
    const { api_url, api_key, api_name, recipeid, ...payload } = params;
    if (!recipeid) {
      throw new Error('recipeid is required');
    }
    const passData = `products/fields/withdefault/list/${recipeid}/1/0`;
    return this.callApi('GET', passData, payload, true, false, api_url, api_key, api_name);
  }

  /**
   * Calculate price by sending form data as JSON body
   */
  calculatePrice(formData: any): Observable<any> {
    const payload = {
      action: 'price_calculation',
      form_data: JSON.stringify(formData)
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, payload, { headers });
  }

  /**
   * Add item to cart by sending form data as JSON body
   */
  addToCart(formData: any): Observable<any> {
    const payload = {
      action: 'add_to_cart',
      form_data: JSON.stringify(formData)
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, payload, { headers });
  }

  /**
   * Add free sample by sending sample data as JSON body
   */
  addFreeSample(sampleData: any): Observable<any> {
    const payload = {
      action: 'add_freesample',
      ...sampleData
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, payload, { headers });
  }

  /**
   * Get option list with POST request and JSON payload
   */
  getOptionlist(
    params: ApiCommonParams,
    level: number = 0,
    fieldtype: number = 3,
    fabriccolor: number = 0,
    fieldid: number,
    filter: any
  ): Observable<any> {
    const { api_url, api_key, api_name, recipeid,product_id, ...rest } = params;

    if (!recipeid) {
      throw new Error('recipeid is required');
    }

    const payload = {
      filterids: fieldtype === 3 ? filter : null,
      productionformulalist: [],
      productid: product_id || null,
    };
    console.log(payload);
    const passData = `products/get/fabric/options/list/${recipeid}/${level}/0/${fieldtype}/${fabriccolor}/${fieldid}`;
     console.log(passData);
    return this.callApi('POST', passData, payload, true, false, api_url, api_key, api_name);
  }

  /**
   * Filter based list with POST request and JSON payload
   */
  filterbasedlist(
    params: ApiCommonParams,
    level: string = "",
    fieldtype: number,
    fabriccolor: string = "",
    fieldid: string = ""
  ): Observable<any> {
    const { api_url, api_key, api_name,product_id } = params;
    const payload = {
      changedfieldtypeid: "",
      colorid: "",
      coloriddual: "",
      customertype: "4",
      drop: null,
      fabricid: "",
      fabriciddual: "",
      fieldtypeid: fieldtype,
      lineitemselectedvalues: [],
      numFraction: null,
      orderItemId: "",
      orderitemselectedvalues: "",
      pricegroup: "",
      pricegroupdual: "",
      productid: product_id,
      selectedfieldids: "",
      selectedvalues: "",
      subcolorid: "",
      subfabricid: "",
      supplier: "",
      unittype: 2,
      width: null,
      level: level,
      fabriccolor: fabriccolor,
      fieldid: fieldid
    };
    
    const passData = `products/fields/filterbasedongeneraldata`;

    return this.callApi('POST', passData, payload, true, false, api_url, api_key, api_name);
  }
  unitypelist(
    params: ApiCommonParams
  ): Observable<any> {
    const { api_url, api_key, api_name, recipeid,product_id, ...rest } = params;

      const passData = `unitype/for/products/${product_id}`;
    const payload ={};
    return this.callApi('GET', passData, payload, true, false, api_url, api_key, api_name);
  }
}
