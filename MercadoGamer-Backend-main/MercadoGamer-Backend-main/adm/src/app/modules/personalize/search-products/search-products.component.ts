import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/core/base.component";
import { PageService } from "src/app/core/page.service";

@Component({
  selector: "app-search-products",
  templateUrl: "./search-products.component.html",
  styleUrls: ["./search-products.component.scss"],
})
export class SearchProductsComponent extends BaseComponent {
  public search: string;
  public productsFound: { [k: string]: any }[];

  constructor(
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
    public pageService: PageService,
    public sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private eRef: ElementRef
  ) {
    super(
      formBuilder,
      activatedRoute,
      modalService,
      pageService,
      sanitizer,
      dialog
    );
  }

  @Input() type = String;
  @Input() order = Number;
  @Output() onClickItem = new EventEmitter<any>();

  @HostListener("document:click", ["$event"])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.search = "";
    }
  }

  public searchProducts(): void {
    if (!this.search) return (this.productsFound = null);

    const endPoint = this.settings.endPoints.products;
    const populates = [];
    this.pageService
      .httpGetAll(
        endPoint,
        {
          status: "approved",
          stock: { $gt: 0 },
          enabled: true,
          $or: [{ name: { $regex: this.search, $options: "i" } }],
        },
        { priority: 1 },
        populates
      )
      .then((res) => {
        this.productsFound = res.data;
      })
      // .then(res => this.productsFound = res.data.filter(product => product.game))
      .catch((e) => this.pageService.showError(e));
  }

  /**
   * handleItem
   *
   * @param number
   * @returns void
   */
  public handleItem(product_id: number): void {
    this.onClickItem.emit({
      product_id,
      order_id: this.order,
      section_id: this.type,
    });
    this.search = null;
  }
}
