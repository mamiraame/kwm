import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {BsModalRef} from "ngx-bootstrap/modal";
import {AccountService} from "../account-services/account.service";
import {AuthService} from "../../auth/services/auth.service";

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit,OnDestroy {
  pageType : string = 'address'
  user$: Observable<any>;
  modalRef?: BsModalRef;
  public notifier !: NotifierService;
  private unsubscribe: Subscription[] = [];
  user:any
  isLoading = {
    loadingUpdateProfile: false,
  };
  constructor(public notifierService: NotifierService,private router: Router, private route: ActivatedRoute ,private accountService: AccountService,
              private authService: AuthService,) {
    this.user$ = this.authService.currentUserSubject.asObservable();
    this.notifier = notifierService;
  }

  ngOnInit(): void {
    let sub = this.user$.subscribe((data:any) => {
      console.log('user account',data)
      this.user = data.user;
    });
    this.unsubscribe.push(sub)
   this.getLastUrlSegment()
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  changePage(page:string){
    this.pageType = page
    this.router.navigate(['/user/', page]);
  }
  isActive(index: string) {
    return this.pageType === index;
  }
  getLastUrlSegment() {


    this.route.paramMap.subscribe((params: ParamMap) => {
      let page  = params.get('page');
      console.log('current page',page)
      if(page != null ){
        this.changePage(page)
      }else {
        // default page is account
      }

    });



  }


}
