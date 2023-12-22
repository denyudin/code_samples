import React, { useState } from 'react';
import { CheckBox, CheckBoxProps} from '.';
import { Story } from '@storybook/react';

export default {
    title: "Form Inputs/CheckBox",
    component: CheckBox,
    parameters: {
      docs: {
        description: {
          component: 'Inside "FormProvider" use FormCheckBox',
        },
      },
    },
}

export const Default: Story<CheckBoxProps> = (args) => {
  const [value, setValue] = useState(args.value);
  return (<CheckBox name="CheckBox" {...args} value={value} onChange={(e) => setValue(e)} />)
}

Default.args = {
  label: 'Label'
};


Default.argTypes = {
  error: {
    control: { type: 'text' },
    type: 'string',
    description: 'Error message (optional)'
  },
  value: {
  },
  onChange: {
    type: 'function'
  },
  label: {
    control: { type: 'text' },
    type: 'string'
  }
}
