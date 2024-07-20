import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserAccountComponent} from "./user-account/user-account.component";



const routes: Routes = [
  {
    path:':page',
    component:UserAccountComponent
  },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
