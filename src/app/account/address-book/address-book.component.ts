import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {first, Observable, Subscription} from "rxjs";
import {AuthService} from "../../auth/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../account-services/account.service";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit,OnDestroy {

  modalRef?: BsModalRef;

  private unsubscribe: Subscription[] = [];
  user$: Observable<any>;
  addressList:any[] = []
  isNoAddress : boolean = false
  address:any



  country : any
  countriesList: any[] = [];
  state : any
  countryStateList: any[] = []
  city:any
  cityList: any[] = []

  addressForm:FormGroup
  addressUpdateForm:FormGroup
  hasError: boolean = false;
  errorMessage: string = 'The login details are incorrect'
  isLoading = {
    loadingLogin: false,
  };

  public notifier !: NotifierService;

  constructor(private modalService: BsModalService,private accountService: AccountService,
              private authService: AuthService,public notifierService: NotifierService) {
    this.user$ = this.authService.currentUserSubject.asObservable();
    this.notifier = notifierService;

    this.addressForm = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      contact_personal: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      state: new FormControl(''),
      city: new FormControl(''),

      contact_home: new FormControl(''),
      postal_code: new FormControl('', Validators.required),
      complete_address: new FormControl('', Validators.required),

      shipping_address: new FormControl(false),
      billing_address: new FormControl(false),
    });
    this.addressUpdateForm = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      contact_personal: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      state: new FormControl(''),
      city: new FormControl(''),

      contact_home: new FormControl(''),
      postal_code: new FormControl('', Validators.required),
      complete_address: new FormControl('', Validators.required),

      shipping_address: new FormControl(false),
      billing_address: new FormControl(false),
    });

  }

  ngOnInit(): void {
    let sub = this.user$.subscribe((data:any) => {
      console.log(' user',data)
      this.getCountries()
    });
    this.unsubscribe.push(sub)

    this.get_address();
  }

  getCountries(){
    const sub = this.authService.getCountries()
      .pipe(first())
      .subscribe((res: any) => {
        if (res.success) {
          this.countriesList = res.success
          console.log(this.countriesList)

        }
      })
    this.unsubscribe.push(sub);

  }
  // when user Select Country it will load country`s state
   onCountryChange(val:any){
    if(val===''){
      this.addressForm.controls['city'].setValue("");
      this.addressForm.controls['state'].setValue("");
      this.country = '' // de-select country
      this.countryStateList = [] // country is empty state list will be empty
      this.cityList = [] // state is empty state city list will be empty

      this.notifier.notify("error" , 'Select Valid Country');
      return
    }
    const sub = this.authService.getCountryById(val)
      .pipe(first())
      .subscribe((res: any) => {
        if (res.success) {
          this.country = res.success[0]
          this.countryStateList = res.success[0].states

        }
      })
    this.unsubscribe.push(sub);
  }
  // when user Select state it will load state`s cities
   onStateChange(val:any){
     if(val===''){
       this.addressForm.controls['city'].setValue("");
       this.cityList = [] // state is de-selected  city list will be empty
       this.notifier.notify("error" , 'Select Valid State');
       return
     }
     const sub = this.authService.getCityByStateId(val)
       .pipe(first())
       .subscribe((res: any) => {
         if (res.success) {
           this.cityList = res.success[0].cities
           console.log('city', this.cityList)
         }
       })
     this.unsubscribe.push(sub);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getControlValue(controlName: string) {
    const control = this.addressForm.get(controlName) as FormControl;
    return control.value;
  }

  submitData() {

    this.isLoading.loadingLogin = true


    let data = {
      "contact_other": this.getControlValue('fullName'), // contact other treated as full name
      "contact_personal": this.getControlValue('contact_personal'),
      "contact_home": this.getControlValue('contact_home'),

      "country": this.getControlValue('country'),
      "state": this.getControlValue('state'),
      "city": this.getControlValue('city'),

      "is_default" : this.getControlValue('shipping_address'),
      "postal_code": this.getControlValue('postal_code'),
      "complete_address": this.getControlValue('complete_address'),
    }

    const Sub = this.accountService.create_address(data)
      .pipe(first())
      .subscribe((data: any) => {
        this.isLoading.loadingLogin = false
        if(data.success){
          this.notifier.notify("success" , 'Saved Successfully');
          this.addressList =[]
          this.get_address()
        }
        else if(data.message){
          this.notifier.notify("error" , data.message);
        }

      });
    this.unsubscribe.push(Sub);
  }
  // <--------------------------- Address Update Section ----------------------->
  get_address(){
    const Sub = this.accountService.get_address()
      .pipe(first())
      .subscribe((data: any) => {
        console.log("user address",data)
        if(data.success){
          this.addressList = data.success
          if(this.addressList.length===0){
            this.isNoAddress = true
          }
        }
        else if(data.message){
          this.notifier.notify("error" , data.message);
        }

      });
    this.unsubscribe.push(Sub);
  }

  openModal(template: TemplateRef<void>,address:any) {
    // city
    // is_default
    this.address = address
    this.addressUpdateForm.controls['postal_code'].setValue(address.postal_code);
    this.addressUpdateForm.controls['complete_address'].setValue(address.complete_address);

    this.addressUpdateForm.controls['country'].setValue(address.country);
    this.addressUpdateForm.controls['fullName'].setValue(address.contact_other);
    this.addressUpdateForm.controls['contact_personal'].setValue(address.contact_personal);
    this.addressUpdateForm.controls['contact_home'].setValue(address.contact_home);

    this.addressUpdateForm.controls['shipping_address'].setValue(!!address.is_default);

    this.onCountryUpdate(address.country)
    this.addressUpdateForm.controls['state'].setValue(address.state);

    this.onStateUpdate(address.state)
    this.addressUpdateForm.controls['city'].setValue(address.city);
    console.log("address",address)
    // open address update model form
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg'
    });

  }

  // when user Select Country it will load country`s state
  onCountryUpdate(val:any){
    if(val===''){
      this.addressUpdateForm.controls['city'].setValue("");
      this.addressUpdateForm.controls['state'].setValue("");
      this.country = '' // de-select country
      this.countryStateList = [] // country is empty state list will be empty
      this.cityList = [] // state is empty state city list will be empty

      this.notifier.notify("error" , 'Select Valid Country');
      return
    }
    const sub = this.authService.getCountryById(val)
      .pipe(first())
      .subscribe((res: any) => {
        if (res.success) {
          this.country = res.success[0]
          this.countryStateList = res.success[0].states

        }
      })
    this.unsubscribe.push(sub);
  }
  // when user Select state it will load state`s cities
  onStateUpdate(val:any){
    if(val===''){
      this.addressUpdateForm.controls['city'].setValue("");
      this.cityList = [] // state is de-selected  city list will be empty
      this.notifier.notify("error" , 'Select Valid State');
      return
    }
    const sub = this.authService.getCityByStateId(val)
      .pipe(first())
      .subscribe((res: any) => {
        if (res.success) {
          this.cityList = res.success[0].cities
          console.log('city', this.cityList)
        }
      })
    this.unsubscribe.push(sub);
  }

  getUpdateControlValue(controlName: string) {
    const control = this.addressUpdateForm.get(controlName) as FormControl;
    return control.value;
  }

  updateAddress() {
     //85572
    this.isLoading.loadingLogin = true

    let data = {
      "contact_other": this.getUpdateControlValue('fullName'), // contact other treated as full name
      "contact_personal": this.getUpdateControlValue('contact_personal'),
      "contact_home": this.getUpdateControlValue('contact_home'),

      "country": this.getUpdateControlValue('country'),
      "state": this.getUpdateControlValue('state'),
      "city": this.getUpdateControlValue('city'),


      "postal_code": this.getUpdateControlValue('postal_code'),
      "complete_address": this.getUpdateControlValue('complete_address'),
      "is_default" : this.getUpdateControlValue('shipping_address'),
    }



    const Sub = this.accountService.update_address(data,this.address.id)
      .pipe(first())
      .subscribe((data: any) => {
        this.isLoading.loadingLogin = false
        if(data.success){
          this.addressList =[]
          this.get_address()
          this.notifier.notify("success" , 'Address Updated Successfully');
        }
        else if(data.message){
          this.notifier.notify("error" , data.message);
        }

      });
    this.unsubscribe.push(Sub);
  }
}
