import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const invert = route.data?.['invert'];
    const currentUser = this.authService.currentUserValue;
    if(invert){
      if (currentUser) {
        // logged in so return true but we need opposite
        console.log("login usreeee when inert")
        return false;
      }
    }else {
      if (currentUser) {
        // logged in so return true
        console.log("login usreeee no invert")
        return true;
      }
    }

    console.log(" not login usreeee")
    // not logged in
    return !!(invert);
  }
}
