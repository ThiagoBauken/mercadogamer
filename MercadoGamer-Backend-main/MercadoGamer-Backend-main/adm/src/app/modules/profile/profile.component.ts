import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageService } from '../../core/page.service';
import { Params } from '@angular/router';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  categories: { [k: string]: any }[];
  userReviews: { [k: string]: any }[];
  sellerReviews: { [k: string]: any }[];
  products: { [k: string]: any }[];
  profile: { [k: string]: any };
  orders: { [k: string]: any };
  profileId: string;
  userReviewsFilter: 'positive' | 'negative';
  sellerReviewsFilter: 'positive' | 'negative';
  productsPage = 1;
  productsPages = 1;
  roleSelected: 'seller' | 'user' = 'user';
  selectRole = false;
  selectedPlatformFilter: { [k: string]: any };
  selectedCategoryFilter: { [k: string]: any };
  selectedTypeFilter: { [k: string]: any };

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.profileId = params.id;
      this.roleSelected = params.role;
      this.getProfileItems();
    });
  }

  getProfileItems(): void {
    const endPoint =
      this.settings.endPoints.users +
      this.settings.endPointsMethods.users.profile +
      '/' +
      this.profileId;

    const filters: { [k: string]: any } = {
      productsPage: this.productsPage,
      extraProductsFilter: {},
    };

    if (this.selectedCategoryFilter) {
      filters.extraProductsFilter.category = this.selectedCategoryFilter.id;
    }

    if (this.selectedPlatformFilter) {
      filters.extraProductsFilter.platform = this.selectedPlatformFilter.id;
    }

    if (this.selectedTypeFilter) {
      filters.extraProductsFilter.type = this.selectedTypeFilter.code;
    }

    if (this.sellerReviewsFilter) {
      filters.sellerQualification = {
        qualification:
          this.sellerReviewsFilter === 'positive' ? { $gte: 3 } : { $lt: 3 },
      };
    }

    if (this.userReviewsFilter) {
      filters.userQualification = {
        qualification:
          this.userReviewsFilter === 'positive' ? { $gte: 3 } : { $lt: 3 },
      };
    }

    this.pageService
      .httpGetAll(endPoint, filters, {}, ['platform'])
      .then((res) => {
        this.products = res.products;
        this.productsPages = res.productsPages;
        this.categories = res.categories;
        this.profile = res.user;
        this.userReviews = res.userReviews;
        this.sellerReviews = res.sellerReviews;
        this.orders = res.orders;
      })
      .catch((e) => this.pageService.showError(e));
  }
  filterProducts(variable: string, filter: { [k: string]: any }): void {
    this[variable] = filter;

    this.getProfileItems();
  }

  previousPage(): void {
    this.productsPage--;
    this.getProfileItems();
  }

  nextPage(): void {
    this.productsPage++;
    this.getProfileItems();
  }

  handleReviewsFilter(filter?: 'positive' | 'negative'): void {
    this[this.roleSelected + 'ReviewsFilter'] = filter;
    this.getProfileItems();
  }
}
