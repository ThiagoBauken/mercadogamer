import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent extends BaseComponent {
  feedbacks: { [k: string]: any }[];
  itemSelected: { [k: string]: any };
  chat: boolean;

  getItems() {
    let endPoint = this.settings.endPoints.feedbacks;

    this.loading = true;

    this.pageService
      .httpGetAll(endPoint, {}, { createdAt: -1 }, ['user'], this.page)
      .then((res) => {
        this.feedbacks = res.data;
        this.totalPages = res.pages;
      })
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.loading = false));
  }

  goToProfile(id: string) {
    this.pageService.navigateRoute('profile/' + id);
  }

  openChat(feedback) {
    this.chat =
      this.chat && this.itemSelected.id === feedback.id ? false : true;

    if (feedback.new) {
      const endPoint = this.settings.endPoints.feedbacks + '/' + feedback.id;

      feedback.new = false;

      this.pageService
        .httpPut(endPoint, { new: false })
        .catch((e) => this.pageService.showError(e));
    }

    this.itemSelected = feedback;
  }
}
