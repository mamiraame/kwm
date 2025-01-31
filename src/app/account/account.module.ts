import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {AccountRoutingModule} from "./account-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UserAccountComponent } from './user-account/user-account.component';

import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import { MyAccountComponent } from './my-account/my-account.component';

import {ModalModule} from "ngx-bootstrap/modal";
import {NotifierModule, NotifierOptions} from "angular-notifier";
import { CustomersComponent } from './customers/customers.component';
import { WorkersComponent } from './workers/workers.component';
import { AddWorkerComponent } from './add-worker/add-worker.component';
import { HiringComponent } from './hiring/hiring.component';
const notifierDefaultOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12,
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: false,
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease',
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};




@NgModule({
  declarations: [


    UserAccountComponent,

        MyAccountComponent,
         CustomersComponent,
         WorkersComponent,
         AddWorkerComponent,
         HiringComponent,


  ],
  imports: [
    CommonModule,
    RouterModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ModalModule,
    NotifierModule.withConfig(notifierDefaultOptions),
  ]
})
export class AccountModule { }
