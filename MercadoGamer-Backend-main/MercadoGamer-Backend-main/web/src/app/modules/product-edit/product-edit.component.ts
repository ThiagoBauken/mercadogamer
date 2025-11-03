import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/base.component';
import { GlobalService } from 'src/app/core/global.service';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent extends BaseComponent implements OnInit {
  productId: string;
  product: { [k: string]: any };
  selectedPlatform: { [k: string]: any };
  selectedCategory: { [k: string]: any };
  selectedCode: { [k: string]: any };
  categories: { [k: string]: any }[];
  platforms: { [k: string]: any }[];
  stockproducts: { [k: string]: any }[];

  public delivery = 'automatic';
  public sellerProfit = 0;
  public publicationType: any = '';
  private commission = 0;
  private iva = 0;
  public games: Array<any> = [];
  public gamesOption: Observable<any[]>;

  constructor(
    public formBuilder: FormBuilder,
    public pageService: PageService,
    public global: GlobalService,
    public modalService: NgbModal,
    public activatedRoute: ActivatedRoute,
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
    this.form = this.getFormNew();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.productId = params.id;
      this.getProductContents();
    });
  }

  getProductContents(): void {
    const endPoint =
      this.settings.endPoints.products +
      this.settings.endPointsMethods.products.loadProductContents;

    this.pageService
      .httpGetAll(endPoint)
      .then((res) => {
        this.categories = res.categories;
        this.platforms = res.platforms;
        this.games = res.games;
        this.stockproducts = res.stockproducts;
        this.gamesOption = this.form.get('game')!.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterGroup(value))
        );
        this.getProduct();
      })
      .catch((e) => this.pageService.showError(e));
  }

  getProduct(): void {
    const endPoint = this.settings.endPoints.products;
    const populates = [];
    this.pageService
      .httpGetById(endPoint, this.productId, populates)
      .then((res) => {
        this.product = res.data;
        this.form = this.getFormEdit();
        this.publicationType = res.data.publicationType;
        if (
          this.product.stockProduct.length &&
          this.product.stockProduct.length === 1 &&
          this.product.stockProduct[0].retirementType !== 'automatic'
        ) {
          this.delivery = 'coordinated';
        } else {
          this.delivery = 'automatic';
        }
      })
      .catch((e) => {
        console.log(e);
        this.pageService.showError(e);
      });
  }

  handleType(type): void {
    this.form.patchValue({ type });
  }

  handlePicture(): void {
    this.pageService
      .showImageUpload()
      .then((res: any) => {
        if (!res?.data.file) {
          return;
        }

        this.form.patchValue({ picture: res.data.file });
      })
      .catch((e) => this.pageService.showError(e));
  }

  getFormNew(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      platform: [null, Validators.required],
      category: [null, Validators.required],
      code: this.formBuilder.array([
        new FormControl(null, [Validators.required]),
      ]),
      description: [null, Validators.required],
      picture: [null],
      type: [null, Validators.required],
      retirementType: ['automatic'],
      iva: [this.iva],
      game: [null, Validators.required],
      stock: [null, Validators.required],
    });
  }

  getFormEdit(): FormGroup {
    const {
      category,
      description,
      name,
      picture,
      platform,
      price,
      type,
      stock,
      iva,
      commission,
    } = this.product;

    const gameList = this.games.filter((item) => item.id === this.product.game);

    this.selectedCategory = this.categories.find(
      (item) => item.id === this.product.category
    );
    this.selectedPlatform = this.platforms.find(
      (item) => item.id === this.product.platform
    );
    this.selectedCode = this.stockproducts.find(
      (stockproducts) => stockproducts.product === this.product.id
    );
    this.iva = iva;
    this.commission = commission;

    return this.formBuilder.group({
      name: [name, Validators.required],
      picture: [picture, Validators.required],
      price: [price, Validators.required],
      description: [description, Validators.required],
      type: [type, Validators.required],
      platform: [platform, Validators.required],
      category: [category, Validators.required],
      code: this.formBuilder.array(
        Array.isArray(this.product.stockProduct)
          ? this.product.stockProduct?.map(
              (item) => new FormControl(item.code, [Validators.required])
            )
          : [new FormControl(null, [Validators.required])]
      ),
      game: [gameList.length === 1 ? gameList[0] : null, Validators.required],
      stock: [stock, Validators.required],
    });
  }

  public get codeFields(): FormArray {
    return this.form.get('code') as FormArray;
  }

  onSubmitPerform(item): void {
    const endPoint = this.settings.endPoints.products + '/' + this.productId;
    item = this.savePre(item);
    item.status = 'pending';
    item.rejectedmessages = null;
    item.code = this.product.stockProduct.map((stockProduct, index) => ({
      id: stockProduct.id,
      value: item.code[index],
    }));
    item.commission = this.commission;
    item.iva = this.iva;
    item.sellerProfit = this.sellerProfit;
    item.retirementType =
      this.delivery === 'automatic' ? this.delivery : 'manual';
    this.pageService
      .httpPut(endPoint, item)
      .then((res) => this.savePost(res.data))
      .catch((e) => this.pageService.showError(e));
  }

  savePre(item): void {
    item.platform = this.selectedPlatform.id;
    item.category = this.selectedCategory.id;
    item.game = item.game?.id;
    item.status = 'pending';
    return item;
  }

  savePost(item): void {
    this.pageService.showSuccess('Producto editado con éxito!');
    this.pageService.navigateRoute('my-account/sales-products');
  }

  disableProduct(): void {
    const endPoint = this.settings.endPoints.products + '/' + this.productId;

    this.pageService
      .httpPut(endPoint, { enabled: false })
      .then((res) => this.pageService.navigateRoute('home'))
      .catch((e) => this.pageService.showError(e));
  }

  public getCommissions(): number {
    const commission =
      ((!this.form.value?.price ? 0 : this.form.value?.price) *
        this.global.settings.products.publicationType[this.publicationType]
          .commission) /
      100;
    this.commission = commission;
    const iva =
      (this.global.settings.products.publicationType[this.publicationType].iva *
        commission) /
      100;
    this.iva = iva;
    this.sellerProfit = this.form.value?.price - (this.commission + this.iva);
    return commission + iva;
  }
  // }

  private _filterGroup(value): Array<any> {
    if (!value.id) {
      if (value) {
        return this.games.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
      }
      return this.games;
    }
  }

  public displayFn(item): string {
    return item ? item.name : item;
  }

  addNewCode(): void {
    if (!Array.isArray(this.product.stockProduct)) {
      this.product.stockProduct = [];
    }
    this.codeFields.push(new FormControl(null, [Validators.required]));
    this.product.stockProduct.push({ code: null });
  }
}
