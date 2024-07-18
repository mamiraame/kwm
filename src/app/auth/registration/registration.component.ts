import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {first, Observable, Subscription} from "rxjs";
import {ConfirmPasswordValidator} from "./confirm-password.validator";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  registrationForm: FormGroup;
  private unsubscribe: Subscription[] = [];
  hasError: boolean = false;
  errorMessage:string = 'The registration details are incorrect'

  constructor(private authService: AuthService,) {




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
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
      ]),
      cPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
      ]),
      agree: new FormControl(true, Validators.required),
    });

// Add the custom validator after creating the form group
    this.registrationForm.setValidators(ConfirmPasswordValidator.MatchPassword);
  }

  ngOnInit(): void {

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
      "password": this.getControlValue('password'),

    }


    const registrationSubscr = this.authService
      .registration(data)
      .pipe(first())
      .subscribe((user: any) => {
        console.log(user)
        if (user.success) {
          localStorage.setItem("userData", JSON.stringify(user.success));
          const lsValue = localStorage.getItem("userData");
          console.log(lsValue)
        //  this.router.navigate(['/']);
        }
        else if(user.message){
          this.hasError = true;
          this.errorMessage =  user.message;
        }
        else {
          this.hasError = true;
          this.errorMessage =  "something went wrong";
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }

}
