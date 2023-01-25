import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FileSelector } from '.';

export default {
  title: 'Atoms/FileSelector',
  component: FileSelector,
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
    button: {
      description: 'Set Input disable status',
      control: 'boolean',
      defaultValue: {
        kind: 'secondary',
        children: 'Seleccionar',
      },
      table: {
        category: 'Property',
        description: 'Set disabled of the Input.',
        type: {
          summary: 'Button Props',
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
} as ComponentMeta<typeof FileSelector>;

const Template: ComponentStory<typeof FileSelector> = (args) => {
  // const [value, setValue] = useState<string | number>('');
  return <FileSelector {...args} />;
};

export const FileSelectorComponent = Template.bind({});
FileSelectorComponent.storyName = 'FileSelector';
