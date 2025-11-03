import { Component, OnInit, Directive } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpService } from './http.service';
import { ToastrService } from 'ngx-toastr';
import { PageService } from './page.service';
import { FormPage } from './form.page';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Directive({})
export class ItemComponent extends FormPage implements OnInit {

  filesUrl = environment.filesUrl + '/';

  item: any;
  creating = true;
  processing = true;

  items: any = [];
  textSearch: any = '';
  loading = true;
  page = 1;
  pages = 0;
  itemsPerPage = 0;
  count = 0;
  SORT_ASC = 1;
  SORT_DESC = -1;
  sortField: any = { name: this.SORT_ASC };
  closeResult = '';
  itemSelected: any;
  endPoint: any;
  module: any;
  settings: any;
  global: any;
  isWatching = false;
  params: any = {};
  
  constructor(
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public pageService: PageService,
    public modalService: NgbModal
  ) {
    super(formBuilder);
    this.global = this.pageService.global;
    this.settings = this.pageService.global.settings;
  }

  getFormEdit(item) {
    return this.formBuilder.group({});
  }

  savePre(item) {
  }

  savePost(item) {
  }

  savePostError(item) {
  }
  
  savePreCheck( item ) {
    return true;
  }

  savePostNavigate() {

  }
  

  onSubmitPerform(item) {
    this.savePre(item);


    if(!this.savePreCheck(item)) return

    if (!item.id) {
      delete (item.id);
      this.pageService.httpCreate(item, this.getEndPointCreate())
        .then((response) => {
          this.pageService.showSuccess('Se ha guardado exitosamente!!');
          this.savePost(response);
          this.pageService.navigate();
        })
        .catch((reason) => {
          this.pageService.showError(reason);
          this.savePostError(reason);
        });
    } else {
      this.pageService.httpUpdate(item, this.getEndPointUpdate())
        .then((response) => {
          this.pageService.showSuccess('Se ha actualizado exitosamente!!');
          this.savePost(response);
          this.pageService.navigate();
          this.savePostNavigate();
        })
        .catch((reason) => {
          this.pageService.showError(reason);
          this.savePostError(reason);
        });
    }
  }

  remove(item) {
    if (!confirm('¿Esta seguro que desea eliminar este elemento?')) {
      return
    }
    this.pageService.httpRemove(item)
      .then(data => {
        this.pageService.showSuccess('Se elimino correctamente')
        this.pageService.navigate();
      })
      .catch(err => {
        this.pageService.showError('No se pudo eliminar el item')
      })
  }

  ngOnInit() {
    this.initialize();

  }

  initializePre() {
  }

 


  initialize() {
    this.initializePre();
    this.processing = true;
    this.form = this.getFormNew();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.type) this.params.type = params.type;
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.isWatching = params.action === 'watch' ? true : false;
      if (params.id !== 'new') {
        this.loadItem(params.id);
      } else {
        this.processing = false;
        this.itemLoaded(this.item)
      }
    });
  }

  loadItem(id: string) {
    this.pageService.httpGetById(id, this.getPopulates(), this.getEndPointLoad())
      .then((item) => {
        this.form = this.getFormEdit(item.data);
        this.item = item.data;
        this.creating = false;
        this.processing = false;
        this.itemLoaded(item.data);

      })
      .catch((reason) => {
        this.pageService.showError(reason);
      });
  }


  getItemSuccess() {
  }

  getSort() {
    return this.sortField;
  }

  getPage() {
    return this.page;
  }

  getPopulates() {
    return [];
  }

  getFilters() {
    return {};
  }

  getEndpoint() {
    return this.pageService.getHttpEndPoint();
  }

  getEndPointCreate() {
    return this.getEndpoint();
  }

  getEndPointUpdate() {
    return this.getEndpoint();
  }

  getEndPointRemove() {
    return this.getEndpoint();
  }

  getEndPointLoad() {
    return this.getEndpoint();
  }

  itemLoaded(item) {

  }


  openModal(content, item) {
    this.itemSelected = item || '';

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }




}