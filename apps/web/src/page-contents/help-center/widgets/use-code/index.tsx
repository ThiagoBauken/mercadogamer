import { Icon } from '@widgets/icon';
import React, { useMemo, useState } from 'react';
import { UseCodeContent } from '../use-code-content';

export const UseCodeHelp: React.FC = () => {
  const [state, setState] = useState<{ topic: typeof codes[0] }>({ topic: null });

  const codes = useMemo<
    {
      label: string;
      icon: string;
      component: React.ReactNode;
      topic?: { topic: string; content?: string[]; image?: string[]; component?: React.ReactNode };
    }[]
  >(
    () => [
      {
        label: 'Play Station',
        icon: 'playstation',
        component: null,
        topic: {
          topic: 'Playstation: usar código',
          content: [
            '¿Cómo <strong>canjeo mi código de producto</strong> en PlayStation?',
            '1.       Ve a <strong>PlayStation Store</strong> y haz clic en tu avatar en la parte superior derecha de la pantalla.',
            '2.       Selecciona “<strong>Canjear código</strong>” en el menú desplegable.',
            '3.       Ingresa el <strong>código de activación</strong> y selecciona “<strong>Canjear</strong>”. ¡Y listo! Ya tienes el <strong>código canjeado</strong>.',
            '<strong>Juegos más reconocidos de esta plataforma:</strong>',
            `<div style="display: grid; grid-auto-flow: column;">
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Fortnite</li>
                <li style="padding-left: 1em;">FIFA</li>
                <li style="padding-left: 1em;">Call of Duty: Black Ops Cold War</li>
              </ul>
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">MARVEL'S SPIDER-MAN: MILES MORALES</li>
                <li style="padding-left: 1em;">Assassin's Creed Valhalla</li>
                <li style="padding-left: 1em;">NBA 2K21 y 2K22</li>
              </ul>
            </div>`,
          ],
        },
      },
      {
        label: 'Steam',
        icon: 'stream',
        component: null,
        topic: {
          topic: 'Steam',
          content: [
            '¿Cómo <strong>canjeo mi código de producto</strong> en Steam?',
            '1.       Abre Steam e inicia sesión en tu cuenta.',
            '2.       Haz clic en la opción de “Productos” en la parte superior de Steam.',
            '3.       Selecciona <strong>Activar un producto en Steam...</strong>',
            '4.       Aparecerá un acuerdo de suscriptor a Steam.',
            '5.       Luego podrás colocar tu <strong>clave de producto</strong> para ser canjeado. ¡Y listo! Ya tienes el código canjeado.',
            '',
            '<strong>Juegos más reconocidos de esta plataforma:</strong>',
            `<div style="display: grid; grid-auto-flow: column;">
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Counter Strike</li>
                <li style="padding-left: 1em;">Dota 2</li>
                <li style="padding-left: 1em;">PUBG</li>
                <li style="padding-left: 1em;">Apex Legends</li>
                <li style="padding-left: 1em;">GTA V</li>
              </ul>
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">ARK</li>
                <li style="padding-left: 1em;">RUST</li>
                <li style="padding-left: 1em;">FALL GUYS</li>
              </ul>
            </div>`,
          ],
        },
      },
      {
        label: 'Epic Games',
        icon: 'epic',
        component: null,
        topic: {
          topic: 'EPIC GAMES',
          content: [
            '¿Cómo <strong>canjeo mi código de producto</strong> en Epic Games?',
            '<strong>Cliente de Epic Games</strong>',
            '1.       Abre Epic Games e inicia sesión en tu cuenta.',
            '2.       Haz clic en el ícono de perfil en la esquina superior derecha.',
            '3.       Haz clic en “<strong>Canjear código</strong>” o “<strong>Redeem Code</strong>”.',
            '4.       Ingresa el <strong>código</strong> y haz clic en <strong>Canjear</strong>. ¡Y listo! Ya tienes <strong>el código canjeado.</strong>',
            'Aviso: Debería aparecer un mensaje de que el <strong>código se canjeó con éxito.</strong>',
            '<strong>Epic Games</strong>',
            '1.       Abre Epic Games en tu navegador de internet.',
            '2.       Inicia sesión en la cuenta donde quieres <strong>canjear el código de producto</strong>.',
            '3.       Coloca el cursor sobre tu nombre en la esquina superior derecha y haz clic en “<strong>Cuenta</strong>” o “<strong>Account</strong>”.',
            '4.    Haz clic en la sección “Canjear código” o “redeem code”.',
            '5.       Ingresa el código y haz clic en <strong>Canjear o Redeem</strong>. ¡Y listo! Ya tienes <strong>el código canjeado</strong>.',
            'Aviso: Debería aparecer un mensaje de que <strong>el código se canjeó con éxito</strong> y el juego o producto debería estar disponible en tu <strong>cuenta de Epic Games</strong>.',
            '<strong>Epic Games Store</strong>',
            '1.       Abre Epic Games en tu navegador de internet.',
            '2.       Inicia sesión en la cuenta donde quieres <strong>canjear el código de producto.</strong>',
            '3.       Coloca el cursor sobre tu nombre en la esquina superior derecha y haz clic en “<strong>Cuenta</strong>” o “<strong>Account</strong>”.',
            '4.    Haz clic en la sección “Canjear código” o “redeem code”.',
            '5.       Ingresa el código y haz clic en Canjear o Redeem. ¡Y listo! Ya tienes el código canjeado.',
            '',
            '<strong>Juegos más reconocidos de esta plataforma:</strong>',
            `<div style="display: grid; grid-auto-flow: column;">
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">FORTNITE</li>
                <li style="padding-left: 1em;">Red Dead Redemption 2</li>
                <li style="padding-left: 1em;">FALL GUYS</li>
              </ul>
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Farcry 6</li>
                <li style="padding-left: 1em;">Dead By Daylight</li>
                <li style="padding-left: 1em;">GTA V</li>
              </ul>
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Rocket League</li>
              </ul>
            </div>`,
          ],
        },
      },
      {
        label: 'Nintendo',
        icon: 'nintendo',
        component: null,
        topic: {
          topic: 'NINTENDO',
          content: [
            '¿Cómo canjeo mi código de producto en Nintendo?',
            `
            <ul>
            <li>Ve a la página de Nintendo e inicia sesión en la cuenta que quieras canjear el código.</li>
            <li>Haz clic en “Nintendo eShop” en la parte izquierda de la pantalla.</li>
            <li>Selecciona "Canjear código" y se abrirá el sitio donde podrás colocar el código de producto.</li>
            <li>Introduce los 16 caracteres del código. (Asegúrate de introducir el código de descarga, que no contiene guiones)</li>
            <li>Haz clic en "Canjear". ¡Y listo! Ya tienes el código canjeado. (El producto empezará a descargarse cuando se confirme el código.)</li>
            </ul>
            `,
            '',
            '<strong>Juegos más reconocidos de esta plataforma:</strong>',
            `<div style="display: grid; grid-auto-flow: column;">
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Mario Kart 8</li>
                <li style="padding-left: 1em;">Animal Crossing</li>
                <li style="padding-left: 1em;">Super Smash Bros</li>
              </ul>
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">The Legend of Zelda Breath of the Wild</li>
                <li style="padding-left: 1em;">Pokemon Espada y Escudo</li>
              </ul>
            </div>`,
          ],
        },
      },
      {
        label: 'Origin',
        icon: 'origin',
        component: null,
        topic: {
          topic: 'ORIGIN',
          content: [
            '¿Cómo canjeo mi código de producto en Origin?',
            '<strong>Cliente de Origin</strong>',
            `
            <ul>
            <li>Inicia sesión en tu Cuenta EA.</li>
            <li>Haz clic en la opción de “<strong>Origin</strong>” en la parte superior de Origin.</li>
            <li>Haz clic en "Canjear un código” o "<strong>Redeem Product Code</strong>”.</li>
            <li>Ingresa el código y confirma el pedido. ¡Y listo! Ya tienes el <strong>código canjeado</strong>.</li>
            </ul>
            `,
            '<strong>Origin</strong>',
            `
            <ul>
            <li>Inicia sesión en tu Cuenta EA.</li>
            <li>Coloca el cursor sobre tu nombre en la esquina inferior izquierda y haz clic en “<strong>Cuenta EA</strong>”.</li>
            <li>Haz clic en la seccion "<strong>Canjear código de producto</strong>".</li>
            <li>Ingresa <strong>el código</strong>.</li>
            <li>Confirma el pedido. ¡Y listo! Ya tienes <strong>el código canjeado</strong>.</li>
            </ul>
            `,
            '',
            '<strong>Juegos más reconocidos de esta plataforma:</strong>',
            `<div style="display: grid; grid-auto-flow: column;">
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Plantas vs Zombies</li>
                <li style="padding-left: 1em;">FIFA</li>
              </ul>
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Battlefield</li>
                <li style="padding-left: 1em;">Sims 4</li>
              </ul>
            </div>`,
          ],
        },
      },
      {
        label: 'XBOX',
        icon: 'xbox',
        component: null,
        topic: {
          topic: 'XBOX',
          content: [
            '¿Cómo <strong>canjeo mi código de producto</strong> en Xbox?',
            '<strong>En Xbox Series X|S y Xbox One</strong>',
            `
            <ul>
            <li>Inicia sesión en tu consola Xbox (asegúrate de haber iniciado sesión en la <strong>cuenta de Microsoft</strong> con la que quieres <strong>canjear el código</strong>).</li>
            <li>Abre la aplicación Store. (Si la aplicación Store no se muestra, ve a “Mis juegos y aplicaciones”, selecciona “Aplicaciones”, y selecciona la aplicación “Store” desde allí).</li>
            <li>En la aplicación Store, mueve el cursor a la izquierda para abrir el menú lateral.</li>
            <li>En ese menú, selecciona “<strong>Canjear</strong>”.</li>
            <li>Escribe el código de 25 caracteres y sigue las instrucciones. (El sistema irá poniendo los guiones)</li>
            </ul>
            `,
            '<strong>Desde el navegador web</strong>',
            `
            <ul>
            <li>Desde un navegador web, ve a <strong>xbox.com</strong>.</li>
            <li>Inicia sesión, con la cuenta que quieras <strong>canjear el código</strong>.</li>
            <li>Haz clic en “Juegos” en la parte superior del sitio web y selecciona “<strong>Canjear código</strong>”.</li>
            <li>Escribe el código de 25 caracteres y sigue las instrucciones. (El sistema irá poniendo los guiones)</li>
            <li>Haz clic en "Canjear". ¡Y listo! Ya tienes el código canjeado</li>
            </ul>
            `,
            '<strong>En Xbox 360</strong>',
            `
            <ul>
            <li>Inicia sesión en tu Xbox 360 (asegúrate de que iniciaste sesión en la <strong>cuenta de Microsoft</strong> para la que quieres <strong>canjear el código</strong>).</li>
            <li>Presiona el botón Guía Xbox del control.</li>
            <li>Selecciona Juegos y aplicaciones y elige “<strong>Canjear código</strong>”.</li>
            <li>Escribe el código de 25 caracteres y sigue las instrucciones. (El sistema irá poniendo los guiones)</li>
            </ul>
            `,
            '',
            '<strong>Juegos más reconocidos de esta plataforma:</strong>',
            `<div style="display: grid; grid-auto-flow: column;">
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">FIFA</li>
                <li style="padding-left: 1em;">FORTNITE</li>
                <li style="padding-left: 1em;">Fall Guys</li>
                <li style="padding-left: 1em;">Call of Duty</li>
              </ul>
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">GTA V</li>
                <li style="padding-left: 1em;">Minecraft</li>
                <li style="padding-left: 1em;">Rocket League</li>
                <li style="padding-left: 1em;">Apex</li>
              </ul>
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Roblox</li>
              </ul>
            </div>`,
          ],
        },
      },
      {
        label: 'Mobile',
        icon: 'mobile',
        component: null,
        topic: {
          topic: 'Mobile',
          content: [
            '¿Cómo <strong>canjeo mi código de producto</strong> en Móvil?',
            '<strong>Play Store</strong>',
            `
            <ul>
            <li>Abre la aplicación <strong>Google Play</strong>.</li>
            <li>Haz clic en el icono de perfil, arriba a la derecha.</li>
            <li>Selecciona “<strong>Pagos y suscripciones</strong>”. <strong>Canjear código de regalo</strong>.</li>
            <li>Escribe el <strong>código de producto</strong>.</li>
            <li>Toca en “<strong>Canjear</strong>” o “<strong>Redeem</strong>”. ¡Y listo! Ya tienes <strong>el código canjeado</strong>.</li>
            </ul>
            `,
            '<strong>App Store</strong>',
            `
            <ul>
            <li>Abre la aplicación <strong>App Store</strong>.</li>
            <li>Haz clic en el icono de perfil, arriba a la derecha.</li>
            <li>Selecciona “<strong>Canjear Gift Card o Código</strong>” o “<strong>Redeem Gift Card or Code</strong>”.</li>
            <li>Escribe <strong>el código de producto</strong>.</li>
            <li>Toca en “<strong>Canjear</strong>” o “<strong>Redeem</strong>”. ¡Y listo! Ya tienes <strong>el código canjeado</strong>.</li>
            </ul>
            `,
            '<strong>Juegos más reconocidos de esta plataforma:</strong>',
            `<div style="display: grid; grid-auto-flow: column;">
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Fortnite</li>
                <li style="padding-left: 1em;">Call of Duty</li>
                <li style="padding-left: 1em;">PUBG</li>
                <li style="padding-left: 1em;">Among Us</li>
                <li style="padding-left: 1em;">Clash of Clans</li>
                <li style="padding-left: 1em;">Brawl Stars</li>
              </ul>
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Alto's Adventure</li>
                <li style="padding-left: 1em;">Asphalt 9 Legends</li>
                <li style="padding-left: 1em;">League of Legends: Wild Rift</li>
                <li style="padding-left: 1em;">Clash Royale</li>
                <li style="padding-left: 1em;">Free Fire</li>
              </ul>
            </div>`,
          ],
        },
      },
      {
        label: 'Riot Games',
        icon: 'riot',
        component: null,
        topic: {
          topic: 'ORIGIN',
          content: [
            '¿Cómo <strong>canjeo mi código de producto</strong> en Riot Games?',
            `
            <ul>
            <li>Desde un navegador web, ve a shop.riotgames.com.</li>
            <li>Haz clic en “<strong>Canjear código</strong>” o “Redeem Code” en la parte superior del sitio web.</li>
            <li> Introduce el código en la ventana que aparece y selecciona <strong>Canjear código</strong>. ¡Y listo! Ya tienes el código canjeado.</li>
            </ul>
            `,
            '',
            '<strong>Juegos más reconocidos de esta plataforma:</strong>',
            `<div style="display: grid; grid-auto-flow: column;">
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">League of Legends</li>
                <li style="padding-left: 1em;">Teamfight tactics</li>
              </ul>
              <ul style="list-style: '-';">
                <li style="padding-left: 1em;">Valorant</li>
                <li style="padding-left: 1em;">Legends of Runeterra</li>
              </ul>
            </div>`,
          ],
        },
      },
    ],
    []
  );
  return state.topic ? (
    <UseCodeContent icon={state.topic.icon} {...state.topic.topic} />
  ) : (
    <div className="use-code-help-center">
      <div className="title">Usar código</div>
      <p>
        <strong>Como canjear código de producto y tarjetas de regalo</strong>
        <br></br>
        <br></br>
        ¡Te ayudaremos a canjear tu <strong>código de producto</strong> o{' '}
        <strong>tarjeta de regalo</strong> en cualquier plataforma! Con la guía que ofrece{' '}
        <strong>Mercado Gamer</strong> vas a poder <strong>canjear tu producto al instante</strong>,
        sea de Epic Games, Steam, PlayStation, Xbox, Riot Games, Nintendo y más. Tanto para{' '}
        <strong>códigos de argentina</strong> o demás países del mundo, en simples pasos vas a tener
        tu <strong>juego o ítem canjeado</strong>. En <strong>Mercado Gamer</strong> queremos
        ofrecerte las mejores soluciones y con la mayor comodidad.
      </p>
      <ul>
        {codes.map((item, index) => (
          <li key={index} onClick={() => setState({ ...state, topic: item })}>
            <div className="icon">
              <Icon name={item.icon} />
            </div>
            <div className="label">{item.label}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
