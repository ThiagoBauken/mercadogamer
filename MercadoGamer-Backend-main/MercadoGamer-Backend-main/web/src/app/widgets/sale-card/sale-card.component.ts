import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/app/core/global.service';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-sale-card',
  templateUrl: './sale-card.component.html',
  styleUrls: ['./sale-card.component.scss'],
})
export class SaleCardComponent implements OnInit {
  @Input() title: string;
  @Input() price: string;
  @Input() imageUrl: string;
  @Input() quantity: string;
  @Input() status: string;
  @Input() commission: string;
  @Input() date: string;

  @Output() itemClick: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();
  global: GlobalService;

  constructor(public pageService: PageService) {
    this.global = pageService.global;
  }

  ngOnInit(): void {}

  onClick(): void {
    this.itemClick.emit();
  }
}
