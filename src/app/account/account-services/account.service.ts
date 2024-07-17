import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {AccountHttpService} from "./account-http/account-http.service";
import {catchError, finalize, map} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {AuthModel} from "../../auth/models/auth.model";


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



  // <<------------------------------ address ------------------------>>
  get_address(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    return this.accountHttpService.get_address(auth.token).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        console.log("error",err)
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  create_address(data:any){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    return this.accountHttpService.create_address(auth.token,data).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        console.log("error",err)
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  update_address(data:any,id:number){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    return this.accountHttpService.update_address(auth.token,data,id).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        console.log("error",err)
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // <<------------------------------ Profile ------------------------>>

  update_profile(data:any,id:number){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    return this.accountHttpService.update_profile(auth.token,data,id).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        console.log("error",err)
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  // <<------------------------------ local Storage ------------------------>>
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

  ngOnDestroy(): void {

  }

}
