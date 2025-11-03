import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-status-icon',
  templateUrl: './order-status-icon.component.html',
  styleUrls: ['./order-status-icon.component.scss'],
})
export class OrderStatusIconComponent implements OnInit {
  @Input() status: string;
  constructor() {}

  ngOnInit(): void {}
}
