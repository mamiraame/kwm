import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import {HttpClient, HttpHeaders,} from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {UserAllModel} from "../../models/UserAll.Model";



const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods

  login(email: string, password: string):Observable<any>{
    const response =   fetch(`${API_USERS_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": password
      }),
    })
      .then((response) => response.json())
      .then((data)=>{
        return data;
      });
    return   from(response);
  }
  getUserByToken(token: string): Observable<UserAllModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserAllModel>(`${API_USERS_URL}/user/get`,  {
      headers: httpHeaders,
    });
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(API_USERS_URL+"/register", user);
  }

  // <<----------------------------shipping address-------------------------->>
  getShippingAddress(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${API_USERS_URL}/shipping-address/get`,  {
      headers: httpHeaders,
    });
  }
  createShippingAddress(token: string,data:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${API_USERS_URL}/shipping-address/create`, data, {
      headers: httpHeaders,
    });
  }
  // <<----------------------------get counties-------------------------->>
  getCountries(): Observable<any> {
    return this.http.get<any>(`https://prod.newclear.io/api/country-data/get-country`,  {
    });//
  }
  getCountryById(id:string): Observable<any> {
    return this.http.get<any>(`https://prod.newclear.io/api/country-data/get-country?country_id=${id}`,  {
    });//
  }
  getCityByStateId(id:string): Observable<any> {
    return this.http.get<any>(`https://prod.newclear.io/api/country-data/get-state/${id}`,  {
    });//
  }
}
