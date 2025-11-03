import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mercado-icon',
  templateUrl: './mercado-icon.component.html',
  styleUrls: ['./mercado-icon.component.scss'],
})
export class MercadoIconComponent implements OnInit {
  @Input() icon = '';

  link: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(
      `assets/icons/${this.icon}.svg`
    );
  }
}
