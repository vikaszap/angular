import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface ApiCommonParams {
  api_url: string;
  api_key: string;
  api_name: string;
  recipeid?: string;
  productid?: string;
  [key: string]: any;
}

interface ApiResponse {
  success: boolean;
  data: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/wordpress/wp-content/plugins/blindmatrix-v4-api/api.php';

  constructor(private http: HttpClient) {}

  private constructUrl(base: string, endpoint: string): string {
    return `${base.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  }

  private getHeaders(api_name: string, api_key: string): HttpHeaders {
    return new HttpHeaders({
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
  }

  callApi(
    method: string,
    passData: string,
    payload: any = null,
    node: boolean = false,
    appointment: boolean = false,
    api_url: string,
    api_key: string,
    api_name: string
  ): Observable<ApiResponse> {
    let url = '';
    if (appointment) {
      url = this.constructUrl(`${api_url}/api/public/api`, passData);
    } else if (node) {
      url = this.constructUrl('https://curtainmatrix.co.uk/devsource/nodeapi', passData);
    } else {
      url = this.constructUrl(`${api_url}/api/public/api`, passData);
    }

    const headers = this.getHeaders(api_name, api_key);

    switch (method.toUpperCase()) {
      case 'POST':
        return this.http.post<ApiResponse>(url, payload || {}, { headers }).pipe(
          catchError(this.handleError)
        );
      case 'PUT':
        return this.http.put<ApiResponse>(url, payload || {}, { headers }).pipe(
          catchError(this.handleError)
        );
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
        return this.http.get<ApiResponse>(url, { headers, params }).pipe(
          catchError(this.handleError)
        );
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('An error occurred. Please try again later.'));
  }

  getProductData(params: ApiCommonParams): Observable<ApiResponse> {
    const { api_url, api_key, api_name, recipeid, ...payload } = params;
    if (!recipeid) {
      return throwError(() => new Error('recipeid is required'));
    }
    const passData = `products/fields/withdefault/list/${recipeid}/1/0`;
    return this.callApi('GET', passData, payload, true, false, api_url, api_key, api_name);
  }

  getFractionData(params: ApiCommonParams,faction_value: any): Observable<ApiResponse> {
    const { api_url, api_key, api_name, recipeid,product_id, ...payload } = params;
    if (!recipeid) {
      return throwError(() => new Error('recipeid is required'));
    }
    const passData = `appSetup/fractionlist/${product_id}/-1/${faction_value}`;
    return this.callApi('GET', passData, payload, false, false, api_url, api_key, api_name);
  }

  calculatePrice(formData: any): Observable<ApiResponse> {
    const payload = {
      action: 'price_calculation',
      form_data: JSON.stringify(formData)
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<ApiResponse>(this.apiUrl, payload, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  addToCart(formData: any): Observable<ApiResponse> {
    const payload = {
      action: 'add_to_cart',
      form_data: JSON.stringify(formData)
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<ApiResponse>(this.apiUrl, payload, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  addFreeSample(sampleData: any): Observable<ApiResponse> {
    const payload = {
      action: 'add_freesample',
      ...sampleData
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<ApiResponse>(this.apiUrl, payload, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getOptionlist(
    params: ApiCommonParams,
    level: number = 0,
    fieldtype: number,
    fabriccolor: number = 0,
    fieldid: number,
    filter: any
  ): Observable<ApiResponse> {
    const { api_url, api_key, api_name, recipeid, product_id, ...rest } = params;

    if (!recipeid) {
      return throwError(() => new Error('recipeid is required'));
    }

    const payload = {
      filterids: filter,
      productionformulalist: [],
      productid: product_id || null,
    };
    const passData = `products/get/fabric/options/list/${recipeid}/${level}/0/${fieldtype}/${fabriccolor}/${fieldid}/?page=1&perpage=150`;
    
    return this.callApi('POST', passData, payload, true, false, api_url, api_key, api_name);
  }

  filterbasedlist(
    params: ApiCommonParams,
    level: string = "",
    fabriccolor: string = "",
    fieldid: string = ""
  ): Observable<ApiResponse> {
    const { api_url, api_key, api_name, product_id,category } = params;
    const payload = {
      changedfieldtypeid: "",
      colorid: "",
      coloriddual: "",
      customertype: "4",
      drop: null,
      fabricid: "",
      fabriciddual: "",
      fieldtypeid: category,
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
  
  sublist(
    params: ApiCommonParams,
    level: number = 2,
    fieldtype: number,
    optionlinkid:any,
    selectedvalue:any,
    masterparentfieldid: any,
  ): Observable<ApiResponse> {
    const { api_url, api_key, api_name, recipeid,product_id } = params;
      const payload = {
      supplierid: 1,
      productid:product_id, 
      optionid: [selectedvalue],
      subfieldoptionlinkid: [optionlinkid],
      productionformulalist: [],
      orderitemselectedvalues: {
        [masterparentfieldid]: [selectedvalue]
      }
    };
    const passData = `products/fields/list/0/${recipeid}/${level}/${fieldtype}/${masterparentfieldid}`;
    console.log(passData);
    console.log(payload);
    return this.callApi('POST', passData, payload, true, false, api_url, api_key, api_name);
  }
}