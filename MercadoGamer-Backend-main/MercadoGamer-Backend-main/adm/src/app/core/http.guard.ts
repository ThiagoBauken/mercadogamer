import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class HttpGuard implements CanActivate {

  constructor(
    private global: GlobalService
  ) {
    this.global.checkUser();
  }

  /**
   * Can activate
   */
  canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise(async (resolve) => {
      const user = this.global.getUser();
      if (user) {
        const userRoles = [...user.roles || []];
        if (!next.data.roles.some(r => userRoles.includes(r))) {
          resolve(false);
        } else {
          resolve(true);
        }
      } else {
        resolve(false);
      }
    });
  }
}
