import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PageService } from 'src/app/core/page.service';

type CategoryType = 'shopping' | 'sale' | 'product' | 'ticket' | 'withdrawal';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {
  private userId = '';
  public loading = false;
  public userInfo: any = {};
  public country: any = {};
  public currentCategory: CategoryType = 'shopping';
  public perPage = 5;

  public categories: { label: string; key: CategoryType }[] = [
    { key: 'shopping', label: 'Compras' },
    { key: 'sale', label: 'Ventas' },
    { key: 'product', label: 'Productos' },
    { key: 'ticket', label: 'Tickets' },
    { key: 'withdrawal', label: 'Retiros' },
  ];

  constructor(
    public pageService: PageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = params.id;
      this.userId && this.loadUser();
    });
  }

  private async loadUser(): Promise<void> {
    this.loading = true;
    try {
      this.userInfo =
        (
          await this.pageService.httpGet(
            `${this.pageService.global.settings.endPoints.users}/${this.userId}`
          )
        )?.data || {};

      this.country =
        (
          await this.pageService.httpGet(
            `${this.pageService.global.settings.endPoints.countries}/${this.userInfo.country}`
          )
        )?.data || {};
    } catch (error) {
      this.pageService.showError(error);
    } finally {
      this.loading = false;
    }
  }

  public getUserName(user: any): string {
    return `${user.username}`;
  }

  public formatPhoneNumber(): string {
    if (!this.userInfo?.phoneNumber) {
      return '';
    }
    return this.userInfo.phoneNumber.replace(
      /([+]\d{2})(\d*)(\d{4})(\d{4})$/,
      '($1) $2-$3-$4'
    );
  }
}
