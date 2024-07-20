import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';

import {AuthHTTPService} from './auth-http';
import {environment} from 'src/environments/environment';

import {Router} from "@angular/router";



@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {

  isLoading$: Observable<boolean>;

  isLoadingSubject: BehaviorSubject<boolean>;
  // private fields
  currentUserSubject: BehaviorSubject<any>;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();


    try {
      const lsValue = localStorage.getItem("userData");
      if (!lsValue) {
        this.currentUserSubject = new BehaviorSubject<any>(undefined);
      }

      const parsedValue = lsValue ? JSON.parse(lsValue) : undefined;
      this.currentUserSubject = new BehaviorSubject<any>(parsedValue);
    } catch (error) {
      this.currentUserSubject = new BehaviorSubject<any>(undefined);
    }


  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
   setCurrentUserValue(user: any) {
    this.currentUserSubject.next(user);
  }

  // public methods;
  login(email: string, password: string): Observable<any> {

    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email,password).pipe(
      map((data: any) => {
        return data
      }),

      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getUserByToken(): Observable<any> {
    return of(undefined);


  }

  logout() {
    localStorage.removeItem("userData");
    this.currentUserSubject.next(undefined);
    this.router.navigate(['/home'], {
      queryParams: {},
    });
  }

  // need create new user then login
  registration(data: any): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(data).pipe(
      map((data: any) => {
        return data
      }),

      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  updateUser(data: any,id:any): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.updateUser(data,id).pipe(
      map((data: any) => {
        return data
      }),

      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }




  ngOnDestroy() {

  }



}
