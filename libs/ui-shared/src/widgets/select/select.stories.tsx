import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Select } from '.';

export default {
  title: 'Atoms/Select',
  component: Select,
  argTypes: {
    type: {
      description: "Button type. default is 'button'",
      control: 'select',
      options: ['button', 'submit', 'reset'],
      defaultValue: 'button',
      table: {
        category: 'Property',
        description: 'Set type of the button.',
        type: {
          summary: 'button, submit, reset',
        },
        defaultValue: {
          summary: 'button',
        },
      },
    },
    items: {
      description: 'Define menu items',
      defaultValue: [
        {
          label: 'Item 1',
          value: '1',
        },
        {
          label: 'Item 2',
          value: '2',
        },
        {
          label: 'Item 3',
          value: '3',
        },
      ],
    },
    bgColor: {
      description: 'Button background and border color',
      defaultValue: 'transparent',
      control: 'color',
      table: {
        category: 'Property',
        type: {
          summary: 'color',
        },
        defaultValue: {
          summary: 'primary',
        },
      },
    },
    placeholder: {
      description: 'Set Select placeholder',
      control: 'text',
      defaultValue: 'placeholder',
      table: {
        category: 'Property',
        description: 'Set placeholder of the Selecct.',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
      },
    },
    disabled: {
      description: 'Disable select',
      defaultValue: false,
      control: 'boolean',
      table: {
        category: 'Property',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: false,
        },
      },
    },
    miniSize: {
      description: 'Select size',
      defaultValue: false,
      control: 'boolean',
      table: {
        category: 'Property',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: false,
        },
      },
    },
    // events
    onChange: {
      description: 'When click on the button.',
      table: {
        category: 'Events',
      },
    },
  },
  parameters: { controls: { sort: 'alpha' } },
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />;

export const SelectComponent = Template.bind({});
SelectComponent.storyName = 'Select';
