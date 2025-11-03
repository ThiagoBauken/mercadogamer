import {
  Component,
  HostBinding,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Location } from '@angular/common';
import { NavItem } from '../nav-item';
import { Router } from '@angular/router';
import { NavService } from '../nav.service';
import { Settings } from 'src/app/app.settings';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { navItems } from './nav-items';
import { PageService } from 'src/app/core/page.service';
import { GlobalService } from 'src/app/core/global.service';

@Component({
  selector: 'app-side-nav-item',
  templateUrl: './side-nav-item.component.html',
  styleUrls: ['./side-nav-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ],
})
export class SideNavItemComponent implements OnInit {
  private settings = Settings;
  // tslint:disable-next-line: variable-name
  nav_item = navItems;
  expanded = false;
  global: GlobalService;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;
  @Output() openSidebar: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public location: Location,
    public navService: NavService,
    public pageService: PageService,
    public router: Router
  ) {
    this.global = this.pageService.global;
  }

  ngOnInit(): void {}

  public onClickMenu(): void {
    this.openSidebar.emit();
  }

  checkLogin(): boolean {
    return this.pageService.global.getUser() ? true : false;
  }

  getUser(): any {
    return this.pageService.global.getUser();
  }

  public onItemSelected(item: NavItem): void {
    const user = localStorage.getItem(this.settings.storage.user);
    const notNeedUser = ['home', 'catalogue'];
    notNeedUser.includes(item.route)
      ? this.router.navigate([item.route])
      : this.router.navigate([user ? item.route : '/login']);
    this.navService.closeNav();
  }

  goProfilePage(): void {
    this.router.navigate([`/profile/user/${this.getUser().id}`]);
    this.navService.closeNav();
  }

  logout(): void {
    this.navService.closeNav();
    this.global.removeUser();
    this.pageService.navigateRoute('login');
  }
}
