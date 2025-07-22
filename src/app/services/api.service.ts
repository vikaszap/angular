import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

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

  calculatePrice(payload: any, api_url: string, api_key: string, api_name: string): Observable<any> {
    const passData = 'orderitems/calculate/option/price/';
    return this.callApi('POST', passData, payload, true, false, api_url, api_key, api_name);
  }

  getSubComponents(payload: any, api_url: string, api_key: string, api_name: string): Observable<any> {
    const passData = 'products/fields/list/0';
    return this.callApi('POST', passData, payload, false, false, api_url, api_key, api_name);
  }
}