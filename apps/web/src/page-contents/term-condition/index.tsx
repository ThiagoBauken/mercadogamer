import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { TermConditionTopics } from '@page-contents/term-condition/config';
import { BreakPoints } from '@theme/breakpoints';
import { useWindowSize } from '@hooks';
import { Expansion } from '@widgets/expansion';

export const TermConditionPageContent: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowSize();
  const [collapse, setCollapse] = useState(true);

  const topic = useMemo<typeof TermConditionTopics[0]>(
    () =>
      TermConditionTopics.find((item) => item.id === router.query.id) || {
        id: '101',
        topic: '',
        content: [],
      },
    [router.query]
  );

  return (
    <section className="term-condition-category">
      <div className="header">
        <div className="title">Términos y Condiciones</div>
      </div>
      <div className="content">
        {width > BreakPoints.lg ? (
          <div className="topics">
            <div className="title">Secciones</div>
            <ul>
              {TermConditionTopics.map((item, index) => (
                <li
                  key={index}
                  className={router.query.topic === item.id ? 'active' : ''}
                  onClick={() => router.push(`/term-condition/${item.id}`)}
                >
                  <div className="label">{item.topic}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mobile-topics">
            <Expansion
              collapse={collapse}
              header={<div className="carts-header">{topic.topic}</div>}
              hideOnDesktop
              onChangeStatus={(value) => {
                setCollapse(value);
              }}
            >
              <ul>
                {TermConditionTopics.map((item, index) => (
                  <li
                    key={index}
                    className={router.query.topic === item.id ? 'active' : ''}
                    onClick={() => router.push(`/term-condition/${item.id}`)}
                  >
                    <div className="label">{item.topic}</div>
                  </li>
                ))}
              </ul>
            </Expansion>
          </div>
        )}

        <div className="topic-content">
          <React.Fragment>
            {topic.topic === 'TERMINOS Y CONDICIONES GENERALES' && (
              <>
                <div className="title">MERCADOGAMER </div>
                <ul className="content">
                  <li>
                    MERCADOGAMER es una plataforma de comercio electrónico que facilita a los
                    entusiastas de los juegos un espacio para conectarse y donde los usuarios pueden
                    vender y/o comprar productos digitales relacionados con los juegos.
                  </li>
                  <li>
                    Se puede acceder a la Tienda Virtual y/o los Servicios que ofrece MERCADOGAMER a
                    través de su sitio web{' '}
                    <span>
                      <a href="https://www.mercadogamer.com" style={{ color: '#0055FF' }}>
                        www.mercadogamer.com
                      </a>
                    </span>{' '}
                    &nbsp;y su aplicación móvil.
                  </li>
                </ul>
              </>
            )}
            <div className="title">{topic.topic}</div>
            {topic.content.length && (
              <ul className="content">
                {topic.content.map((item, index) => (
                  <p key={index} dangerouslySetInnerHTML={{ __html: item }}></p>
                ))}
              </ul>
            )}
          </React.Fragment>
        </div>
      </div>
    </section>
  );
};
