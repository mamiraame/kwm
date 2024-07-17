import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {first, Observable, Subscription} from "rxjs";
import {AuthService} from "../../auth/services/auth.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {AccountService} from "../account-services/account.service";
import {NotifierService} from "angular-notifier";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy {
  user$: Observable<any>;
  modalRef?: BsModalRef;
  public notifier !: NotifierService;
  private unsubscribe: Subscription[] = [];
  user:any
  isLoading = {
    loadingUpdateProfile: false,
  };
  profileUpdateForm:FormGroup
  constructor(private modalService: BsModalService,private accountService: AccountService,
              private authService: AuthService,public notifierService: NotifierService) {
    this.user$ = this.authService.currentUserSubject.asObservable();
    this.notifier = notifierService;

    this.profileUpdateForm = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      email: new FormControl('', Validators.required),
      contact: new FormControl('', Validators.required),
      dob: new FormControl(''),
      gender: new FormControl(''),

    });

  }

  ngOnInit(): void {
    let sub = this.user$.subscribe((data:any) => {
      console.log('user profile',data)
      this.user = data.user;
    });
    this.unsubscribe.push(sub)
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  updateProfile(){
    this.isLoading.loadingUpdateProfile = true

    let data = {
      "name": this.getControlValue('fullName'),
      "email": this.getControlValue('email'),
      "contact": this.getControlValue('contact'),
    }

    const Sub = this.accountService.update_profile(data,this.user.id)
      .pipe(first())
      .subscribe((data: any) => {
        console.log("Profile data Return", data)
        this.isLoading.loadingUpdateProfile = false
        if(data.success){
          this.notifier.notify("success" , 'Profile Updated Successfully');
        }
        else if(data.message){
          this.notifier.notify("error" , "Unexpected error to update profile");
        }else {
          this.notifier.notify("error" , "Unexpected error to update profile");
        }

      });
    this.unsubscribe.push(Sub);
  }

  openModal(template: TemplateRef<void>) {

    this.modalRef = this.modalService.show(template);

  }

  getControlValue(controlName: string) {
    const control = this.profileUpdateForm.get(controlName) as FormControl;
    return control.value;
  }

}
