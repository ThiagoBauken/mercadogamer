import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { iconList } from '@utils';
import { Input } from '.';

export default {
  title: 'Atoms/Input',
  component: Input,
  argTypes: {
    type: {
      description: "Input type. default is 'text'",
      control: 'select',
      options: ['text', 'number', 'password'],
      defaultValue: 'text',
      table: {
        category: 'Property',
        description: 'Set type of the Input.',
        type: {
          summary: 'text | number | password',
        },
        defaultValue: {
          summary: 'text',
        },
      },
    },
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
    prefix: {
      description: 'Set Input pre icon',
      control: 'select',
      options: [''].concat(Object.keys(iconList())),
      defaultValue: '',
      table: {
        category: 'Property',
        description: 'Set pre icon of the Input.',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: false,
        },
      },
    },
    endfix: {
      description: 'Set Input end icon',
      control: 'select',
      options: [''].concat(Object.keys(iconList())),
      defaultValue: '',
      table: {
        category: 'Property',
        description: 'Set end icon of the Input.',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: false,
        },
      },
    },
    bgColor: {
      description: 'Input background',
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
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
  const [value, setValue] = useState<string | number>('');
  return <Input {...args} value={value} onChange={setValue} />;
};

export const InputComponent = Template.bind({});
InputComponent.storyName = 'Input';
