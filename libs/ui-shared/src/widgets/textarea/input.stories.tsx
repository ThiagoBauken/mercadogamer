import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Textarea } from '.';

export default {
  title: 'Atoms/Textarea',
  component: Textarea,
  argTypes: {
    label: {
      description: 'Input Label',
      control: 'text',
      defaultValue: 'Label',
      table: {
        category: 'Property',
        description: 'Set Label of the Input.',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
      },
    },
    helper: {
      description: 'Set Input Helper',
      control: 'text',
      defaultValue: 'helper',
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
      description: 'Set Input placeholder',
      control: 'text',
      defaultValue: 'placeholder',
      table: {
        category: 'Property',
        description: 'Set placeholder of the Input.',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
      },
    },
    error: {
      description: 'Set Input Error Status',
      control: 'boolean',
      defaultValue: false,
      table: {
        category: 'Property',
        description: 'Set status of the Input.',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: false,
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
    rows: {
      description: 'Default rows',
      defaultValue: '5',
      control: 'number',
      table: {
        category: 'Property',
        type: {
          summary: 'default rows',
        },
        defaultValue: {
          summary: '5',
        },
      },
    },
    bgColor: {
      description: 'Textarea background',
      defaultValue: 'transparent',
      control: 'color',
      table: {
        category: 'Property',
        type: {
          summary: 'color',
        },
        defaultValue: {
          summary: 'transparent',
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
} as ComponentMeta<typeof Textarea>;

const Template: ComponentStory<typeof Textarea> = (args) => {
  const [value, setValue] = useState<string | number>('');
  return <Textarea {...args} value={value} onChange={setValue} />;
};

export const TextareaComponent = Template.bind({});
TextareaComponent.storyName = 'Textarea';
