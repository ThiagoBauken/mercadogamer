import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { HttpService } from './http.service';
import { GlobalService } from './global.service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  moduleName = '';

  constructor(
    public global: GlobalService,
    public httpService: HttpService,
    public location: Location,
    public router: Router,
    public toastr: ToastrService,
    public socket: Socket
  ) {}

  // (+) Navigation

  navigate(endPoint = ''): void {
    // this.router.navigate(['/' + this.getModuleName() + endPoint]);
    this.navigateRoute('/' + this.getModuleName() + endPoint);
  }

  navigateRoute(route, params = {}): void {
    this.router.navigate([route], params);
  }

  // (-) Navigation

  // (+) Module name

  getModuleName(): string {
    return this.location.path().split('/')[1];
  }

  // (-) Module name

  // (+) Http

  getHttpEndPoint(): string {
    return '/' + this.getModuleName();
  }

  httpGetAll(
    endPoint = this.getHttpEndPoint(),
    filters = {},
    sort = {},
    populates = [],
    page = 0,
    perPage = 0
  ): Promise<any> {
    return this.httpService.getAll(
      endPoint,
      filters,
      sort,
      populates,
      page,
      perPage
    );
  }

  // httpRemove(item, endPoint = this.getHttpEndPoint()) {
  //   return this.httpService.remove(item, endPoint);
  // }

  // httpCreate(item, endPoint = this.getHttpEndPoint()) {
  //   return this.httpService.create(item, endPoint);
  // }

  // httpUpdate(item, endPoint = this.getHttpEndPoint()) {
  //   return this.httpService.update(item, endPoint);
  // }

  httpGetById(endPoint, id, populates = []): Promise<any> {
    return this.httpService.getById(endPoint, id, populates);
  }

  httpPut(endPoint, values): Promise<any> {
    return this.httpService.put(endPoint, values);
  }

  httpPost(endPoint, values): Promise<any> {
    return this.httpService.post(endPoint, values);
  }

  // httpPatch(values, method, endPoint = this.getHttpEndPoint()) {
  //   return this.httpService.patch(values, method, endPoint);
  // }

  httpPostFile(fileName: File): Promise<any> {
    return this.httpService.postFile(fileName);
  }

  httpDelete(endPoint): Promise<any> {
    return this.httpService.delete(endPoint);
  }

  httpGet(endPoint): Promise<any> {
    return this.httpService.get(endPoint);
  }

  // httpDelete( values, method ) {
  //   return this.httpService.delete( values, method, this.getModuleName() );
  // }

  // (-) Http

  getMessage(message): string {
    return message?.message || message;
  }

  // (+) Show messages

  showSuccess(message): void {
    this.toastr.success(this.getMessage(message));
  }

  showError(message): void {
    this.toastr.error(this.getMessage(message));
  }

  // (-) Show messages

  auth(path: string): boolean {
    for (const routeKey in this.global.settings.routes) {
      const route = this.global.settings.routes[routeKey];
      if (path === '/' + route.path) {
        if (route.data && route.data.roles) {
          const user = this.global.getUser();
          if (user) {
            const userRoles = [...(user.roles || [])];
            if (!route.data.roles.some((r) => userRoles.includes(r))) {
              return false;
            } else {
              return true;
            }
          }
        }
        return true;
      }
    }
    return true;
  }

  showImageUpload(accept = 'image/*'): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const element = document.createElement('input');
      element.type = 'file';
      element.accept = accept;
      element.onchange = () => {
        this.httpPostFile(element.files[0])
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      };
      element.click();
    });
  }
}
