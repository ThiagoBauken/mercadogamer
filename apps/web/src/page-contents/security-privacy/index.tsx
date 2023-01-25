import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { SecurityPrivacyTopics } from '@page-contents/security-privacy/config';
import { BreakPoints } from '@theme/breakpoints';
import { useWindowSize } from '@hooks'
import { Expansion } from '@widgets/expansion';


export const SecurityPrivacyPageContent: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowSize();
  const [collapse, setCollapse] = useState(true);

  const topic = useMemo<typeof SecurityPrivacyTopics[0]>(
    () =>
    SecurityPrivacyTopics.find((item) => item.id === router.query.id) || {
        id: '101',
        topic: '',
        content: [],
      },
    [router.query]
  );
  
  return (
    <section className="term-condition-category">
      <div className='header'>
          <div className="title">Seguridad y Privacidad</div>
      </div>
      <div className="content">
      { width > BreakPoints.lg ? (<div className="topics">
          <div className='title'>Secciones</div>
          <ul>
          {SecurityPrivacyTopics.map((item, index) => (
            <li
              key={index}
              className={router.query.topic === item.id ? 'active' : ''}
              onClick={() => router.push(`/security-privacy/${item.id}`)
              }
            >
              <div className="label">{item.topic}</div>
            </li>
          ))}
          </ul>
        </div>) : (<div className="mobile-topics">
          <Expansion
            collapse={collapse}
            header={
              <div className="carts-header">
                {topic.topic}
              </div>
            }
            hideOnDesktop
            onChangeStatus={(value) => {
              setCollapse(value);
            }}
          >
           <ul>
            {SecurityPrivacyTopics.map((item, index) => (
              <li
                key={index}
                className={router.query.topic === item.id ? 'active' : ''}
                onClick={() => router.push(`/security-privacy/${item.id}`)
                }
              >
                <div className="label">{item.topic}</div>
              </li>
            ))}
          </ul>
          </Expansion>
        </div>)}
        

        <div className="topic-content">
            <React.Fragment>
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
