import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';

import {AuthHTTPService} from './auth-http';
import {environment} from 'src/environments/environment';
import {AuthModel} from "../models/auth.model";
import {UserAllModel} from "../models/UserAll.Model";
import {Router} from "@angular/router";

export type UserType = UserAllModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {

  isLoading$: Observable<boolean>;

  isLoadingSubject: BehaviorSubject<boolean>;
  // private fields
  currentUserSubject: BehaviorSubject<UserType>;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
  }

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  // public methods;
  login(email: string, password: string): Observable<any> {

    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        return this.setAuthFromLocalStorage(auth);
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );

  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.token).pipe(
      map((user: UserType) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
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

// <<----------------------------shipping address-------------------------->>

  getShippingAddress() {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    return this.authHttpService.getShippingAddress(auth.token).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  createShippingAddress(data: any) {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    return this.authHttpService.createShippingAddress(auth.token, data).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // <<----------------------------get countries-------------------------->>

  getCountries() {

    this.isLoadingSubject.next(true);
    return this.authHttpService.getCountries().pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getCountryById(id:string) {

    this.isLoadingSubject.next(true);
    return this.authHttpService.getCountryById(id).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getCityByStateId(id:string) {

    this.isLoadingSubject.next(true);
    return this.authHttpService.getCityByStateId(id).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ngOnDestroy() {

  }

  getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      return JSON.parse(lsValue);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.token) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      this.getAuthFromLocalStorage();
      return true;
    }
    return false;
  }


}
