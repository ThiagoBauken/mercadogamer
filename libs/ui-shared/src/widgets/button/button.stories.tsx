import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './index';

export default {
  title: 'Atoms/Button',
  component: Button,
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
    size: {
      description: "Button size. default is 'normal'",
      control: 'select',
      options: ['normal', 'big'],
      defaultValue: 'normal',
      table: {
        category: 'Property',
        description: 'Set size of the button.',
        type: {
          summary: 'normal | big',
        },
        defaultValue: {
          summary: 'normal',
        },
      },
    },
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
      description: 'Disable button',
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
    width: {
      description: 'set width button',
      defaultValue: 'fit-content',
      control: 'number',
      table: {
        category: 'Property',
        type: {
          summary: 'string | number',
        },
        defaultValue: {
          summary: 'fit-content',
        },
      },
    },
    textTransform: {
      description: 'set button text transform',
      defaultValue: 'unset',
      control: 'select',
      options: ['unset', 'uppercase', 'capitalize', 'lowercase'],
      table: {
        category: 'Property',
        type: {
          summary: 'unset | uppercase | capitalize | lowercase',
        },
        defaultValue: {
          summary: 'unset',
        },
      },
    },
    // icon: {
    //   description: 'This will use pre-defined icon name like `refresh`.',
    //   control: 'select',
    //   options: Object.keys(iconList()),
    //   table: {
    //     category: 'Property',
    //   },
    // },
    children: {
      description: 'Button content',
      control: 'text',
      defaultValue: 'Button',
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
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const ButtonTemplate = Template.bind({});
ButtonTemplate.storyName = 'Button';
