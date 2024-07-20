import {Component, OnDestroy, OnInit} from '@angular/core';
import {first, Observable, Subscription} from "rxjs";
import {NotifierService} from "angular-notifier";
import {AuthService} from "../../auth/services/auth.service";
import {AccountService} from "../account-services/account.service";

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css']
})
export class WorkersComponent implements OnInit,OnDestroy {


  user: any;

  private unsubscribe: Subscription[] = [];
  hasError: boolean = false;
  user$: Observable<any>;
  public notifier !: NotifierService;
  userList: any[] = []

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
  delete_user(id: any) {
    const confirmation = confirm('Are you sure you want to delete this user?');
    if (confirmation) {
      const sub = this.accountService.deleteWorker(id).pipe(first()).subscribe((user: any) => {
        console.log(user)
        if (user.success) {
          this.notifier.notify("success",user.success)
          this.get_all_users()
        }
        else if(user.message){
          this.notifier.notify("error",user.message)
        }
        else {

          this.notifier.notify("error","unable to delete")
        }
      });
      this.unsubscribe.push(sub);
    } else {
      // User cancelled, do nothing
      console.log('Deletion cancelled');
    }
  }



}
