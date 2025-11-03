import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  // Props
  @Input() disabled = false;
  @Input() radius: number | string = 10;
  @Input() bgColor = '#F78A0E';
  @Input() borderColor = '#F78A0E';
  @Input() padding = '10px 16px';
  @Input() width: string | number = 'max-content';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() public btnClick: EventEmitter<MouseEvent> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.btnClick.emit(event);
  }

  getButtonStyle(): any {
    const style = {};
    style['--button-radius'] =
      typeof this.radius === 'number' ? `${this.radius}px` : this.radius;

    style['--button-color'] = this.bgColor;

    style['--button-padding'] = this.padding;

    style['--button-width'] =
      typeof this.width === 'number' ? `${this.width}px` : this.width;

    return style;
  }
}
