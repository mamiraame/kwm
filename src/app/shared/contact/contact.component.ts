import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {first, Observable, Subscription} from "rxjs";
import {NotifierService} from "angular-notifier";
import {AccountService} from "../../account/account-services/account.service";
import {AuthService} from "../../auth/services/auth.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit,OnDestroy {

  registrationForm: FormGroup;
  private unsubscribe: Subscription[] = [];
  public notifier !: NotifierService;
  user: any;
  user$: Observable<any>;
  hasError: boolean = false;
  errorMessage:string = 'details are incorrect'

  constructor(private authService: AuthService,public notifierService: NotifierService,private accountService: AccountService) {
    this.user$ = this.authService.currentUserSubject.asObservable();

    this.notifier = notifierService;
    this.registrationForm = new FormGroup({
      fName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      lName: new FormControl('', [
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
      number: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
      desc: new FormControl("", Validators.required),
    });

  }
  ngOnInit(): void {
    let sub = this.user$.subscribe((data:any) => {
      this.user = data;

    });
    this.unsubscribe.push(sub)
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getControlValue(controlName: string) {
    const control = this.registrationForm.get(controlName) as FormControl;
    return control.value;
  }
  submitData(){

    let fName = this.getControlValue('fName')
    let lName = this.getControlValue('lName')
    let name = fName + ' '+ lName




    let data = {
      'name': name,
      'number':this.getControlValue('number'),
      'desc': this.getControlValue('desc'),
      'email': this.getControlValue('email'),
      'page': 'Contact us'
    }

    const sub = this.accountService
      .add_contact_us(data)
      .pipe(first())
      .subscribe((user: any) => {
        console.log(user)
        if (user.success) {
          // Reset the form after successful submission
          this.registrationForm.reset();
          this.notifier.notify("success","Sent Successfully")
        }
        else if(user.message){
          this.notifier.notify("error",user.message)
        }
        else {
          this.notifier.notify("error","unable to create")
        }
      });
    this.unsubscribe.push(sub);
  }

}
