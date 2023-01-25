import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Search } from '.';

export default {
  title: 'Atoms/Search',
  component: Search,
  argTypes: {
    label: {
      description: 'Search Label',
      control: 'text',
      defaultValue: '',
      table: {
        category: 'Property',
        description: 'Set Label of the Search.',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
      },
    },
    helper: {
      description: 'Set Search Helper',
      control: 'text',
      defaultValue: '',
      table: {
        category: 'Property',
        description: 'Set Helper of the Input.',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
      },
    },
    placeholder: {
      description: 'Set Search placeholder',
      control: 'text',
      defaultValue: '',
      table: {
        category: 'Property',
        description: 'Set placeholder of the Search.',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
      },
    },
    error: {
      description: 'Set Search Error Status',
      control: 'boolean',
      defaultValue: false,
      table: {
        category: 'Property',
        description: 'Set status of the Search.',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: false,
        },
      },
    },
    disabled: {
      description: 'Set Search disable status',
      control: 'boolean',
      defaultValue: false,
      table: {
        category: 'Property',
        description: 'Set disabled of the Search.',
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
} as ComponentMeta<typeof Search>;

const Template: ComponentStory<typeof Search> = (args) => <Search {...args} />;

export const SearchComponent = Template.bind({});
SearchComponent.storyName = 'Search';
