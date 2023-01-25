import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Expansion } from '.';

export default {
  title: 'Atoms/Expansion',
  component: Expansion,
  argTypes: {
    collapse: {
      description: 'Expansion collapse',
      control: 'boolean',
      defaultValue: false,
      table: {
        category: 'Property',
        description: 'Set collapse of the expansion.',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    defaultCollapse: {
      description: 'Default collapse of expansion',
      control: 'boolean',
      defaultValue: false,
      table: {
        category: 'Property',
        description: 'Set default collapse of the expansion.',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    children: {
      description: 'expansion content',
      control: 'text',
      defaultValue: 'Lorem ipsum dolor sit amet consectetuer lorem ipsum dolor sit amet consectuer',
      table: {
        category: 'React children',
        type: {
          summary: 'String | React Element',
        },
      },
    },
    header: {
      description: 'expansion header',
      control: 'text',
      defaultValue: 'Expansion Title',
      table: {
        category: 'React children',
        type: {
          summary: 'String | React Element',
        },
      },
    },
    // events
    onClick: {
      description: 'When click on the button.',
      table: {
        category: 'Events',
      },
    },
  },
  parameters: { controls: { sort: 'alpha' } },
} as ComponentMeta<typeof Expansion>;

const Template: ComponentStory<typeof Expansion> = (args) => {
  return <Expansion {...args} />;
};

export const ExpansionComponent = Template.bind({});
ExpansionComponent.storyName = 'Expansion';
