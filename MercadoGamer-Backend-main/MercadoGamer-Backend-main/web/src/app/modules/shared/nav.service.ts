import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class NavService {
  public snav: any;

  constructor() {
  }

  public closeNav() {
    this.snav.close();
  }

  public openNav() {
    this.snav.open();
  }
}
