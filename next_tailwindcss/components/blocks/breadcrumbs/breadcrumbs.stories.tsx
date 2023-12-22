
import React from "react";
import { Breadcrumbs, BreadcrumbsProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
    title:"Components/Breadcrumbs",
    component: Breadcrumbs,
}


export const Default: Story<BreadcrumbsProps> = (args) => <Breadcrumbs {...args} />

Default.args = {
  breadcrumbs: [{
    label: 'Page',
    link: '#'
  }, {
    label: 'Sub page',
    link: '#'
  }]
};

Default.argTypes = {
  breadcrumbs: {
    control: { type: 'object' },
    description: '(Array) path to page/ Example: [{label: \'Label\', link: \'#\'}]'
  },
  className: {
    control: { type: 'string' }
  }
}


