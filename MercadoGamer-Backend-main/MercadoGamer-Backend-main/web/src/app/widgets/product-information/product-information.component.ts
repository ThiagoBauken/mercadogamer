import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageService } from 'src/app/core/page.service';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  styleUrls: ['./product-information.component.scss'],
})
export class ProductInformationComponent implements OnInit {
  // props
  @Input() imageUrl: string;
  @Input() name: string;
  @Input() price: number;
  @Input() showAction: boolean;
  @Input() content: { label: string; value: any; color: string }[];
  @Input() userInfo: {
    label: string;
    userName: any;
    id: string;
    email: string;
    image: string;
    type: string;
    showAction: boolean;
  };
  @Input() date: string;
  @Output() action = new EventEmitter();

  constructor(public pageService: PageService) {}

  ngOnInit(): void {}

  getImageStyle(url: string, second: string = ''): string {
    return `background-image:url('${url}')${
      second ? `, url('${second}')` : ''
    }`;
  }

  gotoProfilePage(): void {
    // this.userInfo.id &&
    //   this.pageService.navigateRoute(
    //     `profile/${this.userInfo.type}/${this.userInfo.id}`
    //   );
    // tslint:disable-next-line: no-unused-expression
    this.userInfo.id &&
      window.open(`profile/${this.userInfo.type}/${this.userInfo.id}`);
  }
}
