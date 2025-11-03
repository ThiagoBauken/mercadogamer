import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-personalize',
  templateUrl: './personalize.component.html',
  styleUrls: ['./personalize.component.scss'],
})
export class PersonalizeComponent extends BaseComponent {
  search: string;
  mobileBanners: { [k: string]: any }[];
  desktopBanners: { [k: string]: any }[];
  featuredProducts: { [k: string]: any }[];
  productsFound: { [k: string]: any }[];
  public tendencias: { [k: string]: any }[] = [{}, {}, {}, {}];
  public juegos: { [k: string]: any }[] = [{}, {}, {}, {}];
  public skins: { [k: string]: any }[] = [{}, {}, {}, {}];
  public bannerType: string = 'desktop';

  ngOnInit() {
    this.getItems();
    this.getFeaturedProducts();
    this.getProductsForHomepage();
  }

  getItems() {
    const endPoint = this.settings.endPoints.banners;

    this.pageService
      .httpGetAll(endPoint, {}, { createdAt: -1 }, [])
      .then((res) => {
        this.desktopBanners = res.data.filter((item) => !item.isMobile);
        this.mobileBanners = res.data.filter((item) => item.isMobile);
        this.totalPages = res.pages;
      })
      .catch((e) => this.pageService.showError(e));
  }

  getFeaturedProducts() {
    const endPoint = this.settings.endPoints.products;

    this.pageService
      .httpGetAll(endPoint, { featured: true }, {}, ['game'], 1, 10)
      .then((res) => (this.featuredProducts = res.data))
      .catch((e) => this.pageService.showError(e));
  }

  searchProducts() {
    if (!this.search) return (this.productsFound = null);

    const endPoint = this.settings.endPoints.products;
    const populates = [
      'user',
      { path: 'game', match: { name: { $regex: this.search, $options: 'i' } } },
    ];
    this.pageService
      .httpGetAll(endPoint, { featured: false }, { priority: 1 }, populates)
      .then(
        (res) =>
          (this.productsFound = res.data.filter((product) => product.game))
      )
      .catch((e) => this.pageService.showError(e));
  }

  addFeatured(id: string) {
    const endPoint = this.settings.endPoints.products + '/' + id;
    this.pageService
      .httpPut(endPoint, { featured: true })
      .then((res) => this.getFeaturedProducts())
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.search = null));
  }

  deleteFeatured(id: string) {
    const endPoint = this.settings.endPoints.products + '/' + id;

    this.pageService
      .httpPut(endPoint, { featured: false })
      .then((res) => this.getFeaturedProducts())
      .catch((e) => this.pageService.showError(e));
  }

  addBanner(type: 'mobile' | 'desktop') {
    this.pageService
      .showImageUpload()
      .then((res: any) => {
        if (!res?.data.file) return;

        const endPoint = this.settings.endPoints.banners;

        this.pageService
          .httpPost(endPoint, {
            picture: res.data.file,
            isMobile: type === 'mobile',
          })
          .then((res) => this.getItems())
          .catch((e) => this.pageService.showError(e));
      })
      .catch((e) => this.pageService.showError(e));
  }

  deleteBanner(id: string) {
    const endPoint = this.settings.endPoints.banners + '/' + id;

    this.pageService
      .httpDelete(endPoint)
      .then((res) => this.getItems())
      .catch((e) => this.pageService.showError(e));
  }

  private getProductsForHomepage() {
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

  /**
   * addHomepageProduct
   *
   * @param any
   * @returns void
   */
  public addHomepageProduct({ product_id, section_id, order_id }): void {
    const endPoint = this.settings.endPoints.homeProducts;

    this.pageService
      .httpPost(endPoint, { product_id, section_id, order_id })
      .then((res) => {
        this.getProductsForHomepage();
      })
      .catch((e) => this.pageService.showError(e));
  }
}
