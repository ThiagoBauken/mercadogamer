import { Component } from '@angular/core';
import * as moment from 'moment';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent extends BaseComponent {
  chat = false;
  status: 'pending' | 'approved' | 'rejected' = 'pending';
  page = 1;
  tickets: { [k: string]: any }[];
  totalPages = 1;
  loading: boolean;
  itemSelected: { [k: string]: any };
  answer: string;

  getItems() {
    const endPoint = this.settings.endPoints.tickets;

    this.loading = true;

    this.pageService
      .httpGetAll(endPoint, {}, { createdAt: -1 }, ['user'], this.page)
      .then((res) => {
        this.tickets = res.data;
        this.totalPages = res.pages;
      })
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.loading = false));
  }

  goToProfile(id: string) {
    this.pageService.navigateRoute('profile/' + id);
  }

  openChat(ticket) {
    this.chat = this.chat && this.itemSelected.id === ticket.id ? false : true;
    this.itemSelected = ticket;
  }

  getDate(ticket) {
    const m = moment(ticket.createdAt).local();
    return m.format('DD-MM-YYYY') + ' - ' + m.format('HH:mm');
  }

  answerTicket() {
    const endPoint =
      this.settings.endPoints.tickets +
      this.settings.endPointsMethods.tickets.finish +
      '/' +
      this.itemSelected.id;

    this.pageService
      .httpPut(endPoint, { answer: this.answer })
      .then((res) => {
        this.pageService.showSuccess('Respuesta enviada con éxito!');
        this.getItems();
        this.chat = false;
        this.answer = null;
      })
      .catch((e) => this.pageService.showError(e));
  }
}
