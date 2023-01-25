import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Switch } from '.';

export default {
  title: 'Atoms/Switch',
  component: Switch,
  argTypes: {
    bgColor: {
      description: 'Button background and border color',
      defaultValue: '#F78A0E',
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
    disabled: {
      description: 'Set Input disable status',
      control: 'boolean',
      defaultValue: false,
      table: {
        category: 'Property',
        description: 'Set disabled of the Input.',
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
      description: 'chagne event',
      table: {
        category: 'Events',
        type: {
          summary: 'string',
        },
      },
    },
  },
  parameters: { controls: { sort: 'alpha' } },
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />;

export const SwitchComponent = Template.bind({});
SwitchComponent.storyName = 'Switch';
