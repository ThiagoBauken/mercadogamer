import { Injectable } from '@angular/core';
import { Settings } from '../app.settings';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public settings = Settings;

  public userBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public user: any;
  public objects = {};
  public objectsBehaviorSubject = {};

  constructor() {}

  // (+) User

  /**
   * Save user
   */
  saveUser(user: any): void {
    localStorage.setItem(this.settings.storage.user, JSON.stringify(user));
    localStorage.setItem(this.settings.storage.phoneNumber, user.phoneNumber);
    this.user = user;
    this.userBehaviorSubject.next(true);
  }

  /**
   * Get user
   */
  getUser(): any {
    return this.user;
  }

  /**
   * Get user
   */
  isUserLogged(): boolean {
    return this.user ? true : false;
  }

  /**
   * Remove user
   */
  removeUser(): void {
    localStorage.removeItem(this.settings.storage.user);
    localStorage.removeItem(this.settings.storage.token);
    localStorage.removeItem(this.settings.storage.phoneNumber);
    this.user = null;
    this.userBehaviorSubject.next(false);
  }

  /**
   * Get observable
   */
  getUserAsObservable(): Observable<any> {
    return this.userBehaviorSubject.asObservable();
  }

  /**
   * Check user
   */
  checkUser(): void {
    const u = localStorage.getItem(this.settings.storage.user);
    if (u) {
      this.user = JSON.parse(u);
      localStorage.setItem(
        this.settings.storage.phoneNumber,
        this.user.phoneNumber
      );

      this.userBehaviorSubject.next(true);
    } else {
      this.user = null;
      this.userBehaviorSubject.next(false);
    }
    return this.user;
  }

  // (-) User

  // (+) Storage

  /**
   * Save object
   */
  save(key, object): void {
    localStorage.setItem(key, JSON.stringify(object));
    this.objects[key] = object;
    if (!this.objectsBehaviorSubject[key]) {
      this.objectsBehaviorSubject[key] = new BehaviorSubject(true);
    } else {
      this.objectsBehaviorSubject[key].next(true);
    }
  }

  /**
   * Get object
   */
  get(key): any {
    return this.objects[key];
  }

  /**
   * Get object
   */
  exists(key): boolean {
    return this.objects[key] ? true : false;
  }

  /**
   * Remove object
   */
  remove(key): void {
    localStorage.removeItem(key);
    delete this.objects[key];
    if (this.objectsBehaviorSubject[key]) {
      this.objectsBehaviorSubject[key].next(false);
    }
  }

  /**
   * Load object
   */
  load(key): any {
    const o = localStorage.getItem(key);
    if (o) {
      this.objects[key] = JSON.parse(o);
    } else {
      delete this.objects[key];
    }
    return this.objects[key];
  }

  /**
   * Pop
   */
  pop(key): any {
    const v = this.load(key);
    this.remove(key);
    return v;
  }
  // (-) Storage

  getBackgroundUrl(url, second = ''): string {
    return `background-image:url('${environment.filesUrl}/${url}')${
      second ? `, url('${second}')` : ''
    }`;
  }
  getFullUrl(url): string {
    return `${environment.filesUrl}/${url}`;
  }
}
