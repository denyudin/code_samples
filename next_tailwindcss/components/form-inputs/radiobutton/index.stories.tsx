import React, { useState } from 'react';
import { RadioButton, RadioButtonProps} from '.';
import { Story } from '@storybook/react';


export default {
    title: "Form Inputs/RadioButton",
    component: RadioButton,
    parameters: {
      docs: {
        description: {
          component: 'Inside "FormProvider" use FormRadioButton',
        },
      },
    },
}

export const Default: Story<RadioButtonProps> = (args) => {
  const [value, setValue] = useState(args.value);
  return (<RadioButton name="date" {...args} value={value} onChange={(e) => setValue(e.target.value)} />)
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
  options: {
    control: {
      type: 'object'
    },
    defaultValue: [{
      label: 'First',
      value: 1,
    }, {
      label: 'Second',
      value: 2,
    }]
  },
  value: {
  },
  onChange: {
    type: 'function'
  },
  bordered: {
    type: 'boolean'
  },
  label: {
    control: { type: 'text' },
    type: 'string'
  }
}
