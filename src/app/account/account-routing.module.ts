import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserAccountComponent} from "./user-account/user-account.component";
import {UserSettingComponent} from "./user-setting/user-setting.component";



const routes: Routes = [
  {
    path:':page',
    component:UserAccountComponent
  },
  {
    path:'setting',
    component:UserSettingComponent
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
