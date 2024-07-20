import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import {HttpClient, HttpHeaders,} from '@angular/common/http';
import {environment} from "../../../../environments/environment";




const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods

  login(email: string, password: string):Observable<any>{
    const user = {
      "number":email,
      "password":password
    }
    return this.http.post<any>(API_USERS_URL+"user/login", user);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(API_USERS_URL+"user/create", user);
  }
  updateUser(user: any,id:any): Observable<any> {
    return this.http.post<any>(API_USERS_URL+"user/update/"+id, user);
  }


}
