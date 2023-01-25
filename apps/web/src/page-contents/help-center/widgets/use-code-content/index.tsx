import { madeBackgroundImageUrl } from '@utils';
import { Icon } from '@widgets/icon';
import React from 'react';

type Props = {
  topic: string;
  icon?: string;
  content?: string[];
  image?: string[];
  component?: React.ReactNode;
};
export const UseCodeContent: React.FC<Props> = (topic) => {
  return (
    <React.Fragment>
      <div className="title">
        {topic.icon && <Icon name={topic.icon} size={40} />}
        {topic.topic}
      </div>
      {topic.component ? (
        topic.component
      ) : (
        <React.Fragment>
          {topic.content?.length && (
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
    </React.Fragment>
  );
};
