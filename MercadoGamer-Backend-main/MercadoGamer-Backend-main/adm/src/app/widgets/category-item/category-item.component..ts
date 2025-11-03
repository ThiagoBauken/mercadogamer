import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
})
export class CategoryItemComponent implements OnInit {
  @Input() imageUrl = '';
  @Input() label = '';
  @Input() price = '';
  @Input() delivery = '';
  @Input() type = '';
  @Output() public middleClick: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(public pageService: PageService) {}

  @HostListener('mouseup', ['$event'])
  middleclickEvent(event: MouseEvent): void {
    if (event.which === 2) {
      event.stopPropagation();
      this.middleClick.emit(event);
    }
  }

  ngOnInit(): void {}

  getUrl(): string {
    return this.pageService.global.getBackgroundUrl(
      this.imageUrl,
      'assets/imgs/placeholder.png'
    );
  }
}
