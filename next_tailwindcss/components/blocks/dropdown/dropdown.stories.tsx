import React from "react";
import { Dropdown } from '.';
import { Story } from '@storybook/react';
import { Button } from '@components/blocks/button';
import { ChevronDownIcon } from '@heroicons/react/outline';

export default {
    title: "Components/Dropdown",
    component: Dropdown,
    decorators: [(Story) =>  <div>{Story()}</div>]
}

export const Default: Story = (args) => <div className='flex justify-center mb-24'><Dropdown className='w-max'
{...args}
target={<Button color="secondary" className='px-2'>
<ChevronDownIcon className='h-5' /> </Button>}
>
<a className='flex py-2 px-4 min-w-max'>Test 1</a>
<a className='flex py-2 px-4 min-w-max'>Test 2</a>
</Dropdown></div>

Default.args = {
};

Default.argTypes = {
  closeAfterClick: {
    control: { type: 'boolean' },
    defaultValue: true
  },
  position: {
    options: ['left', 'right'],
    control: {
      type: 'select'
    },
    defaultValue: 'right'
  },
  header: {
    description: 'ReactElement for header of menu',
    type: 'string'
  },
  className: {
    description: 'Container class name'
  },
  target: {
    description: 'ReactElement (for example <button>) after clicking on which opens the menu'
  },
}

