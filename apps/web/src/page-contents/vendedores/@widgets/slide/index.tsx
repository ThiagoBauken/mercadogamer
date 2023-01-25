import React, { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@widgets/icon';

const attribute = [
  {
    id: 1,
    explain: 'Obtener ganancias en Mercado Gamer es muy fácil',
    title: '1 — Publicá',
    image: '../../assets/imgs/vendor/Group_1514.webp',
    content: [
      {
        text: 'Completá los detalles de tu producto.',
      },
      {
        text: 'Calculá la comisión en tiempo real.',
      },
      {
        text: 'La primera publicación es gratis.',
      },
    ],
  },
  {
    id: 2,
    explain: 'Obtener ganancias en Mercado Gamer es muy fácil',
    title: '2 — Vendé',
    image: '../../assets/imgs/vendor/Group_1515.webp',
    content: [
      {
        text: 'Entregá automáticamente o de forma coordinada por chat.',
      },
      {
        text: 'Soporte personalizado para tus ventas.',
      },
      {
        text: 'Alcanzá miles de compradores en latinoamérica.',
      },
    ],
  },
  {
    id: 3,
    explain: 'Obtener ganancias en Mercado Gamer es muy fácil',
    title: '3 — Profit',
    image: '../../assets/imgs/vendor/Group_1516.webp',
    content: [
      {
        text: 'En un máximo de 3 días el dinero se acredita en tu balance.',
      },
      {
        text: 'Retira tu dinero seguro por Mercado Pago o transferencia bancaria.',
      },
    ],
  },
];

export const VendorSlide: React.FC = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="container">
      <div className="main">
        <div className="content">
          <div className="explain">{attribute[value].explain}</div>
          <div className="title">{attribute[value].title}</div>
          {attribute[value].content.map((item, index) => (
            <div className="text" key={index}>
              <Icon name="right-direction" />
              {item.text}
            </div>
          ))}
        </div>
        <div className="image">
          <Image
            src={attribute[value].image}
            className="icon"
            width={569.42}
            height={341.65}
            loading="lazy"
            unoptimized={true}
            alt="device card"
          />
        </div>
      </div>

      <div className="slide-action">
        <div className="icon" onClick={() => (value === 0 ? setValue(2) : setValue(value - 1))}>
          <Icon name="slide-left" />
        </div>
        <div className="icon" onClick={() => (value === 2 ? setValue(0) : setValue(value + 1))}>
          <Icon name="slide-right" />
        </div>
      </div>
    </div>
  );
};
