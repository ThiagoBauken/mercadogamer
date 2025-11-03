import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = 'Buscar';
  get value(): string | number {
    return this._value;
  }
  @Input() set value(val: string | number) {
    this._value = val;
    this.valueChange.emit(val);
  }

  @Output() valueChange: EventEmitter<string | number> = new EventEmitter();

  _value: string | number = '';
  constructor() {}

  ngOnInit(): void {}
}
