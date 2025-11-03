import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-mercado-dialog',
  templateUrl: './mercado-dialog.component.html',
  styleUrls: ['./mercado-dialog.component.scss'],
})
export class MercadoDialogComponent implements OnInit {
  // props
  @Input() open = false;
  @Input() class = '';
  @Input() width: number | string = '';
  @Input() height: number | string = '';

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCloseDialog = new EventEmitter<void>();

  @ViewChild('dialogContainer') dialogContainer: ElementRef;
  constructor() {}

  ngOnInit(): void {}

  // tslint:disable-next-line: use-lifecycle-interface

  getStyle(): any {
    const style: any = {};
    if (this.width) {
      style.width =
        typeof this.width === 'number' ? `${this.width}px` : this.width;
    }
    if (this.height) {
      style.height =
        typeof this.height === 'number' ? `${this.height}px` : this.height;
    }
  }

  onClickDialog(event): void {
    console.log({ event });
  }

  onClickContainer(event: MouseEvent): void {
    this.onCloseDialog.emit();
  }
}
