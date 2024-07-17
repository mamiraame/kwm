import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {first, Observable, Subscription} from "rxjs";
import {BasicService} from "../../services/basic.service";
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

  isSticky: boolean = false;


  constructor(private authService: AuthService,private basicService: BasicService,private activeRouter:ActivatedRoute) {


    this.user$ = this.authService.currentUserSubject.asObservable();
  }


  ngOnInit(): void {
    this.get_categories();
    // deduct route change and set menu hide
    this.activeRouter.paramMap.subscribe((params: ParamMap) => {
      this.isAccount = ''
    });


    this.user$.subscribe((data:any) => {
      console.log('login user',data)
    });

  }

  get_categories(){
    const sub = this.basicService.get_categories()
      .pipe(first())
      .subscribe((res: any) => {
        if (res.success) {
          for (var key in res.success){
              this.categories.push(res.success[key])
          }

        }
      })
    this.unsubscribe.push(sub);

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
