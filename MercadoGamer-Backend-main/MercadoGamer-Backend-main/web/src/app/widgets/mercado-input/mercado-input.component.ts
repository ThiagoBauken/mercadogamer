import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-mercado-input',
  templateUrl: './mercado-input.component.html',
  styleUrls: ['./mercado-input.component.scss'],
})
export class MercadoInputComponent implements OnInit {
  // props
  @Input() label = '';
  @Input() placeholder = '';
  @Input() error = false;
  @Input() helper = '';
  @Input() type: 'text' | 'password' | 'number' = 'text';
  @Input() hideHelper = false;
  @Input() class = '';
  @Input() maxLength = 524288;
  @Input() editable = true;

  get value(): string | number {
    return this._value;
  }
  @Input() set value(val: string | number) {
    this._value = val;
    this.valueChange.emit(val);
  }
  // tslint:disable-next-line: no-output-native
  @Output() valueChange: EventEmitter<string | number> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFocus: EventEmitter<FocusEvent> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onBlur: EventEmitter<FocusEvent> = new EventEmitter();

  // variables
  // tslint:disable-next-line: variable-name
  _value: string | number = '';
  focus = false;
  constructor() {}

  @HostBinding('class') _class = this.class;

  ngOnInit(): void {}

  setFocus(event: FocusEvent, value: boolean): void {
    this.focus = value;
    value ? this.onFocus.emit(event) : this.onBlur.emit(event);
  }
}
