import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Radiobox } from '.';

export default {
  title: 'Atoms/Radiobox',
  component: Radiobox,
  argTypes: {
    checked: {
      description: 'Checkbox status',
      control: 'boolean',
      defaultValue: false,
      table: {
        category: 'Property',
        description: 'Set status of the checkbox.',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    indeterminate: {
      description: 'Checkbox status',
      control: 'boolean',
      defaultValue: false,
      table: {
        category: 'Property',
        description: 'Set status of the checkbox.',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    children: {
      description: 'Checkbox content',
      control: 'text',
      defaultValue: 'Checkbox',
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
} as ComponentMeta<typeof Radiobox>;

const Template: ComponentStory<typeof Radiobox> = (args) => {
  return <Radiobox {...args} />;
};

export const RadioboxComponent = Template.bind({});
RadioboxComponent.storyName = 'Radiobox';
