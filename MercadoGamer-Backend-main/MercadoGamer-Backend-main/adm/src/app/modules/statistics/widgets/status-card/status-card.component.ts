import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss'],
})
export class StatusCardComponent implements OnInit {
  @Input() value: string;
  @Input() label: string;
  @Input() image: string;
  @Input() iconColor = '#B1DD8B';

  constructor() {}

  ngOnInit(): void {}

  getImageUrl(url: string): string {
    return `background-image:url('${url}')`;
  }
}
