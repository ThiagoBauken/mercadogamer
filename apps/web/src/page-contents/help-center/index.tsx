import { madeBackgroundImageUrl } from '@utils';
import { Icon } from '@widgets/icon';
import { useRouter } from 'next/router';
import { HelpCenterKind, HelpCenterTopics } from './config';

export const HelpCenterPageContent: React.FC = () => {
  const router = useRouter();

  const gotoCategory = (category: string, id: string): void => {
    router.push(`/help-center/${category}/${id}`);
  };

  return (
    <section className="help-center-page-content">
      <div className="page-title">Centro de ayuda</div>
      <div className="content">
        <ul className="kind">
          {HelpCenterKind.map((item, index) => (
            <li
              key={index}
              onClick={() =>
                router.push(
                  `help-center/${item.category}/${
                    HelpCenterTopics.find(({ category }) => {
                      return Array.isArray(category)
                        ? category.includes(item.category)
                        : category === item.category;
                    })?.id
                  }`
                )
              }
            >
              <div
                className="image-container"
                style={{
                  backgroundImage: madeBackgroundImageUrl(
                    `/assets/imgs/help-center/${item.icon}.webp`
                  ),
                }}
              ></div>
              <div className="label">{item.label}</div>
            </li>
          ))}
        </ul>

        <div className="frequent-topics">
          <div className="title">Temas frecuentes</div>
          <ul>
            {HelpCenterTopics.filter(({ category }) =>
              Array.isArray ? category.includes('frequent') : category === 'frequent'
            ).map((topic, index) => (
              <li key={index} onClick={() => gotoCategory('frequent', topic.id)}>
                <Icon name="help-circle" size={24} />
                <div className="label">{topic.topic}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
