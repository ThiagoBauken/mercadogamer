import React, { useMemo, useState } from 'react';
import { BreadCrumb } from '@widgets/bread-crumb';
import { useRouter } from 'next/router';
import { HelpCenterCategoryEnum, HelpCenterTopics } from '@page-contents/help-center/config';
import { madeBackgroundImageUrl } from '@utils';
import { BreakPoints } from '@theme/breakpoints';
import { useWindowSize } from '@hooks';
import { Expansion } from '@widgets/expansion';

export const HelpCenterCategory: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowSize();
  const [collapse, setCollapse] = useState(true);

  const breadCrumb = useMemo<MenuItemProps[]>(
    () =>
      [{ label: 'Centro de ayuda', action: () => router.push('/help-center') }].concat([
        { label: HelpCenterCategoryEnum[router.query.category as string], action: null },
      ]),
    [router]
  );

  const topic = useMemo<typeof HelpCenterTopics[0]>(
    () =>
      HelpCenterTopics.find((item) => item.id === router.query.topic) || {
        id: '0',
        topic: '',
        category: 'buy',
        content: [],
      },
    [router.query.topic]
  );

  return (
    <section className="help-center-category">
      <BreadCrumb items={breadCrumb} />
      <div className="content">
        {width > BreakPoints.lg ? (
          <div className="topics">
            <div className="title">{HelpCenterCategoryEnum[router.query.category as string]}</div>
            <ul>
              {HelpCenterTopics.filter(({ category }) => {
                return Array.isArray(category)
                  ? category.includes(router.query.category as any)
                  : category === router.query.category;
              }).map((item) => (
                <li
                  key={item.id}
                  className={router.query.topic === item.id ? 'active' : ''}
                  onClick={() => router.push(`/help-center/${router.query.category}/${item.id}`)}
                >
                  {item.topic}
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
                {HelpCenterTopics.filter(({ category }) => {
                  return Array.isArray(category)
                    ? category.includes(router.query.category as any)
                    : category === router.query.category;
                }).map((item) => (
                  <li
                    key={item.id}
                    className={router.query.topic === item.id ? 'active' : ''}
                    onClick={() => router.push(`/help-center/${router.query.category}/${item.id}`)}
                  >
                    {item.topic}
                  </li>
                ))}
              </ul>
            </Expansion>
          </div>
        )}

        <div className="topic-content">
          {topic.component ? (
            topic.component
          ) : (
            <React.Fragment>
              <div className="title">{topic.topic}</div>
              {topic.content.length && (
                <ul className="content">
                  {topic.content.map((item, index) => (
                    <p key={index} dangerouslySetInnerHTML={{ __html: item }}></p>
                  ))}
                </ul>
              )}

              {topic.image?.length && (
                <ul className="image">
                  {topic.image.map((item, index) => (
                    <li
                      className="image-container"
                      key={index}
                      style={{ backgroundImage: madeBackgroundImageUrl(item) }}
                    ></li>
                  ))}
                </ul>
              )}

              {/* <div className="helpful">
                <div className="message">¿Te resultó útil esta información?</div>
                <Button
                  kind="round"
                  roundIcon="thumbs-up"
                  bgColor={ThemeColor['gray-100']}
                  color="white"
                />
                <Button
                  kind="round"
                  roundIcon="thumbs-down"
                  bgColor={ThemeColor['gray-100']}
                  color="white"
                />
              </div> */}
            </React.Fragment>
          )}
        </div>
      </div>
    </section>
  );
};
