import React from 'react';
import { UseCodeHelp } from '../widgets/use-code';

export enum HelpCenterCategoryEnum {
  'buy' = 'Comprar',
  'sell' = 'Vender',
  'my-account' = 'Mi cuenta',
  'frequent' = 'PREGUNTAS FRECUENTES',
  'regalos' = 'Regalos',
}

export const HelpCenterKind: {
  icon: string;
  label: string;
  category: keyof typeof HelpCenterCategoryEnum;
}[] = [
  { icon: 'buy', label: 'Comprar', category: 'buy' },
  { icon: 'sell', label: 'Vender', category: 'sell' },
  // { icon: 'my-account', label: 'Mi cuenta', category: 'my-account' },
  { icon: 'regalos', label: 'Regalos', category: 'regalos' },
];

type CategoryType = keyof typeof HelpCenterCategoryEnum;

export const HelpCenterTopics: {
  id: string;
  topic: string;
  category: CategoryType | CategoryType[];
  content?: string[];
  image?: string[];
  component?: React.ReactNode;
}[] = [
  {
    id: '0',
    topic: '¿Cómo comprar?',
    category: 'buy',
    content: [
      '<strong>Comprar</strong> en <strong>Mercado Gamer</strong> cualquier <strong>producto digital</strong> es <strong>sencillo, seguro y rápido</strong>. Conseguí cualquier <strong>producto digital en Argentina</strong>, como <strong>ítems, skins, monedas, packs</strong> y mucho más. Elegí la publicación que se adapte a lo que querés y lo pagas con Mercado Pago.',
      '<strong>Mercado Gamer</strong> es el sitio <strong>más seguro</strong> para <strong>comprar tus productos digitales</strong>, ya que cuentas con la <strong>Garantía MG</strong>.',
      'Todas las <strong>compras</strong> que se realizan en la plataforma de <strong>Mercado Gamer</strong> están <strong>protegidas</strong> por la <strong>Garantía MG</strong>, nos aseguramos de que te den el objeto que solicitaste, de no ser así, tu dinero será devuelto.',
      '<strong>¡ATENCIÓN!</strong> Es importante <strong>NO</strong> hacer clic en "<strong>Finalizar Transacción</strong>" sin haber recibido el producto, porque eso marca la orden como completada y se cierran los chats con el vendedor, por lo que no da tiempo a poder entregarle el producto.',
    ],
  },
  {
    id: '1',
    topic: 'Reclamos',
    category: 'buy',
    content: [
      'Todas las compras de <strong>Mercado Gamer</strong> se concretan excepto que el artículo no funcione o no sea el descripto.',
      '¿Cómo <strong>abro un reclamo</strong> en <strong>Mercado Gamer</strong>? <br>Si necesitas <strong>Abrir un Reclamo</strong> puedes hacerlo desde la orden del producto, haciendo clic en “<strong>Tuve un problema</strong>” y gracias a la <strong>Garantía MG</strong> te ayudaremos a resolver la situación.',
      '¡Desde el soporte de Mercado Gamer estamos para ayudarte!',
    ],
  },
  {
    id: '2',
    topic: 'Cuota de procesamiento',
    category: 'buy',
    content: [
      'En <strong>Mercado Gamer</strong> tenemos las <strong>comisiones más bajas del mercado</strong>. Debido a las comisiones de las plataformas de pago, se cobra un 4% del monto total y 25 $ por transacción. Este dinero será agregado al monto antes de pagar. Es obligatorio y te <strong>asegura</strong> obtener la <strong>Garantía MG.</strong>',
    ],
  },
  {
    id: '3',
    topic: 'Cancelaciones',
    category: 'buy',
    content: [
      'En caso de que una <strong>compra se canceló</strong>, el usuario recibirá un <strong>reembolso completo</strong> y podrá calificar al vendedor. Los vendedores pueden cancelar una venta en cualquier momento, sea por falta de stock, porque el comprador lo solicita o cualquier otra situación.',
    ],
  },
  {
    id: '4',
    topic: 'Calificaciones',
    category: 'buy',
    content: [
      'Puedes <strong>calificar</strong> a los <strong>vendedores en Mercado Gamer</strong>, luego de finalizar la orden. Esto ayuda muchísimo a los próximos usuarios, para tener referencias del vendedor antes de realizar la compra.',
      '¡Aviso! El vendedor también puede calificarte, al finalizar la orden. Mide tus palabras con los vendedores para obtener una buena reputación y ser un cliente grato en tus próximas compras.',
    ],
  },
  {
    id: '15',
    topic: 'Garantía MG',
    category: 'buy',
    content: [
      'La <strong>Garantía MG</strong> aplica para los siguientes casos:<br>- No recibí el ítem comprado.<br>- El ítem no funciona o no es el descripto.',
      'Procedimiento para <strong>solicitar Garantía MG</strong>:',
      '&emsp;1. Contacta por el chat con el Vendedor y coméntale la situación. Por lo general, los vendedores intentan solventar el problema.',
      '&emsp;2. En caso de que el Vendedor no te haya solucionado el problema, dirígete a "Compras" y busca la compra en la cual tienes el problema, una vez identificada, haz clic en "Tuve un problema" y descríbelo a nuestra área de soporte.',
      '&emsp;3. Esto pausará el contador automático de finalización de la compra y enviará tu caso al soporte de Mercado Gamer, para poder revisar el problema y asistirte. Es probable que te pidamos información adicional para comprobar tu reclamo, una vez sea verificado, enviaremos la resolución a ambos. Si no podemos resolver la situación, reembolsaremos tu dinero.',
    ],
  },
  {
    id: '5',
    topic: 'Usar código',
    category: 'buy',
    component: <UseCodeHelp />,
  },
  {
    id: '6',
    topic: '¿Cómo vender?',
    category: 'sell',
    content: [
      '<strong>Publicar</strong> un producto en <strong>Mercado Gamer</strong> es <strong>gratuito y muy fácil</strong>.',
      `¿Cómo publico un producto en Mercado Gamer?
      <ul style="
    list-style: decimal;
    margin-left: 2em;
">
      <li>Dirígete a "Mi Cuenta", y en la sección de "Ventas", haz clic en "Productos".</li>
      <li>Seleccionas el tipo de publicación que desees hacer y sigues los pasos para la carga de la misma.</li>
      <li>Por último, ten en cuenta que el precio del producto digital se coloca en dólares. ¡Y listo! Una vez hayas cargado toda la información, haz clic en "Publicar" y tu producto ya estará en el mercado.</li>
      </ul>
      `,
      '(Todos los productos publicados pasan por revisión de nuestro soporte)',
      'Una vez entregado el producto, queda esperar a que el cliente verifique y finalice la orden. De no ser así, pasadas las 72 hs desde que se creó, se finalizara automáticamente y tu dinero será depositado de forma instantánea en tu balance, donde puedes usarlo como descuento en futuras compras o retirarlo por el medio que desees. ',
    ],
  },
  {
    id: '7',
    topic: 'Método de entrega',
    category: 'sell',
    content: [
      'Como <strong>vendedor</strong> tienes 2 formas de <strong>entregar tu producto</strong>:',
      '<strong>Entrega Automática</strong>:<br> Elegí esta forma de entrega si tu <strong>producto es canjeable</strong> con un <strong>código</strong>. Al hacer la publicación, colocas el <strong>código canjeable</strong> y cuando se venda, el comprador lo recibirá instantáneamente.',
      '<strong>Entrega Coordinada</strong>:<br> Elegí esta forma de entrega si necesitas <strong>coordinar</strong> con tu comprador para la <strong>entrega del producto</strong>. Se abrirá el chat al momento en el que se realice la compra.',
    ],
  },
  {
    id: '9',
    topic: 'Garantía MG',
    category: 'sell',
    content: [
      'Todas las compras en <strong>Mercado Gamer</strong> están respaldadas por la <strong>Garantía MG</strong>, si no recibes el producto como estaba detallado en la publicación te devolveremos tu dinero.',
      '¿Cómo <strong>afecta</strong> esto <strong>a los vendedores</strong>?<br>Este sistema no es únicamente para respaldar al comprador. Cuando un usuario abre un reclamo, el vendedor también puede defenderse. Nuestro soporte se encarga de revisar cada solicitud de reclamo de manera parcial, es decir, si como vendedor puedes probar que entregaste el producto requerido y realmente la solicitud de reclamo está mal intencionada, cancelaremos el reclamo y la compra se concretará.',
    ],
  },
  {
    id: '10',
    topic: 'Comisiones',
    category: 'sell',
    content: [
      'Las <strong>comisiones</strong> para los vendedores se basan en el <strong>tipo de publicación</strong> que estás creando, que son las siguientes:',
      '<strong>Publicación Gratuita</strong>: <br>La <strong>publicación gratuita de Mercado Gamer</strong> es de un solo uso para que puedas probar el sistema <strong>gratis</strong>, 0% de comisión en la venta.',
      '<strong>Publicación Normal</strong>: <br>Esta es la <strong>publicación estándar</strong> de <strong>Mercado Gamer</strong>, la cual tiene la <strong>comisión más baja</strong>, es del  7% + IVA = 8,47%',
      `<strong>Publicación PRO</strong>:<br> 
      Sin lugar a duda, esta es <strong>la mejor publicación para los vendedores</strong>, ya que la comisión no es mucho más alta que la normal y tiene beneficios muy útiles para concretar más ventas. La comisión es de 10% + IVA = 12,1%.<br>
      Los <strong>beneficios de la publicación PRO</strong> son: 
      <ul style="
    margin-left: 2em;
    list-style: decimal;
">
      <li>La posibilidad de que tu publicación <strong>aparezca en el home</strong>.<br>
       (todas las publicaciones del home son PRO)</li>
       <li>Tu producto <strong>se recomendará mucho más</strong> que uno normal.</li>
       <li>Aparecerá en las <strong>primeras opciones de las búsquedas</strong>.
       (para esto también importa tu reputación como vendedor)</li>
       </ul>
      `,
    ],
  },
  {
    id: '11',
    topic: 'Códigos de descuento y afiliados',
    category: 'sell',
    content: [
      '<strong>Mercado Gamer</strong> se hace cargo de los <strong>descuentos que ofrece a los usuarios</strong>, los vendedores reciben lo que les corresponde por la venta.',
    ],
  },
  {
    id: '12',
    topic: 'Cancelaciones',
    category: 'sell',
    content: [
      'Como vendedor puedes <strong>cancelar</strong> una venta en <strong>cualquier momento</strong>. ¡Pero ten cuidado! <br><strong>Cancelar una venta podría dañar tu reputación</strong> y hacerte perder más ventas.',
    ],
  },
  {
    id: '13',
    topic: 'Ganancias',
    category: 'sell',
    content: [
      `Como vendedor vas a ir <strong>acumulando tus ganancias</strong> y podrás <strong>retirarlas cuando quieras</strong>. <br>Los retiros de dinero, los realizamos los días martes y viernes.<br>
      (En caso de retirar el dinero el mismo día que efectuamos los retiros, puede que tengas que esperar al siguiente día de retiro, para darnos tiempo a validar las ganancias.)
      `,
    ],
  },
  {
    id: '14',
    topic: 'Reputación',
    category: 'sell',
    content: [
      `Las <strong>calificaciones en Mercado Gamer</strong> son de suma importancia. Como vendedor, cuanto <strong>mejor</strong> sea tu <strong>calificación promedio</strong>, mucho <strong>mayor</strong> será tu <strong>alcance a usuarios</strong>, ya que aparecerás en los primeros lugares de búsqueda y tus productos se recomendarán con mayor frecuencia.`,
    ],
  },
  {
    id: '101',
    topic: '¿Como comprar en Mercado Gamer?',
    category: 'frequent',
    content: [
      `
        <strong>Comprar</strong> en <strong>Mercado Gamer</strong> cualquier <strong>producto digital</strong> es <strong>sencillo</strong>, <strong>seguro y rápido</strong>. Conseguí cualquier <strong>producto digital en Argentina</strong>, como <strong>ítems, skins, monedas, packs</strong> y mucho más. Elegí la publicación que se adapte a lo que querés y lo pagas con Mercado Pago.
        <br><br>
        <strong>Mercado Gamer</strong> es el sitio <strong>más seguro</strong> para <strong>comprar tus productos digitales</strong>, ya que cuentas con la <strong>Garantía MG</strong>.
        <br><br>
        Todas las <strong>compras</strong> que se realizan en la plataforma de <strong>Mercado Gamer</strong> están <strong>protegidas</strong> por la <strong>Garantía MG</strong>, nos aseguramos de que te den el objeto que solicitaste, de no ser así, tu dinero será devuelto.
        <br><br>
        <strong>¡ATENCIÓN!</strong> Es importante <strong>NO</strong> hacer clic en "<strong>Finalizar Transacción</strong>" sin haber recibido el producto, porque eso marca la orden como completada y se cierran los chats con el vendedor, por lo que no da tiempo a poder entregarle el producto.
      `,
    ],
  },
  {
    id: '102',
    topic: '¿Como vender en Mercado Gamer?',
    category: 'frequent',
    content: [
      `
            <strong>Publicar</strong> un producto en <strong>Mercado Gamer</strong> es <strong>gratuito y muy fácil</strong>.
      `,
      `
      ¿Cómo <strong>publico un producto</strong> en <strong>Mercado Gamer</strong>?
      <ul style="list-style: decimal; margin-left: 2em;">
          <li style="padding-left: 1em;">
            Dirígete a "<strong>Mi Cuenta</strong>", y en la sección de "<strong>Ventas</strong>", haz clic en "<strong>Productos</strong>".
          </li>
          <li style="padding-left: 1em;">
            Seleccionas el <strong>tipo de publicación</strong> que desees hacer y sigues los pasos para la carga de la misma.
          </li>
          <li style="padding-left: 1em;">
            Por último, ten en cuenta que el <strong>precio del producto digital</strong> se coloca en dólares. ¡Y listo! Una vez hayas cargado toda la información, haz clic en "<strong>Publicar</strong>" y tu producto ya estará en el mercado.
          </li>
      </ul>
      <div style="margin-left: 1em;">(Todos los productos publicados pasan por revisión de nuestro soporte)</div>
      `,
    ],
  },
  {
    id: '103',
    topic: '¿Qué es la Garantía MG?',
    category: 'frequent',
    content: [
      `
        Todas las compras en <strong>Mercado Gamer</strong> están respaldadas por la <strong>Garantía MG</strong>, si no recibes el producto como estaba detallado en la publicación te devolveremos tu dinero.<br>
        Este sistema no es únicamente para respaldar al comprador. Cuando un usuario abre un reclamo, el vendedor también puede defenderse. Nuestro soporte se encarga de revisar cada solicitud de reclamo de manera parcial, es decir, si como vendedor puedes probar que entregaste el producto requerido y realmente la solicitud de reclamo está mal intencionada, cancelaremos el reclamo y la compra se concretará. 
      `,
    ],
  },
  {
    id: '104',
    topic: '¿Cuáles son los métodos de entrega en Mercado Gamer?',
    category: 'frequent',
    content: [
      `
        Existen 2 formas de <strong>entregar los productos</strong>:
        <br><br>
        <div style="margin-left: 1em;">
        <strong>Entrega Automática:</strong> <br>
        Elegí esta forma de entrega si tu <strong>producto es canjeable</strong> con un <strong>código</strong>. Al hacer la publicación, colocas el <strong>código canjeable</strong> y cuando se venda, el comprador lo recibirá instantáneamente.
        <br><br>
        <strong>Entrega Coordinada:</strong> 
        Elegí esta forma de entrega si necesitas <strong>coordinar</strong> con tu comprador para la <strong>entrega del producto</strong>. Se abrirá el chat al momento en el que se realice la compra.
        </div>
      `,
    ],
  },
  {
    id: '105',
    topic: '¿Qué es la Ruleta de Regalos de Mercado Gamer?',
    category: ['frequent', 'regalos'],
    content: [
      `
      <strong>La Ruleta de Regalos</strong> de <strong>Mercado Gamer</strong> es la mejor forma de conseguir <strong>premios gratis todos los días</strong>. Siendo de <strong>Argentina</strong> o cualquier parte del mundo, podrás probar suerte y ganar mucha plata  para comprar o usarla como descuento en la compra, de Juegos, Monedas, Skins, Gift Cards y mucho más.
      `,
      '¡No pierdas más tiempo y ven a girar la <strong>Ruleta de Regalos todos los días!</strong>',
    ],
  },
  {
    id: '106',
    topic: '¿Cómo uso los premios de la Ruleta de Regalos?',
    category: ['frequent', 'regalos'],
    content: [
      'La Ruleta de Regalos de Mercado Gamer ofrece una gran cantidad de premios. Estos van a ir acumulándose en tu balance y podrás utilizarlos para la compra de cualquier producto digital que encuentres en nuestro marketplace.',
      'Para utilizar tu balance, tienes que tocar en “Usar descuento” dentro de tu carrito de compras, en la parte inferior, al lado izquierdo del botón naranja de “Iniciar compra”. Y se te abrirá una ventana en la que colocaras la cantidad de balance que quieras utilizar y al tocar en “Aplicar descuento” se te descontara del monto total a pagar.',
    ],
  },
  {
    id: '107',
    topic: '¿Qué premios tiene la Ruleta de Regalos de Mercado Gamer?',
    category: ['frequent', 'regalos'],
    content: [
      'Con la Ruleta de Regalos de Mercado Gamer podrás conseguir mucho dinero. ¡Hasta $2500 en una tirada! Proba suerte y gira la Ruleta de Regalos para conseguir plata gratis todos los días. ¡En Mercado Gamer siempre ganas!',
      'Podrás conseguir productos digitales gratis o con grandes descuentos por girar nuestra Ruleta de Regalos todos los días.',
    ],
  },
  {
    id: '108',
    topic: '¿Qué puedo vender en Mercado Gamer?',
    category: 'frequent',
    content: [
      `
      En <strong>Mercado Gamer</strong> puedes publicar cualquier tipo de <strong>producto digital canjeable</strong> o transferible, está pensado para que puedan publicar sus <strong>ítems digitales</strong> y obtener <strong>beneficios económicos</strong> por ellos, sean <strong>skins, packs, gift cards, monedas</strong> y más.
      <br>¡Lo que no te sirve a vos, siempre le viene bien a otro!
      `,
    ],
  },
  {
    id: '109',
    topic: '¿Por que comprar en Mercado Gamer te conviene?',
    category: 'frequent',
    content: [
      `
      Querés saber ¿Dónde comprar juegos baratos de PS4, PS5, Xbox y más?, o ¿Dónde comprar Pavos, Diamantes, Skins, Packs, etc.? <strong>¡Mercado Gamer es la que más te conviene!</strong>
      `,
      `
      ¿Por qué? <br/>
      Porque podés comprar Juegos, Skins, Items, Gift Cards y más al mejor precio. <strong>¡En pesos y sin impuesto país estando en Argentina!</strong> Disponemos de entrega al instante las 24hs. <strong>¡Todos los medios de pago!</strong>
      ¡Y por si fuera poco! Tenés la Garantía MG que te cuida mientras estás comprando.
      `,
      '<strong>¡Queremos lo mejor para todos los Players!</strong>',
      `
      Además, te permitimos que publiques tus skins, items y demás productos digitales que te sobren y así puedas convertirlos en dinero real. Tanto para usarlo dentro de la plataforma comprando algo que te guste o retirando el dinero por transferencia bancaria. <strong>¡Conocernos te conviene, vinimos para ayudarte!</strong>
      `,
    ],
  },
  {
    id: '110',
    topic: '¿Donde comprar Pavos para Fortnite barato?',
    category: 'frequent',
    content: [
      '<strong>La mejor opción para comprar Pavos/V-Bucks en Argentina es Mercado Gamer.</strong>',
      'Porque no pagas el impuesto a las compras extranjeras, por lo que te sale <strong>más barato</strong> y encima lo pagas en pesos y por <strong>Mercado Pago</strong>.',
      'Además de esto, por si fuera poco, tenés la <strong>Garantía MG</strong> que te acompaña en todo el proceso de la compra, desde que compras hasta que recibís tu producto y si te arrepentís u ocurre algún problema en el medio, te reembolsamos el total de tu dinero y como si no hubiese pasado nada.',
    ],
  },
  {
    id: '111',
    topic: '¿Donde comprar Diamantes para Free Fire barato?',
    category: 'frequent',
    content: [
      '<strong>La mejor opción para comprar Diamantes de Free Fire en Argentina es Mercado Gamer.</strong>',
      `
      ¡Podés pagarlo en pesos y por Mercado Pago! ¡Te sale más barato! <strong>¿Por qué?</strong><br />
      Porque como somos de Argentina, no pagas el 75% de impuesto país. Y además, gracias a la Garantía MG vas a estar seguro en todo el momento de tu compra, te ayudamos a que recibas tu producto correctamente o si te arrepentís u ocurre algún problema en el medio, te reembolsamos el total de tu dinero y como si no hubiese pasado nada.
      `,
    ],
  },
  {
    id: '112',
    topic: '¿Donde comprar Robux baratos para Roblox?',
    category: 'frequent',
    content: [
      `Querés saber ¿Dónde comprar Robux baratos? O ¿Dónde conseguir Robux gratis? <strong>¡Tenés que conocer a Mercado Gamer!</strong>`,
      'Jugando a nuestra Ruleta de Regalos vas a conseguir premios todos los días y podrás obtener descuentos increíbles y hasta poder <strong>conseguir gratis tus códigos de Robux</strong> para Roblox.',
      'Además, somos de Argentina, por lo que no pagas el 75% extra de impuesto país. Paga en pesos y por Mercado Pago. ¡Y por si ya todo esto fuera poco! Con la Garantía MG vas a estar seguro en todo el proceso de tu compra hasta que recibas tu producto correctamente y de no ser así, te devolvemos el total de tu dinero.',
    ],
  },
  {
    id: '113',
    topic: '¿Donde comprar skins de Counter Strike baratas y en pesos?',
    category: 'frequent',
    content: [
      'El mejor sitio para comprar tus <strong>skins de CSGO</strong> en Argentina es Mercado Gamer. ¿Por qué?',
      'Porque puedes pagarlas en pesos y por Mercado Pago, y como somos de Argentina, no pagas el 75% extra de impuesto país.<br />Además, te permitimos que publiques tus skins, stickers, cajas, llaves y demás ítems que te sobren y así puedas convertirlos en dinero real. Tanto para usarlo dentro de la plataforma comprando algo que te guste o retirando el dinero por transferencia bancaria.',
      '¡Y por si ya todo esto fuera poco! Con la Garantía MG vas a estar seguro en todo el proceso de tu compra hasta que recibas tu producto correctamente y de no ser así, te devolvemos el total de tu dinero.',
    ],
  },
  {
    id: '114',
    topic: '¿Donde comprar Diamantes de Mobile Legends barato?',
    category: 'frequent',
    content: [
      'Querés saber ¿Dónde comprar Diamantes de Mobile Legends? O ¿Dónde recargar Diamantes de Mobile Legends?',
      'La mejor opción para comprar y recargar tus <strong>Diamantes de Mobile Legends</strong> es Mercado Gamer.',
      '¡Podés pagarlo en pesos y por Mercado Pago! ¡Te sale más barato! ¿Por qué?<br />Porque como somos de Argentina, no pagas el 75% de impuesto país. ',
      '¡Y por si ya todo esto fuera poco! Con la Garantía MG vas a estar seguro en todo el proceso de tu compra hasta que recibas tu producto correctamente y de no ser así, te devolvemos el total de tu dinero.',
    ],
  },
  {
    id: '115',
    topic: '¿Donde comprar Juegos digitales seguro y rápido?',
    category: 'frequent',
    content: [
      'Si te estás preguntando: ¿Dónde comprar juegos digitales baratos? O ¿Dónde comprar juegos digitales de PS3, PS4, PS5, Xbox, Nintendo y más? <strong>¡Tenés que conocer a Mercado Gamer!</strong>',
      '¿Por qué Mercado Gamer es el mejor lugar para comprar tus juegos?',
      '¡Puedes pagarlos en pesos y por Mercado Pago, y sale más barato porque no pagas el 75% de impuesto país en Argentina!<br /> ¡Y por si ya todo esto fuera poco! Ofrecemos la Garantía MG para que estés seguro en todo el proceso de tu compra, te cuidamos para que recibas tu producto correctamente y de no ser así, te devolvemos el total de tu dinero.',
    ],
  },
  {
    id: '116',
    topic: '¿Dónde comprar Juegos para PlayStation barato?',
    category: 'frequent',
    content: [
      'Si te estás preguntando: ¿Dónde comprar juegos de Play? O ¿Dónde comprar juegos de PS3, PS4, PS5? <strong>¡Tenés que conocer a Mercado Gamer!</strong>',
      'Porque puedes pagar en pesos y por Mercado Pago, y como somos de Argentina, no pagas el 75% extra de impuesto país.',
      'Además, jugando a nuestra Ruleta de Regalos vas a conseguir premios todos los días y podrás obtener descuentos increíbles en tus juegos de PlayStation.',
      '¡Y por si ya todo esto fuera poco! Ofrecemos la Garantía MG para que estés seguro en todo el proceso de tu compra, te cuidamos para que recibas tu producto correctamente y de no ser así, te devolvemos el total de tu dinero.',
    ],
  },
  {
    id: '117',
    topic: '¿Dónde comprar Juegos para Xbox barato?',
    category: 'frequent',
    content: [
      'Si te estás preguntando: ¿Dónde comprar juegos de Xbox 360 o Xbox one? O ¿Dónde comprar el Xbox game pass al mejor precio en Argentina? <strong>¡Tenés que conocer a Mercado Gamer!</strong>',
      'Porque puedes pagar en pesos y por Mercado Pago, y como somos de Argentina, no pagas el 75% extra de impuesto país.',
      'Además, jugando a nuestra Ruleta de Regalos vas a conseguir premios todos los días y podrás obtener descuentos increíbles en tus juegos, items, gift gard y más de Xbox.',
      '¡Y por si ya todo esto fuera poco! Ofrecemos la Garantía MG para que estés seguro en todo el proceso de tu compra, te cuidamos para que recibas tu producto correctamente y de no ser así, te devolvemos el total de tu dinero.',
    ],
  },
  {
    id: '118',
    topic: '¿Como invitar amigos y recibir tu drop extra en la Ruleta de Regalos?',
    category: ['frequent', 'regalos'],
    content: [
      '¡Muchas gracias por tu interés en compartir nuestra plataforma con tus amigos!',
      `
      Para conseguir un drop extra en nuestra Ruleta de Regalos debes seguir los siguientes pasos:
      <ol>
        <li>En la página de “Regalos” ya habiendo usado tu tirada diaria, verás un botón que dice “Invitar un amigo”, al clickear en este, se abrirá un menú donde podrás ver tu link de referido.</li>
        <li>Envía tu link de referido a un amigo o a todos los que vos quieras.</li>
        <li>Tu amigo invitado se deberá registrar a través del link que le has enviado.</li>
      </ol>
      `,
      'Una vez que tu amigo ya se registró, aparecerá en el menú de “Invitar un amigo”, en la sección de “Tus invitaciones”.',
      `
      Estados de la invitación:

      <ol>
        <li>Tu amigo <span style="color: #F78A0E">se registró</span>, pero aún no jugo en la Ruleta de Regalos.</li>
        <li>Tu amigo ya <span style="color: #3BD42B">verifico su telefono</span>, <strong>YA TENES TU DROP EXTRA</strong>.</li>
        <li>Ya <span style="color: #4B4E5B">utilizaste tu drop extra</span>, finalizo el ciclo.</li>
      </ol>
      `,
      '<strong>AVISO</strong>: Para ganar tu Drop Extra, los amigos invitados deben ser usuarios que nunca se hayan registrado en Mercado Gamer',
    ],
  },
  {
    id: '119',
    topic: '¿Es peligroso comprar cuentas primarias o secundarias?',
    category: 'frequent',
    content: [
      'Desde Mercado Gamer queremos avisarles de antemano que el comprar cuentas primarias o secundarias, puede traer problemas luego.',
      'Nosotros tenemos los datos para contactar a ambas partes, pero igualmente no tenemos forma de validar que el producto no tenga algún problema con el tiempo.',
      'Recomendamos, comprar este tipo de juegos a vendedores grandes y con buenas calificaciones dentro de la plataforma, los cuales pueden ser más confiables a la hora de resolver algún problema.',
      'Si te ha ocurrido algún problema con este tipo de productos, contáctate con nosotros y haremos lo posible para ayudarte (soporte@mercadogamer.com).',
    ],
  },
];
