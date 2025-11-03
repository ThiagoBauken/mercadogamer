import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { navBarContent } from './nav-bar-content';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  navBarContents = navBarContent;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  isActive(path: string): boolean {
    return new RegExp(`^${path}`, 'g').test(this.router.url);
  }
}
