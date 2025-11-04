import { Time } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Params } from '@angular/router';
import * as moment from 'moment';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { Timeouts } from 'selenium-webdriver';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent extends BaseComponent implements OnDestroy {
  @ViewChild('buySuccess') successModal: ElementRef;
  @ViewChild('finish') finishModal: ElementRef;
  @ViewChild('divMessages', { static: false }) content: any;
  orderId: string;
  order: { [k: string]: any };
  sellerConversation: { [k: string]: any };
  buyerConversation: { [k: string]: any };
  usersConversation: { [k: string]: any };
  sellerConversationMessages: { [k: string]: any }[] = [];
  buyerConversationMessages: { [k: string]: any }[] = [];
  usersConversationMessages: { [k: string]: any }[] = [];
  agree: boolean;
  currentChat: 'users' | 'buyer' | 'seller' = 'users';
  newMessage: string;
  qualified: boolean;
  qualification: number;
  qualificationBody: string;
  feedbackBody: string;
  orderFinished: boolean;
  qualificationSent: boolean;
  firstSale: boolean;
  claimMotive = 'select';
  claimDescription: string;
  remainTime: string;
  time: NodeJS.Timeout;
  openPreviewImageStatus: { open: boolean; image: string } = {
    open: false,
    image: '',
  };

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.orderId = params.id;
      this.getOrder();
      // moment.locale('es');
    });
    this.time = setInterval(() => {
      if (this.order?.createdAt) {
        const create = moment(this.order.createdAt);
        const expire = create.clone().add('days', 3);
        const now = moment();
        let duration: number = expire.diff(now);
        const pass = duration > 0 ? 1 : 0;
        duration = Math.abs(duration);
        const days = Math.floor(duration / 86400000);
        duration -= days * 86400000;
        const hours = Math.floor(duration / 3600000);
        duration -= hours * 3600000;
        const minuts = Math.floor(duration / 60000);
        this.remainTime =
          pass > 0
            ? `Quedan ${days} días y ${hours}:${minuts} hr para que se finalice automaticamente tu compra.`
            : `La hora en que se completa automáticamente la compra ha pasado la ${Math.abs(
                hours
              )}:${minuts} del día ${days}`;
      }
    }, 500);
  }

  initializeSocket() {
    this.pageService.socket.emit(
      this.settings.socket.enterConversation,
      this.usersConversation.id
    );
    this.pageService.socket.emit(
      this.settings.socket.enterConversation,
      this.sellerConversation.id
    );
    this.pageService.socket.emit(
      this.settings.socket.enterConversation,
      this.buyerConversation.id
    );

    const conversations = {
      [this.usersConversation.id]: 'users',
      [this.buyerConversation.id]: 'buyer',
      [this.sellerConversation.id]: 'seller',
    };

    this.pageService.socket.on(
      this.settings.socket.refreshMessages,
      (message) =>
        this[
          conversations[message.conversation] + 'ConversationMessages'
        ]?.push(message)
    );

    this.pageService.socket.on(this.settings.socket.orderCancelled, () => {
      this.pageService.showSuccess('La compra ha sido cancelada.');
      this.order.status = 'cancelled';
    });

    this.pageService.socket.on(
      this.settings.socket.orderFinished,
      (userHasPreviousOrders) => {
        this.pageService.showSuccess('La compra ha sido finalizada!');
        this.order.status = 'finished';
      }
    );
  }

  sendMessage() {
    if (!this.newMessage) return;
    const message = {
      conversation: this[this.currentChat + 'Conversation'].id,
      body: this.newMessage,
      author: null,
      authorName: 'Administrador',
      notificationTo:
        this[this.currentChat + 'Conversation'].id === this.usersConversation.id
          ? this.usersConversation.users.find((user) => user !== this.user.id)
          : this.usersConversation.id,
      order: this.orderId,
    };
    this.pageService.socket.emit(this.settings.socket.newMessage, message);

    this.newMessage = null;
  }

  scroll() {
    setTimeout(
      () =>
        (this.content.nativeElement.scrollTop =
          this.content.nativeElement.scrollHeight),
      20
    );
  }

  getOrder() {
    let endPoint =
      this.settings.endPoints.orders +
      this.settings.endPointsMethods.orders.chat +
      '/' +
      this.orderId;
    this.pageService
      .httpGet(endPoint)
      .then((res) => {
        this.order = res.data.order;
        this.usersConversation = res.data.usersConversation;
        this.sellerConversation = res.data.sellerConversation;
        this.buyerConversation = res.data.buyerConversation;
        this.usersConversationMessages = res.data.usersConversationMessages;
        this.sellerConversationMessages = res.data.sellerConversationMessages;
        this.buyerConversationMessages = res.data.buyerConversationMessages;
        this.initializeSocket();
      })
      .catch((e) => this.pageService.showError(e));
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

  goToHome() {
    this.close();
    this.pageService.navigateRoute('home');
  }

  cancelOrder() {
    this.pageService.socket.emit(
      this.settings.socket.cancelOrder,
      this.orderId
    );
    this.close();
    this.pageService.showSuccess('Venta cancelada con éxito');
    this.order.status = 'cancelled';
  }

  async sendQualification(): Promise<void> {
    this.pageService.socket.emit(this.settings.socket.finishOrder, {
      info: 'finishedByAdmin',
      order: this.orderId
    });

    this.order.status = 'finished';
  }

  async sendImage(): Promise<void> {
    try {
      const file: any = await this.pageService.showImageUpload();

      const message = {
        conversation: this[this.currentChat + 'Conversation'].id,
        body: `--image--@${file.data.file}`,
        author: null,
        authorName: 'Administrador',
        notificationTo:
          this[this.currentChat + 'Conversation'].id ===
          this.usersConversation.id
            ? this.usersConversation.users.find((user) => user !== this.user.id)
            : null,
        order: this.orderId,
      };

      this.pageService.socket.emit(this.settings.socket.newMessage, message);
    } catch (error) {
      this.pageService.showError(error);
    }
  }

  checkBody(body: string): 'image' | 'string' {
    return /^--image--@/.test(body) ? 'image' : 'string';
  }

  getImageUrl(body: string): string {
    return `background-image:url('${this.filesUrl}${body.split('@')?.[1]}')`;
  }

  openPreviewImage(image: string): void {
    this.openPreviewImageStatus = {
      open: true,
      image,
    };
  }

  ngOnDestroy(): void {
    if (this.time) {
      clearInterval(this.time);
    }
  }
}
