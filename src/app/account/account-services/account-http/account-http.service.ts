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

  get_all_users(): Observable<any> {
    return this.http.post<any>(API_USERS_URL+"user/get", {});
  }

  deleteUser(id:any): Observable<any> {
    return this.http.post<any>(API_USERS_URL+"user/delete/"+id, {});
  }


  add_worker(data:any): Observable<any> {
    return this.http.post<any>(API_USERS_URL+"worker/create", data);
  }
  get_all_workers(): Observable<any> {
    return this.http.post<any>(API_USERS_URL+"worker/get", {});
  }
  deleteWorker(id:any): Observable<any> {
    return this.http.post<any>(API_USERS_URL+"worker/delete/"+id, {});
  }
  // contact us

  add_contact_us(data:any): Observable<any> {
    return this.http.post<any>(API_USERS_URL+"contact/create", data);
  }
  get_all_message(): Observable<any> {
    return this.http.post<any>(API_USERS_URL+"contact/get", {});
  }

}
