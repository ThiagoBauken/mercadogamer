import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BaseComponent } from 'src/app/core/base.component';
import { GlobalService } from 'src/app/core/global.service';
import { PageService } from '../../core/page.service';

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.scss'],
})
export class ProductTypeComponent extends BaseComponent {
  form: any = {};
  processing = true;
  selected = 'select';
  closeResult = '';
  success = false;
  user = this.pageService.global.getUser();
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
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      // role: [null, Validators.required]
    });
  }

  goToProductAdd(item) {
    if (!this.user) {
      this.pageService.navigateRoute('/login');
    }
    this.pageService.navigateRoute('product-add/' + item);
  }

  goToHome() {
    if (this.selected !== 'select') {
      this.pageService.navigateRoute('home');
    }
  }

  goToRegister() {
    this.pageService.navigateRoute('register');
  }

  openModal(content) {
    setTimeout(() => {
      this.success = true;
    }, 1500);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
  }
}
