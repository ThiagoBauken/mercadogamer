import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ThemeColor } from '@theme/color';
import { Rating } from '.';

export default {
  title: 'Atoms/Rating',
  component: Rating,
  argTypes: {
    rating: {
      description: 'rated value',
      control: 'number',
      defaultValue: 0,
      table: {
        category: 'Property',
        description: 'Set rating of the Rating.',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 0,
        },
      },
    },
    iconSize: {
      description: 'Icon size',
      control: 'number',
      defaultValue: 16,
      table: {
        category: 'Property',
        description: 'Set size of the icon.',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 16,
        },
      },
    },
    activeColor: {
      description: 'active color',
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
    deactiveColor: {
      description: 'deactive color',
      defaultValue: ThemeColor['gray-100'],
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
  },
  parameters: { controls: { sort: 'alpha' } },
} as ComponentMeta<typeof Rating>;

const Template: ComponentStory<typeof Rating> = (args) => <Rating {...args} />;

export const RatingTemplate = Template.bind({});
RatingTemplate.storyName = 'Rating';
