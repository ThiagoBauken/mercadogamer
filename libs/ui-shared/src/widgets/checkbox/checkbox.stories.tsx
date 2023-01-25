import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Checkbox } from '.';

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
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
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => {
  return <Checkbox {...args} />;
};

export const CheckboxComponent = Template.bind({});
CheckboxComponent.storyName = 'Checkbox';
