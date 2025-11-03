import { OnInit, Directive } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from './page.service';
import { environment } from '../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormPage } from './form.page';
import { DomSanitizer } from '@angular/platform-browser';
import localeUS from '@angular/common/locales/es-US';
import { registerLocaleData } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { Settings } from '../app.settings';
import { GlobalService } from './global.service';
registerLocaleData(localeUS, 'es-US');

@Directive({})
// tslint:disable-next-line: directive-class-suffix
export class BaseComponent extends FormPage implements OnInit {
  filesUrl = environment.filesUrl + '/';

  user: any;
  country: any = {};
  settings: typeof Settings;
  global: GlobalService;
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  deviceInfo = {
    isDesktop: true,
    isMobile: false,
    isTablet: false,
    'max-1999': true,
    'max-1080': false,
    'max-1024': false,
    'max-767': false,
    'max-611': false,
    'max-599': false,
  };

  public globalPage = 1;

  constructor(
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
    public pageService: PageService,
    public sanitizer: DomSanitizer,
    public deviceService: DeviceDetectorService,
    public router: Router,
    public matIconRegistry: MatIconRegistry
  ) {
    super(formBuilder);
    this.global = this.pageService.global;
    this.settings = this.pageService.global.settings;
    this.checkUser();
    this.getDeviceInfo();
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.getDeviceInfo();
    });

    const navIcons = [
      'home',
      'category',
      'vender',
      'compras',
      'compras_new',
      'ventas',
      'ventas_new',
      'dolar',
      'productos',
      'productos_new',
      'consultas',
      'retirar',
      'tickets',
      'ajustes',
      'preguntas',
      'gift',
      'resumen',
      'cube-outline',
      'other-filled',
      'comment',
      'security_new',
      'notification-answered',
      'notification-product-approved',
      'notification-product-rejected',
      'notification-purchase-completed',
      'notification-purchase-processing',
      'notification-question',
      'notification-sale-completed',
      'notification-sale-received',
      'notification-withdrawal-approved',
      'notification-claim-received',
    ];
    navIcons.forEach((el) =>
      this.matIconRegistry.addSvgIcon(
        el,
        this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${el}.svg`)
      )
    );
    window.scroll(0, 0);
  }

  onSubmitPerform(item): void {}

  getDeviceInfo(): void {
    this.deviceInfo = {
      isDesktop: this.deviceService.isDesktop(),
      isMobile: this.deviceService.isMobile(),
      isTablet: this.deviceService.isTablet(),
      'max-1999': window.innerWidth < 2000,
      'max-1080': window.innerWidth < 1081,
      'max-1024': window.innerWidth < 1025,
      'max-767': window.innerWidth < 768,
      'max-611': window.innerWidth < 612,
      'max-599': window.innerWidth < 600,
    };
  }

  public getRandomArrayElements(arr: Array<any>, n: number): any {
    const result = new Array(n);
    let len = arr.length;
    const taken = new Array(len);
    if (n >= len) {
      return arr;
    }
    // if (n > len)
    //     throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      const x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  checkUser(): void {
    this.global.getUserAsObservable().subscribe((res) => {
      this.user = this.global.getUser();
      this.country = this.global.load(this.settings.storage.country);
    });
    this.global.checkUser();
  }

  routeNavigate(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit(): void {}

  openModal(content): void {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  close(): void {
    this.modalService.dismissAll();
  }
}
