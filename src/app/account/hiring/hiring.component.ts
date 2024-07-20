import {Component, OnDestroy, OnInit} from '@angular/core';
import {first, Observable, Subscription} from "rxjs";
import {NotifierService} from "angular-notifier";
import {AuthService} from "../../auth/services/auth.service";
import {AccountService} from "../account-services/account.service";

@Component({
  selector: 'app-hiring',
  templateUrl: './hiring.component.html',
  styleUrls: ['./hiring.component.css']
})
export class HiringComponent implements OnInit,OnDestroy {



  user: any;

  private unsubscribe: Subscription[] = [];
  hasError: boolean = false;
  user$: Observable<any>;
  public notifier !: NotifierService;
  Messages: any[] = []

  constructor(private authService: AuthService,public notifierService: NotifierService,private accountService: AccountService,) {

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
    this.Messages = []
    const sub = this.accountService.get_all_message().pipe(first()).subscribe((user: any) => {
      if (user.success) {
        this.Messages = user.success
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





}
