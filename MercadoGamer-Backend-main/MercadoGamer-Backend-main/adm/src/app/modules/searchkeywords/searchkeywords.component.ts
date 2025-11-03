import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import * as globalVariables from 'src/app/core/globals';

@Component({
  selector: 'app-search-keywords',
  templateUrl: './searchkeywords.component.html',
  styleUrls: ['./searchkeywords.component.scss'],
})
export class SearchKeyComponent extends BaseComponent {
  keywords: string;
  frequenty: number;
  page = 1;
  totalPages = 1;
  loading: boolean;
  searchkeywords: { [k: string]: any }[];

  ngOnInit(): void {
    this.getKeywords();
  }

  getKeywords(): void {
    const endPoint = this.settings.endPoints.searchfilters;
    this.loading = true;

    this.pageService
      .httpGetAll(endPoint, this.page)
      .then((res) => {
        this.keywords = res.data.sort((a, b) =>
          a.count > b.count ? -1 : a.count < b.count ? 1 : 0
        );
      })
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.loading = false));
  }
}
