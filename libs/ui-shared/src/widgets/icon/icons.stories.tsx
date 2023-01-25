import { ComponentStory, ComponentMeta } from '@storybook/react';
import { iconList } from '@utils';
import { Icon } from '.';

export default {
  title: 'Atoms/Icon list',
  component: Icon,
  argTypes: {},
  parameters: { controls: { sort: 'alpha' } },
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = () => {
  return (
    <ul className="icon-list">
      {Object.keys(iconList()).map((key) => (
        <li className="item" key={key}>
          <div className="icon">
            <Icon name={key} />
          </div>
          <div className="name">{key}</div>
        </li>
      ))}
    </ul>
  );
};

export const IconLists = Template.bind({});
IconLists.storyName = 'Icon list';
IconLists.args = {};
