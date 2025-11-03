import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-product-type',
  templateUrl: './card-product-type.component.html',
  styleUrls: ['./card-product-type.component.scss'],
})
export class CardProductTypeComponent implements OnInit {
  // props
  @Input() title: string;
  @Input() subTitle: string;
  @Input() imageUrl: string;
  @Input() borderColor = '#6FCF97';
  @Input() descLabel = 'Beneficios';
  @Input() descriptions: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  getUrl(): string {
    return `url('${this.imageUrl}')`;
  }
}
