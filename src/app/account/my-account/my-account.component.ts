import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  @Input() user: any;
  constructor() { }

  ngOnInit(): void {
  }

}
