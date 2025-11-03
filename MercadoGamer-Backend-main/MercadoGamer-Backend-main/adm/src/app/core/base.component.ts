import { OnInit, Directive } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageService } from './page.service';
import { environment } from '../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormPage } from './form.page';
import { DomSanitizer } from '@angular/platform-browser';
import localeUS from '@angular/common/locales/es-US';
import { registerLocaleData } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
registerLocaleData(localeUS, 'es-US');

@Directive({})
export class BaseComponent extends FormPage implements OnInit {
  filesUrl = environment.filesUrl + '/';

  user: any;
  settings: any;
  global: any;
  page = 1;
  loading: boolean;
  totalPages = 1;

  constructor(
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
    public pageService: PageService,
    public sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    super(formBuilder);
    this.global = this.pageService.global;
    this.settings = this.pageService.global.settings;
    this.checkUser();
  }

  onSubmitPerform(item) {}

  getItems() {}

  checkUser() {
    this.global.getUserAsObservable().subscribe((res) => {
      this.user = this.global.getUser();
    });
    this.global.checkUser();
  }

  ngOnInit() {
    this.getItems();
  }

  openModal(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  close() {
    this.modalService.dismissAll();
  }

  nextPage() {
    this.page++;
    this.getItems();
  }

  previousPage() {
    this.page--;
    this.getItems();
  }

  goToProducts() {
    this.pageService.navigateRoute('products');
  }

  goToTickets() {
    this.pageService.navigateRoute('tickets');
  }

  goToSells() {
    this.pageService.navigateRoute('sells');
  }

  goToPersonalize() {
    this.pageService.navigateRoute('personalize');
  }

  goToRetreats() {
    this.pageService.navigateRoute('retreats');
  }

  goToFeedback() {
    this.pageService.navigateRoute('feedback');
  }

  goToStatistics() {
    this.pageService.navigateRoute('statistics');
  }

  goToDiscount() {
    this.pageService.navigateRoute('discount');
  }

  goToProfits() {
    this.pageService.navigateRoute('profits');
  }

  goToFilters() {
    this.pageService.navigateRoute('filters');
  }
}
