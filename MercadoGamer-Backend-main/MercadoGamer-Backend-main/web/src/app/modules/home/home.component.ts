import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageService } from '../../core/page.service';
import { BaseComponent } from 'src/app/core/base.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('finish') finishModal: ElementRef;

  desktopBanners: { [k: string]: any }[];
  mobileBanners: { [k: string]: any }[];
  platforms: { [k: string]: any }[];
  featuredProducts: { [k: string]: any }[];
  gameCatalogues: { [k: string]: any }[];
  giftCards: { [k: string]: any }[];
  bestSellers: { [k: string]: any }[];
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  bestSellersPage = 1;
  giftCardsPage = 1;
  bestSellersPages = 1;
  giftCardsPages = 1;
  public slides = [];
  showModal = true;
  closeResult = 'Dismissed';

  public slideConfig: any = {
    slidesToShow: 1.67,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 841,
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  };
  public tendencias: { [k: string]: any }[] = [{}, {}, {}, {}];
  public juegos: { [k: string]: any }[] = [{}, {}, {}, {}];
  public skins: { [k: string]: any }[] = [{}, {}, {}, {}];

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
    super(
      formBuilder,
      activatedRoute,
      modalService,
      pageService,
      sanitizer,
      deviceService,
      router,
      matIconRegistry
    );
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.setCarouselMobileResponsive();
    });
  }

  // openModal(content): void {
  //   this.close();
  //   this.openModal(this.finishModal);
  // }

  ngOnInit(): void {
    // tslint:disable-next-line: variable-name
    const app_version = localStorage.getItem(this.settings.storage.app_version);
    if (app_version !== this.settings.APP_VERSION) {
      localStorage.setItem(
        this.settings.storage.app_version,
        this.settings.APP_VERSION
      );
      window.location.reload();
    } else {
      this.getBanners();
      this.getPlatforms();
      this.getBestSellers();
      this.getFeaturedProducts();
      this.getGiftCards();
      this.getBestSellers();
      this.setCarouselMobileResponsive();
      this.getProductsForHomepage();
    }
  }

  addSlide(): void {
    this.slides.push('http://placehold.it/350x150/777777');
  }

  removeSlide(): void {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e): void {
    console.log('slick initialized');
  }

  breakpoint(e): void {
    console.log('breakpoint');
  }

  afterChange(e): void {
    console.log('afterChange');
  }

  beforeChange(e): void {
    console.log('beforeChange');
  }

  /**
   *  Change config of Carousel for Mobile responsive
   */
  setCarouselMobileResponsive(): void {
    if (this.deviceService.isMobile() || window.innerWidth < 1200) {
      this.slides = [
        'assets/imgs/demo-product/carousel-demo-mobile.png',
        'assets/imgs/demo-product/carousel-demo-mobile.png',
        'assets/imgs/demo-product/carousel-demo-mobile.png',
        'assets/imgs/demo-product/carousel-demo-mobile.png',
      ];
    } else {
      this.slides = [
        'assets/imgs/demo-product/carousel-demo.png',
        'assets/imgs/demo-product/carousel-demo.png',
        'assets/imgs/demo-product/carousel-demo.png',
        'assets/imgs/demo-product/carousel-demo.png',
      ];
    }
  }
  isMobile(): boolean {
    if (this.deviceService.isMobile()) {
      return true;
    } else {
      return false;
    }
  }

  private getBestSellers(): void {
    const endPoint = this.settings.endPoints.products;
    const filters = {
      status: this.settings.products.status.approved.code,
      enabled: true,
    };

    this.pageService
      .httpGetAll(endPoint, filters, { sold: -1 }, [], this.bestSellersPage, 6)
      .then((res) => {
        this.bestSellers = this.getRandomArrayElements(res.data, 4);
        this.bestSellersPages = res.pages;
      })
      .catch((e) => this.pageService.showError(e));
  }

  private getGiftCards(): void {
    const endPoint = this.settings.endPoints.products;
    const filters = {
      status: this.settings.products.status.approved.code,
      type: this.settings.products.type.giftCard.code,
      stock: { $gt: 0 },
      enabled: true,
    };

    this.pageService
      .httpGetAll(endPoint, filters, { priority: 1 }, [], this.giftCardsPage, 6)
      .then((res) => {
        this.giftCards = this.getRandomArrayElements(res.data, 4);
        this.giftCardsPages = res.pages;
      })
      .catch((e) => this.pageService.showError(e));
  }

  private getFeaturedProducts(): void {
    const endPoint = this.settings.endPoints.products;
    const filters = {
      featured: true,
    };
    const populates = ['game'];
    console.log(endPoint, filters, populates);
    this.pageService
      .httpGetAll(endPoint, filters, {}, populates, 1, 10)
      .then((res) => {
        this.featuredProducts = this.getRandomArrayElements(res.data, 4);
        this.gameCatalogues = res.data;
      })
      .catch((e) => this.pageService.showError(e));
  }

  getBanners(): void {
    const endPoint = this.settings.endPoints.banners;

    this.pageService
      .httpGetAll(endPoint)
      .then((res) => {
        this.mobileBanners = res.data.filter((item) => item.isMobile);
        this.desktopBanners = res.data.filter((item) => !item.isMobile);
      })
      .catch((e) => this.pageService.showError(e));
  }

  getPlatforms(): void {
    const endPoint = this.settings.endPoints.platforms;
    const filters = {
      enabled: true,
    };
    const populates = [];

    this.pageService
      .httpGetAll(endPoint, filters, {}, populates, 1, 6)
      .then((res) => (this.platforms = res.data))
      .catch((e) => this.pageService.showError(e));
  }

  handlePlatform(id: string): void {
    this.pageService.navigateRoute('catalogue/platform/' + id);
  }

  goToProductDetail(event: MouseEvent, id: string): void {
    if (event.which === 2) {
      window.open(`/product-detail/${id}`);
    } else {
      this.pageService.navigateRoute(`product-detail/${id}`);
    }
  }

  previousPageGiftCards(): void {
    this.giftCardsPage--;
    this.getGiftCards();
  }

  nextPageGiftCards(): void {
    this.giftCardsPage++;
    this.getGiftCards();
  }

  previousPageBestSellers(): void {
    this.bestSellersPage--;
    this.getBestSellers();
  }

  nextPageBestSellers(): void {
    this.bestSellersPage++;
    this.getBestSellers();
  }

  goToCatalogue(id: string): void {
    this.pageService.navigateRoute('catalogue/game/' + id);
  }

  goToProduct(event: MouseEvent, id: string): void {
    if (event.which === 2) {
      window.open(`/product-detail/${id}`);
    } else {
      this.pageService.navigateRoute(`product-detail/${id}`);
    }
  }

  private getProductsForHomepage(): void {
    const endPoint = this.settings.endPoints.homeProducts;
    const populates = ['product'];
    this.pageService
      .httpGetAll(endPoint, {}, {}, populates)
      .then((res) => {
        res.data?.forEach((item) => {
          switch (item.sectionId) {
            case 'tendencia':
              this.tendencias[item.orderId] = item;
              break;
            case 'skin':
              this.skins[item.orderId] = item;
              break;
            case 'juego':
              this.juegos[item.orderId] = item;
              break;
          }
        });
      })
      .catch((e) => this.pageService.showError(e));
  }

  ngOnDestroy(): void {
    // Limpar subscription para prevenir memory leaks
    if (this.resizeSubscription$) {
      this.resizeSubscription$.unsubscribe();
    }
  }
}
