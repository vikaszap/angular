import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}

  addToWooCommerceCart(data: any, wpSiteUrl: string): Observable<any> {
    return this.http.post(`${wpSiteUrl}/wp-json/visualizer/v1/add-to-cart`, data);
  }
}