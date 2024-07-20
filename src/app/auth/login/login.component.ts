import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {first, Subscription} from "rxjs";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hasError: boolean = false;
  errorMessage: string = 'The login details are incorrect'
  isLoading = {
    loadingLogin: false,
  };
  private unsubscribe: Subscription[] = [];

  constructor(private authService: AuthService, private router: Router) {

    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
      ]),

      agree: new FormControl(true, Validators.required),
    });

  }


  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getControlValue(controlName: string) {
    const control = this.loginForm.get(controlName) as FormControl;
    return control.value;
  }

  submitData() {

    this.isLoading.loadingLogin = true


    let data = {
      "email": this.getControlValue('username'),
      "password": this.getControlValue('password'),
    }

    const loginSub = this.authService.login(data.email, data.password)
      .pipe(first())
      .subscribe((user: any) => {
        console.log(user)
        this.isLoading.loadingLogin = false
        if (user.success) {
          this.authService.setCurrentUserValue(user.success);
          localStorage.setItem("userData", JSON.stringify(user.success));
          this.router.navigate(['/user/account']);
        } else if(user.message){
          this.hasError = true;
          this.errorMessage =  user.message;
        }
        else  {
          this.hasError = true;
          this.errorMessage =  "something went wrong";
        }
      });
    this.unsubscribe.push(loginSub);
  }

}
