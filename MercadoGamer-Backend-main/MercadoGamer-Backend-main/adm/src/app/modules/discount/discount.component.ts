import { Component, OnInit } from "@angular/core";
import { PageService } from "../../core/page.service";
import { NgbCarouselConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/core/base.component";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-discount",
  templateUrl: "./discount.component.html",
  styleUrls: ["./discount.component.scss"],
})
export class DiscountComponent extends BaseComponent {
  type: "" | "percentage" | "cash" = "";
  discountCodes: { [k: string]: any }[];
  countries: { [k: string]: any }[];
  page = 1;
  totalPages = 1;
  loading: boolean;
  selectedCountry: string = "";
  infinite: boolean;

  ngOnInit() {
    this.getCountries();
    this.getItems();
    this.pageService.socket.on(this.settings.socket.resetCode, (a) => {
      this.getItems();
    });
  }

  getCountries() {
    const endPoint = this.settings.endPoints.countries;

    this.pageService
      .httpGetAll(endPoint)
      .then((res) => (this.countries = res.data))
      .catch((e) => this.pageService.showError(e));
  }
  getItems() {
    const endPoint = this.settings.endPoints.discountCodes;
    this.loading = true;

    this.pageService
      .httpGetAll(endPoint, {}, { createdAt: -1 }, ["country"])
      .then((res) => {
        this.discountCodes = res.data;
        this.totalPages = res.pages;
      })
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.loading = false));
  }

  getFormNew() {
    return this.formBuilder.group({
      code: [null, Validators.required],
      total: [
        null,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      value: [null, Validators.required],
    });
  }

  onSubmitPerform(item) {
    let endPoint = this.settings.endPoints.discountCodes;

    item = this.savePre(item);

    this.pageService
      .httpPost(endPoint, item)
      .then((res) => this.savePost(res.data))
      .catch((e) => this.pageService.showError(e));
  }

  savePre(item) {
    item.country = this.selectedCountry;
    item.type = this.type;
    item.infinite = this.infinite;
    item.available = item.total;

    return item;
  }

  savePost(item) {
    this.pageService.showSuccess("Código de descuento creado con éxito!");
    this.close();
    this.getItems();
    this.form = this.getFormNew();
    this.selectedCountry = "";
    this.type = "";
    this.infinite = false;
  }

  handleInfinite(checked: boolean) {
    this.infinite = checked;
    if (this.infinite) this.form.patchValue({ total: 0 });
  }

  handleEnable(discountCode: { [k: string]: any }, enabled: boolean) {
    const endPoint =
      this.settings.endPoints.discountCodes + "/" + discountCode.id;
    const item = {
      enabled,
    };

    this.pageService.httpPut(endPoint, item).catch((e) => {
      this.pageService.showError(e);
      this.getItems();
    });
  }
}
