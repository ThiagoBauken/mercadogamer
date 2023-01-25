import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ThemeColor } from '@theme/color';
import Tooltip from '.';

export default {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  argTypes: {
    tooltip: {
      description: 'Tooltip content',
      defaultValue: 'This is tooltip!',
      control: 'text',
      table: {
        category: 'Property',
        type: {
          summary: 'string | React.ReactNode',
        },
        defaultValue: {
          summary: '',
        },
      },
    },
    bgColor: {
      description: 'background color',
      defaultValue: ThemeColor['gray-100'],
      control: 'color',
      table: {
        category: 'Property',
        type: {
          summary: 'color',
        },
        defaultValue: {
          summary: 'gray-100',
        },
      },
    },
    borderColor: {
      description: 'border color',
      defaultValue: ThemeColor['gray-100'],
      control: 'color',
      table: {
        category: 'Property',
        type: {
          summary: 'color',
        },
        defaultValue: {
          summary: 'gray-100',
        },
      },
    },
    show: {
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

    position: {
      description: 'Set tooltip position',
      control: 'select',
      options: ['top', 'left', 'bottom', 'right'],
      defaultValue: 'bottom',
      table: {
        category: 'Property',
        description: 'Set disabled of the Input.',
        type: {
          summary: `'top' | 'left' | 'bottom' | 'right'`,
        },
        defaultValue: {
          summary: 'bottom',
        },
      },
    },

    width: {
      description: 'Set tooltip size',
      control: 'number',
      defaultValue: 'auto',
      table: {
        category: 'Property',
        description: 'Set disabled of the Input.',
        type: {
          summary: `'top' | 'left' | 'bottom' | 'right'`,
        },
        defaultValue: {
          summary: 'bottom',
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
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args}>Toolti[</Tooltip>;

export const TooltipComponent = Template.bind({});
TooltipComponent.storyName = 'Tooltip';
