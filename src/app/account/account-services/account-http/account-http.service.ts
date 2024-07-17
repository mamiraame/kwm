import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";

const API_USERS_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class AccountHttpService {

  constructor(private http: HttpClient) { }

// ------------------------------products------------------------\\

  create_address(token:string,data:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${API_USERS_URL}/shipping-address/create`, data, {
      headers: httpHeaders,
    });
  }
  get_address(token:string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${API_USERS_URL}/shipping-address/get`, {
      headers: httpHeaders,
    });
  }
  update_address(token:string,data:any,id:number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${API_USERS_URL}/shipping-address/update/${id}`, data, {
      headers: httpHeaders,
    });
  }

  // ------------------------------Profile------------------------\\

  update_profile(token:string,data:any,id:number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${API_USERS_URL}/profile/update/${id}`, data, {
      headers: httpHeaders,
    });
  }


}
