import { Component, OnInit } from '@angular/core';
import {first, Observable, Subscription} from "rxjs";
import {NotifierService} from "angular-notifier";
import {AuthService} from "../auth/services/auth.service";
import {AccountService} from "../account/account-services/account.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-maids',
  templateUrl: './maids.component.html',
  styleUrls: ['./maids.component.css']
})
export class MaidsComponent implements OnInit {



  user: any;

  private unsubscribe: Subscription[] = [];
  hasError: boolean = false;
  user$: Observable<any>;
  public notifier !: NotifierService;
  userList: any[] = []

  constructor(private authService: AuthService,public notifierService: NotifierService,private accountService: AccountService,private router: Router) {

    this.user$ = this.authService.currentUserSubject.asObservable();

    this.notifier = notifierService;

  }

  ngOnInit(): void {
    let sub = this.user$.subscribe((data:any) => {
      this.user = data;
      this.get_all_users()
    });
    this.unsubscribe.push(sub)
  }



  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  get_all_users(){
    this.userList = []
    const sub = this.accountService.get_all_workers().pipe(first()).subscribe((user: any) => {

      if (user.success) {

        this.userList = user.success
      }
      else if(user.message){

        this.notifier.notify("error",user.message)
      }
      else {

        this.notifier.notify("error","unable to load customers")
      }
    });
    this.unsubscribe.push(sub);
  }




  submitData(worker:any){

    if(!this.user){
      this.router.navigate(['/auth/login']);
    }

    let data = {
      'name': this.user.name,
      'number': this.user.number,
      'desc': "Your worker ( " + worker.name + ', ' + worker.number + ', '+ worker.email + ' ) is available to work',
      'email': this.user.email,
      'page': 'Maids',
      'user_id': this.user._id,
      'worker_id': worker._id,
    }

    const sub = this.accountService
      .add_contact_us(data)
      .pipe(first())
      .subscribe((user: any) => {
        console.log(user)
        if (user.success) {
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
