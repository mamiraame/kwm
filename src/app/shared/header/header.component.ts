import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {first, Observable, Subscription} from "rxjs";
import {AuthService} from "../../auth/services/auth.service";
import {ActivatedRoute, ParamMap} from "@angular/router";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  private unsubscribe: Subscription[] = [];
  categories:any[]=[]
  cartCount:number=0
  isAccount:string = ''

  user$: Observable<any>;
  user:any
  isSticky: boolean = false;


  constructor(private authService: AuthService,private activeRouter:ActivatedRoute) {
    this.user$ = this.authService.currentUserSubject.asObservable();
  }


  ngOnInit(): void {

    // deduct route change and set menu hide
    this.activeRouter.paramMap.subscribe((params: ParamMap) => {
      this.isAccount = ''
    });


   const  sub = this.user$.subscribe((data:any) => {
     this.user = data
    });
   this.unsubscribe.push(sub)

  }



  accountModel(){
    this.isAccount = this.isAccount === 'dropdown-open' ? '' : 'dropdown-open';
  }


  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.isAccount = ''
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isSticky = offset > 100; // Adjust this value as needed
  }


}
