import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Params } from '@angular/router';
import * as moment from 'moment';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('buySuccess') successModal: ElementRef;
  @ViewChild('finish') finishModal: ElementRef;
  @ViewChild('divMessages', { static: false }) content: any;

  orderId: string;
  order: { [k: string]: any };
  adminConversation: { [k: string]: any };
  usersConversation: { [k: string]: any };
  adminConversationMessages: { [k: string]: any }[] = [];
  usersConversationMessages: { [k: string]: any }[] = [];
  agree: boolean;
  currentChat: 'users' | 'admin' = 'users';
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
  time: any;
  remainTime: string;
  sending: boolean;
  showModal = '';
  notEdit = false;
  openPreviewImageStatus: { open: boolean; image: string } = {
    open: false,
    image: '',
  };
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.orderId = params.id;
      this.getOrder();
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

  initializeSocket(): void {
    this.pageService.socket.emit(
      this.settings.socket.enterConversation,
      this.usersConversation.id
    );
    this.pageService.socket.emit(
      this.settings.socket.enterConversation,
      this.adminConversation.id
    );
    this.pageService.socket.removeListener(
      this.settings.socket.refreshMessages
    );
    this.pageService.socket.removeListener(this.settings.socket.orderCancelled);
    this.pageService.socket.removeListener(this.settings.socket.orderFinished);

    this.pageService.socket.on(
      this.settings.socket.refreshMessages,
      (message) => {
        message.conversation === this[this.currentChat + 'Conversation'].id
          ? this[this.currentChat + 'ConversationMessages'].push(message)
          : this['adminConversationMessages'].push(message);
        this.scroll();
      }
    );

    this.pageService.socket.on(this.settings.socket.orderCancelled, () => {
      this.pageService.showSuccess(
        this.user.id === this.order.seller.id
          ? 'La venta ha sido cancelada'
          : 'El vendedor ha cancelado la compra, recibirás el reembolso en los próximos 2 días.'
      );
      this.pageService.navigateRoute('home');
    });

    this.pageService.socket.on(
      this.settings.socket.orderFinished,
      (userHasPreviousOrders) => {
        if (this.order.buyer.id === this.user.id && userHasPreviousOrders) {
          this.close();
          this.pageService.showSuccess('Compra finalizada!');
          this.pageService.navigateRoute('home');
        }

        this.orderFinished = true;

        if (this.order.seller.id === this.user.id) {
          this.openModal(this.successModal);

          setTimeout(() => {
            this.close();
            this.openModal(this.finishModal);
          }, 3000);
        }
      }
    );
  }

  sendMessage(): void {
    if (!this.newMessage || !this[this.currentChat + 'Conversation'].id) {
      return;
    }
    const message = {
      conversation: this[this.currentChat + 'Conversation'].id,
      body: this.newMessage,
      author: this.user.id,
      authorName: this.user.firstName + ' ' + this.user.lastName,
      notificationTo:
        this[this.currentChat + 'Conversation'].id === this.usersConversation.id
          ? this.usersConversation.users?.find((user) => user !== this.user.id)
          : null,
      order: this.orderId,
    };

    this.pageService.socket.emit(this.settings.socket.newMessage, message);

    this.newMessage = null;
  }

  scroll(): void {
    setTimeout(
      () =>
        (this.content.nativeElement.scrollTop =
          this.content.nativeElement.scrollHeight),
      20
    );
  }

  getOrder(): void {
    const endPoint =
      this.settings.endPoints.orders +
      this.settings.endPointsMethods.orders.chat +
      '/' +
      this.orderId;
    this.pageService
      .httpGet(endPoint)
      .then((res) => {
        this.order = res.data.order;
        this.notEdit = ['cancelled', 'finished', 'returned'].includes(
          this.order.status
        );
        if (this.notEdit) {
          // this.pageService.showError('Esta venta ya ha finalizado');
          this.pageService.navigateRoute('home');
        }

        this.usersConversation = res.data.usersConversation || [];
        this.adminConversation = res.data.adminConversation || [];
        this.adminConversation = res.data.adminConversation || [];
        this.usersConversationMessages =
          res.data.usersConversationMessages || [];
        this.adminConversationMessages =
          res.data.adminConversationMessages || [];
        this.initializeSocket();
        this.scroll();
      })
      .catch((e) => this.pageService.showError(e));
  }

  sendQualification(): void {
    if (this.qualificationSent) {
      return;
    }
    const review = {
      body: this.qualificationBody,
      qualification: this.qualification,
      order: this.orderId,
      qualifier: this.user.id,
      qualified:
        this.order.seller.id === this.user.id
          ? this.order.buyer.id
          : this.order.seller.id,
      roleReviewed: this.order.seller.id === this.user.id ? 'user' : 'seller',
    };

    this.pageService.socket.emit(this.settings.socket.finishOrder, review);
    this.qualificationSent = true;

    if (this.order.seller.id === this.user.id) {
      this.close();
      this.openModal(this.successModal);
    }
  }

  sendFeedback(): void {
    if (!this.feedbackBody || this.sending) {
      this.pageService.navigateRoute('home');
      this.close();
      return;
    }
    this.sending = true;
    const endPoint = this.settings.endPoints.feedbacks;
    const item = {
      body: this.feedbackBody,
      user: this.user.id,
    };

    this.pageService
      .httpPost(endPoint, item)
      .then((res) => {
        this.close();
        this.pageService.showSuccess('Feedback enviado!');
        this.pageService.navigateRoute('home');
      })
      .catch((e) => {
        this.sending = false;
        this.pageService.showError(e);
      });
  }

  openModal(content): void {
    this.showModal = '';
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  close(): void {
    this.modalService.dismissAll();
  }

  goToHome(): void {
    this.close();
    this.pageService.navigateRoute('home');
  }

  cancelOrder(): void {
    this.pageService.socket.emit(
      this.settings.socket.cancelOrder,
      this.orderId
    );
    this.close();
  }

  claimOrder(): void {
    const item = {
      motive: this.claimMotive,
      description: this.claimDescription,
      order: this.orderId,
      user: this.user.id,
    };
    this.pageService.socket.emit(this.settings.socket.claimOrder, item);
    this.close();
    this.order.status = 'complaint';
  }

  async sendImage(): Promise<void> {
    try {
      const file: any = await this.pageService.showImageUpload();
      const message = {
        conversation: this[this.currentChat + 'Conversation'].id,
        body: `--image--@${file.data.file}`,
        author: this.user.id,
        authorName: this.user.firstName + ' ' + this.user.lastName,
        notificationTo:
          this[this.currentChat + 'Conversation'].id ===
          this.usersConversation.id
            ? this.usersConversation.users?.find(
                (user) => user !== this.user.id
              )
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
    // Limpar interval para prevenir memory leaks
    if (this.time) {
      clearInterval(this.time);
    }
  }
}
