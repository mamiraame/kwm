import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";
import {AuthGuard} from "./services/auth.guard";

const routes: Routes = [
  {
    path:'login',
    canActivate:[AuthGuard],
    data: {
      invert: true // auth guard return true mean user is login now invert make it false to not open path
    },
    component:LoginComponent
  },
  {
    path:'registration',
    component:RegistrationComponent
  },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
