import { ANALYZE_FOR_ENTRY_COMPONENTS, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BaseComponent } from 'src/app/core/base.component';
import { GlobalService } from 'src/app/core/global.service';
import { PageService } from '../../core/page.service';
import { Observable } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';
@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent extends BaseComponent implements OnInit {
  form: any = {};
  processing = true;
  closeResult = '';
  success = false;
  data: any = {
    platforms: [],
    categories: [],
  };
  public publicationType_val: any;
  public commission_val = 0;
  public iva_val = 0;
  public sellerProfit_val = 0;
  public price_val: number = null;
  public type_val: string = null;
  sent: boolean;
  public stepIndex = 0;
  public validStepOne = true;
  public validStepTwo = true;
  public validStepThree = true;
  public stepTitles: Array<string> = [
    'Información principal',
    'Imagen y descripción',
    'Filtros y preferencias',
  ];
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

    this.activatedRoute.params.subscribe((params: Params) => {
      this.publicationType_val = params.type;
      this.form = this.getFormNew();
    });

    this.getCountry();
  }

  getFormNew(): any {
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
      iva: [this.iva_val],
      game: [null],
      stock: [null, Validators.required],
    });
  }
  getCountry(): void {
    this.pageService
      .httpGetById(this.global.settings.endPoints.countries, this.user.country)
      .then((res) => {
        this.country = res.data;
      });
  }

  getCommissions(): number {
    const commission =
      ((!this.price_val ? 0 : this.price_val) *
        this.global.settings.products.publicationType[this.publicationType_val]
          .commission) /
      100;
    const iva =
      (this.global.settings.products.publicationType[this.publicationType_val]
        .iva *
        commission) /
      100;
    this.commission_val = commission;
    this.iva_val = iva;
    this.sellerProfit_val =
      (!this.price_val ? 0 : this.price_val) - (commission + iva);
    return commission + iva;
  }

  login(item): void {
    this.pageService.navigateRoute('users');
  }

  goToRegister(): void {
    this.pageService.navigateRoute('register');
  }

  ngOnInit(): void {
    this.loadProductContents();

    // tslint:disable-next-line: no-non-null-assertion
    this.gamesOption = this.form.get('game')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroup(value))
    );
  }
  loadProductContents(): void {
    this.pageService
      .httpGetAll(
        this.global.settings.endPoints.products +
          this.global.settings.endPointsMethods.products.loadProductContents
      )
      .then((res) => {
        this.data = res;
        this.games = res.games;
      });
  }
  uploadFile(): void {
    this.pageService
      .showImageUpload('image/*, video/*')
      .then((res: any) => {
        if (res?.data.file) {
          this.form.patchValue({
            picture: res.data.file,
          });
        }
      })
      .catch((e) => this.pageService.showError(e));
  }

  onSubmitPerform(item): void {
    if (this.sent) {
      return;
    }
    if (!item.picture) {
      return this.pageService.showError('Por favor seleccione una imágen.');
    }

    if (item.game === '_') {
      item.game = null;
    }
    const endPoint =
      this.settings.endPoints.products +
      this.global.settings.endPointsMethods.products.createNewProduct;
    item = this.savePre(item);

    this.pageService
      .httpPost(endPoint, item)
      .then((res) => this.savePost(res))
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.sent = false));
  }
  savePre(item): any {
    item.publicationType = this.publicationType_val;
    item.commission = this.commission_val;
    item.iva = this.iva_val;
    item.sellerProfit = this.sellerProfit_val;
    item.user = this.user.id;
    item.game = item.game?.id;
    return item;
  }
  savePost(item): void {
    this.sent = false;
    this.pageService.showSuccess(
      'Su producto ha sido creado exitosamente, espere a que sea aprobado.'
    );
    this.pageService.navigateRoute('/my-account/sales-products');
  }
  openModal(content): void {
    setTimeout(() => {
      this.success = true;
    }, 1500);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          // this.closeResult = `Dismissed`;
        }
      );
  }

  public get codeFields(): FormArray {
    return this.form.get('code') as FormArray;
  }

  /**
   * handleStep
   *
   * @param number value
   * @returns void
   */
  public handleStep(value: number): void {
    const { description, name, picture, price } = this.form.value;
    const ableToNext = this.stepIndex >= 0 && this.stepIndex < 2 && value > 0;
    const ableToBack = this.stepIndex <= 2 && this.stepIndex > 0 && value < 0;

    if (ableToBack) {
      this.stepIndex += value;
    }
    if (ableToNext) {
      switch (this.stepIndex) {
        case 0:
          this.validStepOne = name !== null && price !== null && price > 0;
          if (!this.validStepOne) {
            return;
          }
          break;
        case 1:
          this.validStepTwo =
            picture !== null && description !== null && description !== '';
          if (!this.validStepTwo) {
            return;
          }
          break;
      }
      this.stepIndex += value;
    }
  }

  /**
   * AddCodeField
   *
   * @returns void
   */
  public addCodeField(): void {
    const lastVal = this.codeFields.value[this.codeFields.value.length - 1];
    if (lastVal && lastVal !== '') {
      this.codeFields.push(new FormControl(null, [Validators.required]));
    }
  }

  /**
   * handleRetirementType
   *
   * @returns void
   */
  public handleRetirementType(val: string): void {
    this.form.controls.retirementType.setValue(val);
    if (val === 'automatic') {
      this.form.controls.stock.reset(null, Validators.required);
    } else {
      this.codeFields.clear();
      this.codeFields.push(new FormControl(null, [Validators.required]));
    }
  }

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
    if (item === '_') {
      return 'NO APLICA';
    }
    return item && typeof item === 'object' ? item.name : item;
  }
}
