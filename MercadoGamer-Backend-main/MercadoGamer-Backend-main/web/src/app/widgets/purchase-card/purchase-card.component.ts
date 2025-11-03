import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService } from 'src/app/core/global.service';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-purchase-card',
  templateUrl: './purchase-card.component.html',
  styleUrls: ['./purchase-card.component.scss'],
})
export class PurchaseCardComponent implements OnInit {
  @Input() title: string;
  @Input() price: string;
  @Input() imageUrl: string;
  @Input() quantity: string;
  @Input() status: string;
  @Input() date: string;

  global: GlobalService;

  constructor(public pageService: PageService) {
    this.global = pageService.global;
  }

  ngOnInit(): void {}
}
