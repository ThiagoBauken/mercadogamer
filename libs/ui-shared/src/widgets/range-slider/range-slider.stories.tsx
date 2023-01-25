import { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ThemeColor } from '@theme/color';
import { RangeSlider } from '.';

export default {
  title: 'Atoms/Range Slider',
  component: RangeSlider,
  argTypes: {
    value: {
      description: 'Define class name for  bar.',
      control: false,
      defaultValue: '',
      table: {
        category: 'Property',
        type: {
          summary: 'string | number | any[]',
        },
      },
    },
    disabled: {
      description: 'Set disable for menu.',
      control: 'boolean',
      defaultValue: false,
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
    max: {
      description: 'Set Max value',
      control: 'number',
      defaultValue: 100,
      table: {
        category: 'Property',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 100,
        },
      },
    },
    min: {
      description: 'Set min value',
      control: 'number',
      defaultValue: 0,
      table: {
        category: 'Property',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 0,
        },
      },
    },
    step: {
      description: 'Set step value',
      control: 'number',
      defaultValue: 1,
      table: {
        category: 'Property',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 1,
        },
      },
    },
    color: {
      description: 'Range slider color',
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
    onChange: {
      description: 'When change status of the menu.',
      table: {
        category: 'Events',
      },
    },
  },
  parameters: { controls: { sort: 'alpha' } },
} as ComponentMeta<typeof RangeSlider>;

const Template: ComponentStory<typeof RangeSlider> = (args) => {
  const [value, setValue] = useState<number[]>([10, 20]);
  return <RangeSlider {...args} value={value} onChange={setValue}></RangeSlider>;
};

export const RangeSliderTemplate = Template.bind({});
RangeSliderTemplate.storyName = 'Range Slider';
RangeSliderTemplate.args = {};
