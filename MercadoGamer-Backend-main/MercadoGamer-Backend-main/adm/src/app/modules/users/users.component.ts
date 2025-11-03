import { Component, OnInit } from '@angular/core';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public loading = false;
  public userCount = 0;
  public userList: any[] = [];
  public search = '';
  public currentPage = 1;
  public totalPage = 1;
  private perPage = 20;
  private searchInterval: NodeJS.Timeout;

  constructor(public pageService: PageService) {}

  ngOnInit(): void {
    this.getUserList();
  }
  async getUserList(): Promise<void> {
    this.loading = true;
    let filter = {};
    if (this.search) {
      filter = {
        $or: [
          { username: { $regex: this.search, $options: 'i' } },
          { last: { $regex: this.search, $options: 'i' } },
        ],
      };
    }
    try {
      const response = await this.pageService.httpGetAll(
        this.pageService.global.settings.endPoints.users,
        filter,
        { updatedAt: -1 },
        ['buyer', 'seller', 'country', 'product'],
        this.currentPage,
        this.perPage
      );

      const { count, data, pages } = response;
      this.userCount = count;
      this.totalPage = pages;
      this.userList = data;
    } catch (error) {
      this.pageService.showError(error);
    } finally {
      this.loading = false;
    }
  }

  public getUserName(user: any): string {
    return `${user.username}`;
  }

  public getUserLink(user: any): string {
    return `/users/${user.id}`;
  }

  public changeSearch(value: string): void {
    this.search = value;
    clearTimeout(this.searchInterval);
    this.searchInterval = setTimeout(() => {
      this.getUserList();
    }, 500);
  }

  public nextPage(): void {
    console.log('next page');
    this.currentPage++;
    this.getUserList();
  }

  public previousPage(): void {
    console.log('back page');

    if (this.currentPage < 2) return;
    this.currentPage--;
    this.getUserList();
  }
}
