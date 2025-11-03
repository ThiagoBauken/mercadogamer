import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
} from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-catalogue-popup",
  templateUrl: "./catalogue-popup.component.html",
  styleUrls: ["./catalogue-popup.component.scss"],
})
export class CataloguePopupComponent implements OnInit {
  public showPopup = false;
  public categories = [
    {
      cateory_name: "Juegos",
      icon: "juegos",
      id: 0,
      sub_categories: [
        {
          name: "Nintendo",
          id: 1,
          products: [
            {
              name: "Aventura",
              id: 1,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 2,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 3,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 4,
              img: "assets/imgs/play1.jpg",
            },
          ],
        },
        {
          name: "Play Station",
          id: 2,
          products: [
            {
              name: "Aventura",
              id: 5,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 6,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 7,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 8,
              img: "assets/imgs/product.png",
            },
          ],
        },
        {
          name: "XBox",
          id: 3,
          products: [
            {
              name: "Aventura",
              id: 9,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 10,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 11,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 12,
              img: "assets/imgs/product.png",
            },
          ],
        },
        {
          name: "Epic Games",
          id: 4,
          products: [
            {
              name: "Aventura",
              id: 13,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 14,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 15,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 16,
              img: "assets/imgs/product.png",
            },
          ],
        },
        {
          name: "Battel Net",
          id: 5,
          products: [
            {
              name: "Aventura",
              id: 17,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 18,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 19,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 20,
              img: "assets/imgs/product.png",
            },
          ],
        },
        {
          name: "Origin",
          id: 6,
          products: [
            {
              name: "Aventura",
              id: 21,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 22,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 23,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 24,
              img: "assets/imgs/product.png",
            },
          ],
        },
      ],
    },
    {
      cateory_name: "Gift cards",
      icon: "gift-outline",
      id: 1,
      sub_categories: [
        {
          name: "Nintendo",
          id: 7,
          products: [
            {
              name: "Aventura",
              id: 25,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 26,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 27,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 28,
              img: "assets/imgs/product.png",
            },
          ],
        },
        {
          name: "Play Station",
          id: 8,
          products: [
            {
              name: "Aventura",
              id: 29,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 30,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 31,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 32,
              img: "assets/imgs/product.png",
            },
          ],
        },
        {
          name: "XBox",
          id: 9,
          products: [
            {
              name: "Aventura",
              id: 33,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 34,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 35,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 36,
              img: "assets/imgs/product.png",
            },
          ],
        },
      ],
    },
    {
      cateory_name: "Items",
      icon: "cube-outline",
      id: 2,
      sub_categories: [
        {
          name: "Play Station",
          id: 10,
          products: [
            {
              name: "Aventura",
              id: 37,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 38,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 39,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 40,
              img: "assets/imgs/product.png",
            },
          ],
        },
        {
          name: "XBox",
          id: 11,
          products: [
            {
              name: "Aventura",
              id: 41,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 42,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 43,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 44,
              img: "assets/imgs/product.png",
            },
          ],
        },
      ],
    },
    {
      cateory_name: "Monedas",
      icon: "monedas",
      id: 3,
      sub_categories: [
        {
          name: "Nintendo",
          id: 12,
          products: [
            {
              name: "Aventura",
              id: 45,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 46,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 47,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 48,
              img: "assets/imgs/product.png",
            },
          ],
        },
        {
          name: "Play Station",
          id: 13,
          products: [
            {
              name: "Aventura",
              id: 49,
              img: "assets/imgs/product.png",
            },
            {
              name: "Estrategia",
              id: 50,
              img: "assets/imgs/product.png",
            },
            {
              name: "Deporte",
              id: 51,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 52,
              img: "assets/imgs/product.png",
            },
          ],
        },
        {
          name: "XBox",
          id: 14,
          products: [
            {
              name: "Deporte",
              id: 53,
              img: "assets/imgs/product.png",
            },
            {
              name: "Carrera",
              id: 54,
              img: "assets/imgs/product.png",
            },
          ],
        },
      ],
    },
  ];
  public sub_categories: Array<any> = [];
  public products: Array<any> = [];
  public productImg: Array<any> = [];
  public categoryId: number = null;
  public subCategoryId: number = null;
  public productId: number = null;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private eRef: ElementRef
  ) {
    this.matIconRegistry.addSvgIcon(
      "cube-outline",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/cube-outline.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "gift-outline",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/gift-outline.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "juegos",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/juegos.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "monedas",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/monedas.svg"
      )
    );
  }

  @Output() popupoff = new EventEmitter<boolean>();

  @HostListener("document:click", ["$event"])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.popupoff.emit();
    }
  }

  ngOnInit(): void {
    // this.changeParentCat(this.categories[0].id);
  }

  public changeParentCat(id): void {
    this.categoryId = id;
    const index = this.categories.findIndex((el) => el.id === id);
    this.sub_categories =
      index >= 0 ? this.categories[index].sub_categories : [];
    this.products = [];
    this.productImg = [];
    this.subCategoryId = null;
    this.productId = null;
  }
  public changeSubCat(id): void {
    this.subCategoryId = id;
    const index = this.sub_categories.findIndex((el) => el.id === id);
    this.products = index >= 0 ? this.sub_categories[index].products : [];
    this.productImg = [];
    this.productId = null;
  }
  public changeProduct(id): void {
    this.productId = id;
    const index = this.products.findIndex((el) => el.id === id);
    this.productImg = this.products[index].img;
  }
}
