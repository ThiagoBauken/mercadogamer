import { Component, OnInit } from "@angular/core";
import { PageService } from "../../core/page.service";
import { NgbCarouselConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/core/base.component";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.scss"],
})
export class FiltersComponent extends BaseComponent {
  categories: { [k: string]: any }[];
  platforms: { [k: string]: any }[];
  games: { [k: string]: any }[];
  newFilterType: "platforms" | "categories" | "games";
  newFilterPicture: string;
  newFilterName: string;

  ngOnInit() {
    this.getGames();
    this.getCategories();
    this.getPlatforms();
  }

  getCategories() {
    const endPoint = this.settings.endPoints.categories;

    this.pageService
      .httpGetAll(endPoint)
      .then((res) => (this.categories = res.data))
      .catch((e) => this.pageService.showError(e));
  }

  getGames() {
    const endPoint = this.settings.endPoints.games;

    this.pageService
      .httpGetAll(endPoint)
      .then((res) => (this.games = res.data))
      .catch((e) => this.pageService.showError(e));
  }

  getPlatforms() {
    const endPoint = this.settings.endPoints.platforms;

    this.pageService
      .httpGetAll(endPoint)
      .then((res) => (this.platforms = res.data))
      .catch((e) => this.pageService.showError(e));
  }

  saveFilter() {
    const endPoint = this.settings.endPoints[this.newFilterType];
    const item = {
      name: this.newFilterName,
      picture: this.newFilterPicture,
    };

    this.pageService
      .httpPost(endPoint, item)
      .then((res) => {
        this.ngOnInit();
        this.close();
      })
      .catch((e) => this.pageService.showError(e));
  }

  selectImage() {
    this.pageService
      .showImageUpload()
      .then((res: any) => {
        if (!res?.data.file) return;

        this.newFilterPicture = res.data.file;
      })
      .catch((e) => this.pageService.showError(e));
  }
}
