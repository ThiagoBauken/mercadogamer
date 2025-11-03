import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import { Params }from '@angular/router';
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent extends BaseComponent {

  sell = false;
  buy = true;
  products: {[k: string]: any}[];
  option = '11';
  QAs = {
    option1: {
      question: '¿Cómo vendo en Mercado Gamer?',
      answer0: 'Publicar un producto en Mercado Gamer es gratuito y muy fácil.',
      answer1: 'Para empezar dirígete a "Mi Cuenta" - "Ventas" - "Productos"',
      answer2: 'Ahora damos click en "Agregar Producto"',
      answer3: 'En este punto nos dejará elegir el tipo de publicación, si es tu primera vez publicando un producto puedes elegir la publicación gratuita.',
      answer4: 'Es momento de cargar toda la información sobre el producto que vas a vender:',
      answer5: 'Y listo! Una vez hayas cargado toda la información clickea en "Publicar" y tu producto ya estará en el mercado!',
      answer6: '(Todos los productos publicados pasan por revisión de nuestro soporte)',
    },
    option2: {
      question: 'Entregas',
      answer0: 'Como vendedor tienes 2 formas de entregar tu producto:',
      answer1: 'Entrega Automática: Colocas el código al hacer la publicación y cuando se venda, el comprador lo recibirá instantáneamente.',
      answer2: 'Entrega Coordinada: Elegí esta forma de entrega si necesitas coordinar con tu comprador por el chat para la entrega del producto.'
    },
    option3: {
      question: 'Garantía MG',
      answer0: 'Todas las compras en la plataforma Mercado Gamer están respaldadas por la Garantía MG, si no recibes el producto como estaba detallado en la publicación te devolveremos tu dinero.',
      answer1: '¿Cómo afecta esto a los vendedores?',
      answer2: 'Este sistema no es únicamente para respaldar al comprador, cuando un usuario abre un reclamo, el vendedor también puede defenderse. Nuestro soporte se encarga de revisar cada solicitud de reclamo de manera parcial, es decir, si como vendedor puedes probar que entregaste el producto requerido y realmente la solicitud de reclamo está mal intencionada, cancelaremos el reclamo y la compra se concretará.'
    },
    option4: {
      // question: 'Pregunta 4',
      // answer0: 'Respuesta 1-1',
      // answer1: 'Respuesta 1-1',
      // answer2: 'Respuesta 1-2',
      // answer3: 'Respuesta 1-3'
    },
    option5: {
      question: 'Comisiones',
      answer0: 'Las comisiones para los vendedores se basan en el tipo de publicación que estás creando, que son las siguientes:',
      answer1: 'Publicación Gratuita: Este tipo de publicación es de un solo uso para que puedas probar el sistema de manera gratuita, 0% de comisión en la venta.',
      answer2: 'Publicación Normal: Esta es la publicación estándar de la página, la cual tiene la comisión más baja, 7% + IVA = 8,47%',
      answer3: 'Publicación PRO: Sin lugar a duda, esta es la mejor publicación para los vendedores ya que la comisión no es mucho más alta que la normal y tiene beneficios muy útiles para concretar más ventas. En concreto los beneficios son; la posibilidad de que tu publicación aparezca en el home (todas las publicaciones del home son PRO), tu producto se recomendará mucho más que uno normal y aparecerá en los primeros lugares de las búsquedas (para esto también importa tu reputación como vendedor). La comisión es de 10% + IVA = 12,1%.'
    },
    option6: {
      // question: 'Pregunta 6',
      // answer0: 'Respuesta 1-1',
      // answer1: 'Respuesta 1-1',
      // answer2: 'Respuesta 1-2',
      // answer3: 'Respuesta 1-3'
    },
    option7: {
      question: 'Códigos de descuento y afiliados',
      answer0: 'Mercado Gamer se hace cargo de los descuentos que ofrece a los usuarios, los vendedores reciben lo que les corresponde por la venta.'
    },
    option8: {
      // question: 'Pregunta 1',
      // answer0: 'Respuesta 1-1',
      // answer1: 'Respuesta 1-1',
      // answer2: 'Respuesta 1-2',
      // answer3: 'Respuesta 1-3'
    },
    option9: {
      question: 'Cancelaciones',
      answer0: 'Como vendedor puedes cancelar una venta en cualquier momento, pero ten cuidado cancelar una venta podría dañar tu reputación y hacerte perder ventas, debido a que el comprador podrá calificarte.'
    },
    option10: {
      question: 'Retirar ganancias',
      answer0: 'Lo primero que debes saber es que para poder retirar la ganancia de una venta la misma tiene que estar concretada, es decir, si está en proceso no podremos retirar.',
      answer1: 'Para retirar tus ganancias de la página tendrás que dirigirte a "Mi Cuenta" - "Ventas" - "Retirar"',
      answer2: 'Lo primero que tendrás que hacer será elegir el medio de pago por el cual quieres recibir el pago (Mercado Pago o CBU/CVU)',
      answer3: 'Por último daremos click en "Retirar", elegimos el medio que previamente configuramos y el monto a retirar.',
      answer4: 'Una vez enviada la solicitud de retirada tendrás que esperar a que te enviemos el pago, enviamos todos los pagos los Martes y Viernes.'
    },
    option11: {
      question: '¿Cómo compro en Mercado Gamer?',
      answer0: 'Comprar cualquier item en nuestro marketplace es sencillo, seguro y rápido. Son solo unos pocos segundos, busca lo que queres comprar, elegís la publicación que se amolde a lo que buscas y lo pagas mediante Mercado Pago!',
      answer1: 'Mercado Gamer es el sitio más seguro para comprar tus productos ya que contas con la Garantía MG.'
    },
    option12: {
      question: 'Reclamos',
      answer0: 'Todas las compras de Mercado Gamer se concretan excepto que el artículo no funcione o no sea el descripto, en esos casos puedes "Abrir Reclamo" desde la página de orden y por medio de la Garantía MG te ayudaremos a resolver la situación.',
      answer1: '¡ATENCIÓN! Es importante NO hacer click en "Finalizar Compra" hasta que no esté finalizada la compra ya que al hacerlo estás cerrando la transacción.',
      answer2: 'Garantía MG',
      answer3: 'Todas las compras que se realizan en la plataforma de Mercado Gamer están protegidas por la Garantía MG, nos aseguramos de que te den el objeto que solicitaste o tu dinero devuelta.',
      answer4: 'La Garantia MG aplica para los siguientes casos:',
      answer5: '- No recibí el ítem comprado.',
      answer6: '- El ítem no funciona o no es el descripto.',
      answer7: 'Procedimiento para solicitar Garantía MG:',
      answer8: '1: Contacta con el Vendedor y coméntale la situación, por lo general los vendedores intentan solventar el problema.',
      answer9: '2: En caso de que el Vendedor no te haya solucionado el problema, dirígete a "Compras" y busca la compra en la cual tenes el problema, una vez identificada click en "Abrir Reclamo".',
      answer10: '3: Esto pausara el contador automático de finalización de la compra y le enviara tu caso al soporte de Mercado Gamer para poder revisar tu caso y asistirte. Es probable que te pidamos información adicional para comprobar tu reclamo, una vez que verificamos el reclamo le enviamos la resolución a ambos. En caso de que tu reclamo se compruebe te reembolsaremos tu pago.',
    },
    option13: {
      // question: 'Pregunta 1',
      // answer0: 'Respuesta 1-1',
      // answer1: 'Respuesta 1-1',
      // answer2: 'Respuesta 1-2',
      // answer3: 'Respuesta 1-3'
    },
    option14: {
      // question: 'Pregunta 1',
      // answer0: 'Respuesta 1-1',
      // answer1: 'Respuesta 1-1',
      // answer2: 'Respuesta 1-2',
      // answer3: 'Respuesta 1-3'
    },
    option15: {
      question: 'Cuota de procesamiento',
      answer0: 'La cuota de procesamiento que toma Mercado Gamer por compra es de 4% (comisión por uso de plataforma de pago) + 25$.'
    },
    option16: {
      question: 'Cancelaciones',
      answer0: 'En caso de que una compra se cancele, el usuario recibirá un reembolso completo y podrá calificar al vendedor.'
    },
    option17: {
      question: 'Reputación',
      answer0: 'Las calificaciones en Mercado Gamer son de suma importancia, como vendedor cuanto mejor sea tu calificación promedio mucho mayor será tu alcance a usuarios, debido a que aparecerás en los primeros lugares de búsqueda y tus productos se recomendarán con mayor frecuencia.'
    },
    option18: {
      question: 'Calificaciones',
      answer0: 'Como comprador también recibiremos calificaciones por parte de los vendedores, es importante que seas paciente y respetuoso al hacer una compra porque sino podrán calificarte negativamente y esto influirá en nuestras próximas compras, ya que si un vendedor.'
    },
  };

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      switch (params.id) {
        case 'garantia-mg':
          this.option = '3';
          this.buy = false;
          this.sell = true;
          break;
        default:
          break;
      }
    })
    this.getProducts();
  }

  getProducts() {
    const endPoint = this.settings.endPoints.products;
    const filters = {
      status: this.settings.products.status.approved.code,
      stock: { $gt: 0 },
      discount: true,
      enabled: true
    };

    this.pageService.httpGetAll(endPoint, filters, { priority: 1 }, [ 'category' ], 1, 4)
    .then(res => this.products = res.data)
    .catch(e => this.pageService.showError(e));
  }

  goToProductDetail(id: string) {
    this.pageService.navigateRoute('product-detail/' + id);
  }
}
