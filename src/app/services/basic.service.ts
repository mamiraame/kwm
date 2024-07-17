import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {BasicHttpService} from "./basic-http/basic-http.service";
import {catchError, finalize, map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {AuthModel} from "../auth/models/auth.model";

@Injectable({
  providedIn: 'root'
})
export class BasicService implements OnDestroy{

  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;


  // recently View Data
  private recentlyViewSubject = new BehaviorSubject<any[]>(this.getDataFromLocalStorage(environment.recently_view_key))
  recentlyViewData$ = this.recentlyViewSubject.asObservable();


  constructor( private basicHttpService: BasicHttpService) {}



  // <<------------------------------ home page product ------------------------>>
  get_home_products(){
    return this.basicHttpService.get_home_products().pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        console.log("error",err)
        return of(err);
      }),

    );
  }
  get_product(sku:any){

    return this.basicHttpService.get_product(sku).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        console.log("error",err)
        return of(err);
      }),

    );
  }

  get_products_category(category_id:number){

    return this.basicHttpService.get_products_category(category_id).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        console.log("error",err)
        return of(err);
      }),

    );
  }

  // <<------------------------------ home page categories ------------------------>>
  get_categories(){

    return this.basicHttpService.get_categories().pipe(
      map((data: any) => {
        return data;
      }),
      catchError((err) => {
        console.log("error",err)
        return of(err);
      }),

    );
  }

  // <<------------------------------ Recently View Item ------------------------>>
  addToRecentlyViewItems(item:any){
    let data = this.getDataFromLocalStorage(environment.recently_view_key);
    if (data.length>0) {
      const existingItemIndex = data.findIndex((existingItem:any) => existingItem.prod_id === item.prod_id);
      if (existingItemIndex == -1) {
        data.push(item)
      }

    }else {
      data = [item]
    }
   let reverseData = data.reverse()
   // reverseData.length > 4 ? reverseData.splice(4) : null;
    this.recentlyViewSubject.next(reverseData);
    this.setDataLocalStorage(reverseData,environment.recently_view_key)
  }


  // <<------------------------------ Wish list Item ------------------------>>

  // <<------------------------------ local Storage ------------------------>>
  getDataFromLocalStorage(key:any){
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : [];
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
  setDataLocalStorage(data:any,key:any){
    localStorage.setItem(key, JSON.stringify(data));
  }
  ngOnDestroy(): void {

  }

}
