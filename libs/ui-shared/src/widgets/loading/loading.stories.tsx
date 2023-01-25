import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeColor } from '@theme/color';
import { Loading } from '.';

export default {
  title: 'Atoms/Loading',
  component: Loading,
  argTypes: {
    size: {
      description: 'Spin size. default is 80px',
      control: 'number',
      defaultValue: 80,
      table: {
        category: 'Property',
        description: 'Set size of the spin.',
        type: {
          summary: 'string | number',
        },
        defaultValue: {
          summary: 80,
        },
      },
    },
    color: {
      description: 'spin color',
      defaultValue: ThemeColor.primary,
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
    // events
    onClick: {
      description: 'When click on the button.',
      table: {
        category: 'Events',
      },
    },
  },
  parameters: { controls: { sort: 'alpha' } },
} as ComponentMeta<typeof Loading>;

const Template: ComponentStory<typeof Loading> = (args) => <Loading {...args} />;

export const LoadingTemplate = Template.bind({});
LoadingTemplate.storyName = 'Loading';
