import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

const API_USERS_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class BasicHttpService {

  constructor(private http: HttpClient) { }

// ------------------------------products------------------------\\

  get_home_products(): Observable<any> {
    return this.http.get(`${API_USERS_URL}/product`);
  }
  get_products_category(category_id:number): Observable<any> {
    return this.http.get(`${API_USERS_URL}/product?category_id=${category_id}`);
  }
  get_product(sku:any): Observable<any> {
    return this.http.get(`${API_USERS_URL}/product/search/${sku}`);
  }
  // ------------------------------categories------------------------\\

  get_categories(): Observable<any> {
    return this.http.get(`${API_USERS_URL}/category/get`);
  }



}
