import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-mercado-select',
  templateUrl: './mercado-select.component.html',
  styleUrls: ['./mercado-select.component.scss'],
})
export class MercadoSelectComponent implements OnInit {
  // props
  @Input() value: string | number = '';
  @Input() items: { text: string; value: string | number }[] = [];
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() error = false;
  @Input() helper: string = '';
  @Input() type: 'text' | 'password' | 'number' = 'text';
  @Input() hideHelper = false;
  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<string | number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onChange(event: MatSelectChange): void {
    this.change.emit(event.value);
  }
}
