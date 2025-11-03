import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Params } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BaseComponent } from 'src/app/core/base.component';
import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
})
export class CatalogueComponent extends BaseComponent implements OnInit {
  showFilters = {
    category: false,
    search: false,
    platform: false,
    type: false,
  };
  filterType: 'platform' | 'game' | 'search' | 'type' | 'category';
  paramId: 'game' | 'giftCard' | string;
  categories: { [k: string]: any }[];
  platforms: { [k: string]: any }[];
  products: { [k: string]: any }[];
  page = 1;
  totalPages = 1;
  selectedPlatforms: string[] = [];
  selectedCategories: string[] = [];
  selectedTypes: string[] = [];
  selectedGame: string;
  searchGame: string;
  search: string;
  showFilterOption = false;
  isIn = false;
  value = 0;
  options: Options = {
    floor: 0,
    ceil: 0,
  };
  highValue = 0;
  filteredCount: number = null;
  showFilterCount = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (!params.id || !params.type) {
        this.getProducts();
        return;
      }

      this.selectedTypes = [];
      this.selectedPlatforms = [];
      this.selectedCategories = [];
      this.selectedGame = undefined;
      this.searchGame = undefined;

      this.filterType = params.type;
      this.paramId = params.id.includes('%20')
        ? params.id.replaceAll('%20', ' ')
        : params.id;
      switch (this.filterType) {
        case 'platform':
          this.selectedPlatforms.push(this.paramId);
          break;

        case 'game':
          this.selectedGame = this.paramId;
          break;

        case 'search':
          this.search = this.paramId;
          break;

        case 'type':
          this.selectedTypes.push(this.paramId);
          break;

        case 'category':
          this.selectedCategories.push(this.paramId);
          break;

        default:
          break;
      }

      this.getProducts();
    });

    this.getCategories();
    this.getPlatforms();
  }

  onClickFilterButton(): void {
    this.isIn = false;
    this.showFilterOption = !this.showFilterOption;
  }
  hideFilterOption(): void {
    if (this.showFilterOption) {
      this.showFilterOption = this.isIn || !this.showFilterOption;
    }
  }

  getPlatforms(): void {
    const endPoint = this.settings.endPoints.platforms;

    this.pageService
      .httpGetAll(endPoint, { enabled: true })
      .then((res) => (this.platforms = res.data))
      .catch((e) => this.pageService.showError(e));
  }

  getCategories(): void {
    const endPoint = this.settings.endPoints.categories;
    this.pageService
      .httpGetAll(endPoint, { enabled: true })
      .then((res) => (this.categories = res.data))
      .catch((e) => this.pageService.showError(e));
  }

  getProducts(): void {
    const endPoint = this.settings.endPoints.products;

    const populates = ['platform', 'category', 'user'];
    const filters: { [k: string]: any } = {
      status: this.settings.products.status.approved.code,
      stock: { $gt: 0 },
      enabled: true,
    };

    if (this.options.ceil !== 0) {
      filters.price = {
        $gte: this.value,
        $lte: this.highValue,
      };
    }
    // if (this.searchGame) {
    //   populates = [
    //     {
    //       path: "game",
    //       match: { name: { $regex: this.searchGame, $options: "i" } },
    //     },
    //   ];
    // }

    if (this.selectedCategories.length) {
      filters.category = { $in: this.selectedCategories };
    }
    if (this.selectedPlatforms.length) {
      filters.platform = { $in: this.selectedPlatforms };
    }
    if (this.selectedTypes.length) {
      filters.type = { $in: this.selectedTypes };
    }
    if (this.selectedGame) {
      filters.game = this.selectedGame;
    }
    if (this.search) {
      filters.$or = [{ name: { $regex: this.search, $options: 'i' } }];
    }

    this.pageService
      .httpGetAll(
        endPoint,
        filters,
        { priority: 1 },
        populates,
        this.searchGame ? 0 : this.page
      )
      .then((res) => {
        this.products = this.searchGame
          ? res.data.filter((product) => product.game)
          : res.data;
        if (this.options.ceil === 0) {
          this.options = {
            floor: 0,
            ceil: res.maxPrice ?? 100000,
          };
          this.highValue = res.maxPrice ?? 100000;
        }
        this.totalPages = this.searchGame ? 1 : res.pages;
        this.filteredCount = this.products.length;
      })
      .catch((e) => this.pageService.showError(e));
  }

  handleFilters(
    e: MatCheckboxChange,
    filter: 'Platforms' | 'Categories' | 'Types'
  ): void {
    if (this['selected' + filter].includes(e.source.value)) {
      this['selected' + filter].splice(
        this['selected' + filter].indexOf(e.source.value),
        1
      );
    } else {
      this['selected' + filter].push(e.source.value);
    }
    this.showFilterCount = true;
    this.getProducts();
  }

  filterName(): void {
    this.showFilterCount = true;
    this.getProducts();
  }

  nextPage(): void {
    this.page++;
    this.getProducts();
  }

  previousPage(): void {
    this.page--;
    this.getProducts();
  }

  goToProductDetail(id: string, newWindow = false): void {
    if (newWindow) {
      window.open(`/product-detail/${id}`);
    } else {
      this.pageService.navigateRoute(`product-detail/${id}`);
    }
  }

  /**
   * handleSlider
   *
   * @returns void
   */
  public handleSlider(changeContext: ChangeContext): void {
    this.showFilterCount = true;
    this.getProducts();
  }
}
