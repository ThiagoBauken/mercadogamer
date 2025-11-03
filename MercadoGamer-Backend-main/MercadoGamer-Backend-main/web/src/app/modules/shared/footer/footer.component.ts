import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent extends BaseComponent {
  public fotterMenu = {
    menu: [
      {
        name: 'Home',
        goto: 'home',
      },
      {
        name: 'Catalogo',
        goto: 'catalogue',
      },
      {
        name: 'Ayuda',
        goto: 'help/compras',
      },
      {
        name: 'Juegos',
        goto: 'catalogue/type/game',
      },
      {
        name: 'Gift Card',
        goto: 'catalogue/type/giftCard',
      },
    ],
    'mi-cuenta': [
      {
        name: 'Mis Compras',
        goto: 'my-account/shopping',
      },
      {
        name: 'Mis Ventas',
        goto: 'my-account/sales',
      },
      {
        name: 'Tickets',
        goto: 'my-account/tickets',
      },
      {
        name: 'Ajustes',
        goto: 'my-account/settings',
      },
      {
        name: 'Preguntas',
        goto: 'my-account/QAs',
      },
    ],
    legales: [
      {
        name: 'Terminos y condiciones',
        goto: 'terms',
      },
      {
        name: 'Politicas de privacidad',
        goto: 'privacy',
      },
    ],
  };

  goTo(page: string, check?: boolean): void {
    this.pageService.navigateRoute(check && !this.user ? 'login' : page);
  }

  testSocket(): void {
    this.pageService.socket.emit('test-socket', this.user.id);
    console.log('sent socket request');
  }
  windowOpen(page: string): void {
    window.open(page, '_blank');
  }
}
