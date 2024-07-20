import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './shared/contact/contact.component';
import { HomeComponent } from './home/home.component';

import {AuthGuard} from "./auth/services/auth.guard";
import {AboutComponent} from "./about/about.component";
import {MaidsComponent} from "./maids/maids.component";

const routes: Routes = [

  {
    path:'contact',
    component:ContactComponent
  },
  {
    path:'about',
    component:AboutComponent
  },
  {
    path:'maids',
    component:MaidsComponent
  },
  {
    path:"",
    component: HomeComponent,
    loadChildren:()=>import("./home/home-module/home.module")
    .then(m => m.HomeModule)
  },
  {
    path:"home",
    component: HomeComponent,
    loadChildren:()=>import("./home/home-module/home.module")
    .then(m => m.HomeModule)
  },


  {
    path:'auth',
    loadChildren:()=>import("./auth/auth.module")
      .then(m=>m.AuthModule)
  },
  {
    path:'user',
    loadChildren:()=>import("./account/account.module")
      .then(m=>m.AccountModule)
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
