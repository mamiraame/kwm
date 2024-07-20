import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {AccountHttpService} from "./account-http/account-http.service";
import {catchError, finalize, map} from "rxjs/operators";
import {environment} from "../../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnDestroy{

  isLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;



  constructor( private accountHttpService: AccountHttpService) {

    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();


  }



  get_all_users(): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.accountHttpService.get_all_users().pipe(
      map((data: any) => {
        return data
      }),

      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  deleteUser(id:any): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.accountHttpService.deleteUser(id).pipe(
      map((data: any) => {
        return data
      }),

      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  add_worker(data:any): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.accountHttpService.add_worker(data).pipe(
      map((data: any) => {
        return data
      }),

      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  get_all_workers(): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.accountHttpService.get_all_workers().pipe(
      map((data: any) => {
        return data
      }),

      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  deleteWorker(id:any): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.accountHttpService.deleteWorker(id).pipe(
      map((data: any) => {
        return data
      }),

      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // contact

  add_contact_us(data:any): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.accountHttpService.add_contact_us(data).pipe(
      map((data: any) => {
        return data
      }),

      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  get_all_message(): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.accountHttpService.get_all_message().pipe(
      map((data: any) => {
        return data
      }),

      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ngOnDestroy(): void {

  }

}
