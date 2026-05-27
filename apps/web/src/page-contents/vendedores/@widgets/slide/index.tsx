import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const VendorSlide: React.FC = () => {
  const { t } = useTranslation('vendors');
  const [value, setValue] = useState(0);

  const attribute = [
    {
      id: 1,
      explain: 'Obtener ganancias en Mercado Gamer es muy fácil',
      title: t('how_it_works.publish.step'),
      image: '/assets/imgs/vendor/Group_1514.webp',
      content: [
        {
          text: t('steps.step_1.title'),
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
      title: t('steps.step_2.title'),
      image: '/assets/imgs/vendor/Group_1515.webp',
      content: [
        {
          text: 'Entregá automáticamente o de forma coordinada por chat.',
        },
        {
          text: t('features.support.description'),
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
      image: '/assets/imgs/vendor/Group_1516.webp',
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
            alt="vendor slide"
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
