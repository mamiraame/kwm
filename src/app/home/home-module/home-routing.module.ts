import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home.component';
import { SharedModule } from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {NotifierModule} from "angular-notifier";



const routes: Routes = [

];




@NgModule({
    declarations: [HomeComponent],
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes), SharedModule, CommonModule, NotifierModule]
})
export class HomeRoutingModule { }
