import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {first, Subject, Subscription} from "rxjs";
import {BasicService} from "../services/basic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalService} from "ngx-bootstrap/modal";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class HomeComponent implements OnInit,OnDestroy {
  @ViewChild('content') content: any;
  @ViewChild('ModalQuickview',{static:false}) ModalQuickview?: ElementRef;
  modalData:any = {}
  formModal:any


  modalProduct = new Subject<any>();
  modalProduct$ = this.modalProduct.asObservable();

  homeProducts = new Subject<any>()
  homeProducts$ = this.homeProducts.asObservable();

  buyerQuantity = 1

  private unsubscribe: Subscription[] = [];
  public notifier !: NotifierService;

  products:any[]=[]
  @ViewChild('mode') mode: any;
  constructor(public notifierService: NotifierService,private modalServices: NgbModal,private basicService: BasicService,private router: Router,  private route: ActivatedRoute,) {
    this.notifier = notifierService;
  }

  ngOnDestroy(): void {
       this.modalProduct.complete();
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

  ngOnInit(): void {
    this.get_home_product();

  }

  get_home_product(){
    const sub = this.basicService.get_home_products()
      .pipe(first())
      .subscribe((res: any) => {
        if (res.success) {
          this.products = res.success.data;
          this.homeProducts.next(res.success.data)
        }
      })
    this.unsubscribe.push(sub);

  }

  public openModalQuick = () => {
    if (this.ModalQuickview?.nativeElement) {
      (this.ModalQuickview.nativeElement as HTMLElement).style.display = 'block';
      document.body.classList.add('modal-open');
    }
    // this.modalServices.open(this.mode);
  }
  public closeModalQuick = () => {
    if (this.ModalQuickview?.nativeElement) {
      (this.ModalQuickview.nativeElement as HTMLElement).style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  receiveDataFromChild= (data:any) =>  {

    this.modalData = data
    this.modalProduct.next(data);
    this.openModalQuick()
  }
  increaseQuantity(qty:number){
    if(this.buyerQuantity  <= qty ){
      this.buyerQuantity++
    }

  }
  decreaseQuantity(){
    if (this.buyerQuantity > 1) {
      this.buyerQuantity--;
    }
  }

}
