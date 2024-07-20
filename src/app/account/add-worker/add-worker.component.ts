import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {first, Observable, Subscription} from "rxjs";
import {NotifierService} from "angular-notifier";
import {AuthService} from "../../auth/services/auth.service";
import {AccountService} from "../account-services/account.service";

@Component({
  selector: 'app-add-worker',
  templateUrl: './add-worker.component.html',
  styleUrls: ['./add-worker.component.css']
})
export class AddWorkerComponent implements OnInit ,OnDestroy{

   user: any;
  registrationForm: FormGroup;
  private unsubscribe: Subscription[] = [];
  hasError: boolean = false;
  errorMessage:string = 'details are incorrect'
  user$: Observable<any>;
  public notifier !: NotifierService;
  selectedFile: File | null = null;

  constructor(private authService: AuthService,public notifierService: NotifierService,private accountService: AccountService) {

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
      age: new FormControl("", Validators.required),
      desc: new FormControl("", Validators.required),
      image: new FormControl("", Validators.required),
    });

  }

  ngOnInit(): void {
    let sub = this.user$.subscribe((data:any) => {
      this.user = data;

    });
    this.unsubscribe.push(sub)
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
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



    }
    const formData = new FormData();
    formData.append('name', this.getControlValue('name'));
    formData.append('email', this.getControlValue('email'));
    formData.append('number', this.getControlValue('username'));
    formData.append('city', this.getControlValue('city'));
    formData.append('code', this.getControlValue('code'));
    formData.append('address', this.getControlValue('address'));
    formData.append('age', this.getControlValue('age'));
    formData.append('desc', this.getControlValue('desc'));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    const sub = this.accountService
      .add_worker(formData)
      .pipe(first())
      .subscribe((user: any) => {
        console.log(user)
        if (user.success) {
          this.notifier.notify("success","Added Successfully")
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
