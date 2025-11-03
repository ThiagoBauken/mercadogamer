import {
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { GlobalService } from './core/global.service';
import {
  ChildActivationEnd,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { PageService } from './core/page.service';
import * as moment from 'moment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NavService } from './modules/shared/nav.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  logged: boolean;
  user: any;
  settings: any;
  deviceInfo = null;
  country: { [k: string]: any };
  topMenu: boolean;
  footer: boolean;
  currencyUpdated: boolean;
  subscription: any;
  isMobile: any;
  isTablet: any;
  search: string;
  isDesktopDevice: any;
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  openSidebar = false;
  defaultCountry: any = {};

  @ViewChild('snav') snav: ElementRef;

  constructor(
    public global: GlobalService,
    public pageService: PageService,
    public routerModule: RouterModule,
    private breakpointObserver: BreakpointObserver,
    public location: Location,
    private deviceService: DeviceDetectorService,
    private router: Router,
    private navService: NavService,
    public sanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry
  ) {
    router.events.subscribe((event: any) => {
      if (
        event instanceof NavigationEnd ||
        event instanceof ChildActivationEnd
      ) {
        // tslint:disable-next-line: variable-name
        const app_version = localStorage.getItem(
          this.global.settings.storage.app_version
        );
        if (app_version !== this.global.settings.APP_VERSION) {
          this.global.removeUser();
          if (!/\/home/g.test(this.router.url)) {
            this.pageService.navigateRoute('home');
          }
        }
        const scrollElem = document.querySelector('#moveTop');
        scrollElem.scroll(0, 0);
        window.scroll(0, 0);
      }
    });

    // Moment configuration
    moment.locale('es');

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
      'modal-close',
      'logo-mg',
    ];
    svgIcons.forEach((el) =>
      this.matIconRegistry.addSvgIcon(
        el,
        this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${el}.svg`)
      )
    );
    // (+) User
    // this.epicFunction();
  }
  async ngOnInit(): Promise<void> {
    this.country = this.global.load(this.global.settings.storage.country);
    if (!this.country) {
      await this.getCountries();
    }

    this.global.getUserAsObservable().subscribe(async (result) => {
      this.user = this.global.getUser();
      this.country = this.global.load(this.global.settings.storage.country);

      const disabledTopMenuPaths = [
        '',
        '/select-country',
        '/register',
        '/login',
        '/mobile',
        '/recover-password',
      ];
      const disabledFooterPaths = [
        '',
        '/select-country',
        '/mobile',
        '/recover-password',
      ];

      this.topMenu = !disabledTopMenuPaths.includes(this.location.path());
      this.footer = !disabledFooterPaths.includes(this.location.path());
      if (this.user) {
        if (!this.logged) {
          this.pageService.socket.connect();
          this.handleSockets();
        }

        this.logged = true;
      }
      // if (this.isMobile) return pageService.navigateRoute('/mobile');
      if (!this.country) {
        // return pageService.navigateRoute('/select-country');
        return await this.getCountries();
      }
      if (!this.currencyUpdated) {
        return this.updateCurrency();
      }

      this.pageService.navigateRoute(this.location.path());
    });

    this.global.checkUser();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    this.navService.snav = this.snav;
  }

  async getCountries(): Promise<void> {
    try {
      const endPoint = this.global.settings.endPoints.countries;
      const res = await this.pageService.httpGet(endPoint);
      this.defaultCountry = res.data.find(
        (item) => !!item.picture && item.name === 'Argentina'
      );
      this.global.save(
        this.global.settings.storage.country,
        this.defaultCountry
      );
      this.pageService.navigateRoute(this.location.path());
    } catch (error) {
      this.pageService.showError(error);
    }
  }

  handleSockets(): void {
    this.pageService.socket.emit(
      this.global.settings.socket.login,
      this.user.id
    );

    this.pageService.socket.on(
      this.global.settings.socket.updateUser,
      (user) => {
        this.global.saveUser(user);
      }
    );

    this.pageService.socket.on(
      this.global.settings.socket.notification,
      (notification) => {
        this.global.save(
          this.global.settings.storage.notifications,
          notification
        );
      }
    );

    this.pageService.socket.on('test-socket', (a) => {
      console.log(a, 'socket receiver');
    });
  }

  getResize(): boolean {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      return true;
    } else {
      return false;
    }
  }

  updateCurrency(): void {
    const endPoint = this.global.settings.endPoints.countries;

    this.pageService
      .httpGetById(endPoint, this.country.id)
      .then((res) =>
        this.global.save(this.global.settings.storage.country, res.data)
      )
      .catch((e) => console.error(e))
      .finally(() => (this.currencyUpdated = true));
  }

  searchCatalogue(): void {
    this.pageService.navigateRoute(
      this.search ? 'catalogue/search/' + this.search : 'catalogue'
    );
    this.navService.closeNav();
  }
}
