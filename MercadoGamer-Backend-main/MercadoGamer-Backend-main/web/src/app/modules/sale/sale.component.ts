import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageService } from '../../core/page.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit  {

  form: any = {};
  processing = true;
  selected = 'select';
  closeResult = '';
  success = false;

  constructor(
    public formBuilder: FormBuilder,
    public pageService: PageService,
    public modalService: NgbModal,
  ) {
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      //role: [null, Validators.required]
    });
   
  }

  // login( item ) {
  //   //item.role = 'administrators'
  //   const endPoint = '/' + item.role;

  //   this.pageService.httpPost( item, '/login', endPoint )
  //   .then(res => {
  //     let user = res.data;

  //     if (user.roles.includes('company') && !user.enabled) return this.pageService.showError('La empresa no está habilitada.');

  //     this.pageService.global.saveUser(user);
  //     this.pageService.showSuccess('Bienvenido!');
      
  //     if (user.roles.includes('administrator')) this.pageService.navigateRoute("users")
  //     else if (user.roles.includes('company')) this.pageService.navigateRoute("coupons-company")
  //   }).catch(e => this.pageService.showError(e));
    
  // }

  login(item){
    this.pageService.navigateRoute("users");
  }

  goToHome() {
    if(this.selected !== 'select') {
      this.pageService.navigateRoute('home');
    }
  }

  goToRegister() {
    this.pageService.navigateRoute('register');
  }


  ngOnInit() {
  }

  openModal(content) {
    setTimeout(() => {
      this.success = true;
    }, 1500);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  close() {
    this.modalService.dismissAll();
  }

}
