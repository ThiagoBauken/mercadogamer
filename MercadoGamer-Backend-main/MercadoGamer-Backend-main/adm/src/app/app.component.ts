import { Component } from '@angular/core';
import { GlobalService } from './core/global.service';
import { RouterModule } from '@angular/router';
import { PageService } from './core/page.service';
import * as moment from 'moment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  logged: boolean;
  user: any;
  settings: any;
  country: { [k: string]: any };
  topMenu: boolean;
  footer: boolean;
  currencyUpdated: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    public global: GlobalService,
    public pageService: PageService,
    public routerModule: RouterModule,
    private breakpointObserver: BreakpointObserver,
    public location: Location,
    public sanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry
  ) {
    const svgIcons = [
      'complaint',
      'order-cancelled',
      'trash',
      'pencil',
      'security',
      'home',
      'category',
      'vender',
      'compras',
      'ventas',
      'dolar',
      'productos',
      'consultas',
      'retirar',
      'tickets',
      'ajustes',
      'preguntas',
      'search',
      'bell',
      'user',
      'user-menu-shopping',
      'user-menu-setting',
      'user-menu-exit',
      'arrow-right',
      'close',
      'game',
      'delivery-automatic',
      'delivery-coordinate',
      'shopping-cart',
      'invoice',
      'package-box',
      'money-withdrawal',
      'product-type',
      'windows',
      'juegos',
      'compras_new',
      'ventas_new',
      'security_new',
      'productos_new',
      'bill',
      'adm-ticket',
      'personalize',
      'feedback',
      'statistics',
      'discount',
      'profit',
      'filter',
      'admin-user',
      'file',
      'search-keyword',
    ];
    svgIcons.forEach((el) =>
      this.matIconRegistry.addSvgIcon(
        el,
        this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${el}.svg`)
      )
    );
    // (+) User

    this.global.getUserAsObservable().subscribe((result) => {
      this.user = global.getUser();
      // this.country = global.load(global.settings.storage.country);

      // const disabledTopMenuPaths = ['/select-country', '/register', '/login'];
      // const disabledFooterPaths = ['/select-country', '/register', '/login'];

      // this.topMenu = (!disabledTopMenuPaths.includes(this.location.path()));
      // this.footer = (!disabledFooterPaths.includes(this.location.path()));

      if (!this.user) {
        pageService.navigateRoute('/login');
      } else {
        if (!this.logged) {
          this.pageService.socket.connect();
          this.pageService.socket.emit(
            this.global.settings.socket.login,
            this.user.id
          );
        }
        // if (!this.currencyUpdated) this.updateCurrency()
        pageService.navigateRoute(this.location.path());
      }
    });
    this.global.checkUser();

    // (-) User
  }

  // updateCurrency() {
  //   const endPoint = this.global.settings.endPoints.countries;

  //   this.pageService.httpGetById(endPoint, this.country.id)
  //   .then(res => this.global.save(this.global.settings.storage.country, res.data))
  //   .catch(e => console.error(e))
  //   .finally(() => this.currencyUpdated = true);
  // }
}
