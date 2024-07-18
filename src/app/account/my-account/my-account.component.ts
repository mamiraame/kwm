import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {first, Observable, Subscription} from "rxjs";
import {AuthService} from "../../auth/services/auth.service";
import {ConfirmPasswordValidator} from "../../auth/registration/confirm-password.validator";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit,OnDestroy {
  @Input() user: any;
  registrationForm: FormGroup;
  private unsubscribe: Subscription[] = [];
  hasError: boolean = false;
  errorMessage:string = 'details are incorrect'
  user$: Observable<any>;
  public notifier !: NotifierService;

  constructor(private authService: AuthService,public notifierService: NotifierService) {

    this.user$ = this.authService.currentUserSubject.asObservable();

    this.notifier = notifierService;
    this.registrationForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
      city: new FormControl('', [
        Validators.required,
      ]),
      code: new FormControl('', [
        Validators.required,

      ]),
      address: new FormControl("", Validators.required),
    });

  }

  ngOnInit(): void {
    let sub = this.user$.subscribe((data:any) => {
      this.user = data;
      this.set_user_data(data)
    });
    this.unsubscribe.push(sub)
  }

  set_user_data(data:any){

    this.registrationForm.get('name')?.setValue(data.name)
    this.registrationForm.get('email')?.setValue(data.email)
    this.registrationForm.get('username')?.setValue(data.number)

  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getControlValue(controlName: string) {
    const control = this.registrationForm.get(controlName) as FormControl;
    return control.value;
  }
  submitData(){


    this.hasError = false;

    let data={
      "name": this.getControlValue('name'),
      "email": this.getControlValue('email'),
      "number":this.getControlValue('username'),
      "city": this.getControlValue('city'),
      "code": this.getControlValue('code'),
      "address": this.getControlValue('address')

    }


    const registrationSubscr = this.authService
      .updateUser(data,this.user._id)
      .pipe(first())
      .subscribe((user: any) => {
        console.log(user)
        if (user.success) {
          this.notifier.notify("success","Updated Successfully")
        //  localStorage.setItem("userData", JSON.stringify(user.success));
        //  const lsValue = localStorage.getItem("userData");
         // console.log(lsValue)
          //  this.router.navigate(['/']);
        }
        else if(user.message){
          this.hasError = true;
          this.errorMessage =  user.message;
          this.notifier.notify("error","unable to update")
        }
        else {
          this.hasError = true;
          this.errorMessage =  "something went wrong";
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }


}
