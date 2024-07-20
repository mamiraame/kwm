import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {first, Subject, Subscription} from "rxjs";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class HomeComponent implements OnInit,OnDestroy {



  private unsubscribe: Subscription[] = [];
  public notifier !: NotifierService;

  constructor(public notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  ngOnDestroy(): void {

    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

  ngOnInit(): void {


  }



}
