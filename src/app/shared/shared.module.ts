import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';


import {NotifierModule} from "angular-notifier";
import {ContactComponent} from "./contact/contact.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        ContactComponent
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
    ],
  imports: [
    CommonModule,
    RouterModule,
    NotifierModule,
    ReactiveFormsModule,


  ]
})
export class SharedModule { }
