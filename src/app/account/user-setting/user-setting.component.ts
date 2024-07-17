import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../auth/services/auth.service";
import {BasicService} from "../../services/basic.service";
import {first, Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit,OnDestroy {
  private unsubscribe: Subscription[] = [];
  user$: Observable<any>;


  countriesList: any[] = [];
  dropdownSettings = {};
  country : any
  countryStateList: any[] = []
  constructor(private authService: AuthService,private basicService: BasicService) {
    this.user$ = this.authService.currentUserSubject.asObservable();
  }

  ngOnInit(): void {
   let sub = this.user$.subscribe((data:any) => {
      console.log(' user',data)
     this.getCountries()
    });
   this.unsubscribe.push(sub)

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      enableCheckAll: false,
      allowSearchFilter: true
    };

  }


  getCountries(){
    const sub = this.authService.getCountries()
      .pipe(first())
      .subscribe((res: any) => {
        console.log('country',res)
        if (res.success) {
          this.countriesList = res.success

        }
      })
    this.unsubscribe.push(sub);

  }

  getCountryById(id:string){
    const sub = this.authService.getCountryById(id)
      .pipe(first())
      .subscribe((res: any) => {
        console.log('country state',res)
        if (res.success) {
          this.country = res.success[0]
          this.countryStateList = res.success[0].states

        }
      })
    this.unsubscribe.push(sub);

  }

  onSelectCountry(item: any) {
    console.log("selected country", item)
    this.countryStateList = []
    this.getCountryById(item.id)
  }

  onDeSelectCountry(item: any) {
    console.log("de selected country", item)
  }


  onSelectState(item: any) {
    console.log("selected state", item)

  }
  onDeSelectState(item: any) {
    console.log("de selected state", item)
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
