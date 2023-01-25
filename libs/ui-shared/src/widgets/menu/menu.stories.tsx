import { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ThemeColor } from '@theme/color';
import { Menu } from '.';

export default {
  title: 'Atoms/Menu',
  component: Menu,
  argTypes: {
    contentClass: {
      description: 'Define class name for menu.',
      control: 'text',
      defaultValue: '',
      table: {
        category: 'Property',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
      },
    },
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
    borderColor: {
      description: 'Define color of bar.',
      control: 'color',
      defaultValue: ThemeColor.primary,
      table: {
        category: 'Property',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'primary',
        },
      },
    },
    activator: {
      description: 'Define area for menu.',
      control: 'text',
      defaultValue: 'Click me!',
      table: {
        category: 'Property',
        type: {
          summary: 'React.ReactNode',
        },
      },
    },
    open: {
      description: 'Show or hide menu.',
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
    full: {
      description: 'Set full width for menu.',
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
    inline: {
      description: 'Set inline for menu.',
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
    menuItems: {
      description: 'Set items for menu.',
      control: 'object',
      defaultValue: [
        {
          label: 'Item 1',
          value: '1',
        },
        {
          label: 'Item 2',
          value: '2',
        },
        {
          label: 'Item 3',
          value: '3',
        },
      ],
      table: {
        category: 'Property',
        type: {
          summary: 'Object[]',
          detail: `{
  icon:string,
  label:string,
  value:string | number,
  [key: string]: any,
  action?: (event?: React.MouseEvent) => void
}`,
        },
      },
    },
    maxHeight: {
      description: 'Set height for menu.',
      control: { type: 'number', min: 0 },
      defaultValue: 160,
      table: {
        category: 'Property',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 160,
        },
      },
    },
    contentOpacity: {
      description: 'Set opacity for content of card.',
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
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
    // events
    onChange: {
      description: 'When change status of the menu.',
      table: {
        category: 'Events',
      },
    },
    onChangeOpen: {
      description: 'When change status of the menu.',
      table: {
        category: 'Events',
      },
    },
  },
  parameters: { controls: { sort: 'alpha' } },
} as ComponentMeta<typeof Menu>;

const Template: ComponentStory<typeof Menu> = (args) => {
  const [value, setValue] = useState<string | number | boolean | string[] | number[]>();
  return <Menu {...args} value={value} onChange={setValue}></Menu>;
};

export const Default = Template.bind({});
Default.storyName = 'Menu';
Default.args = {};

export const Multiple = Template.bind({});
Multiple.storyName = 'Multiple Select';
Multiple.argTypes = {
  multiple: {
    description: 'Set inline for menu.',
    control: false,
    defaultValue: true,
    table: {
      category: 'Property',
      type: {
        summary: 'boolean',
      },
      defaultValue: {
        summary: true,
      },
    },
  },
};

export const RenderItem = Template.bind({});
RenderItem.storyName = 'Render Item';
RenderItem.argTypes = {
  renderItem: {
    description: 'Set render field for item of menu.',
    control: false,
    defaultValue: (item) => <div>{`${item.label} custom field`}</div>,
    table: {
      category: 'Property',
      type: {
        summary: 'boolean',
      },
      defaultValue: {
        summary: true,
      },
    },
  },
};

export const CustomMenu = Template.bind({});
CustomMenu.storyName = 'Custom Menu';
CustomMenu.argTypes = {
  menuItems: {
    defaultValue: undefined,
    table: {
      disable: true,
    },
  },
  children: {
    description: 'Set render field for item of menu.',
    control: false,
    defaultValue: (
      <div style={{ padding: '1rem' }}>
        This is the <strong>custom menu.</strong>
      </div>
    ),
    table: {
      category: 'Property',
      type: {
        summary: 'boolean',
      },
      defaultValue: {
        summary: true,
      },
    },
  },
};
CustomMenu.args = {
  menuItems: '',
};
