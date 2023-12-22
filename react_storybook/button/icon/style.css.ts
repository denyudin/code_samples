import {style} from '@vanilla-extract/css'
import {padding, rem} from 'polished'
import {breakpoint, shiftDown} from '../../breakpoint'
import {color, globalClass} from '../../theme.css'

export const button = style([
  globalClass,
  {
    display: 'flex',
    width: rem(40),
    height: rem(40),
    ...padding(rem(5)),
    backgroundColor: 'transparent',
    border: `0 none`,
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: color.grayscale['100'],
    },
    ':focus-visible': {
      outline: `1px solid ${color.brand.primary.charcoal}`,
      outlineOffset: 3,
    },
    ':disabled': {
      pointerEvents: 'none',
      cursor: 'default',
    },
    '@media': {
      [shiftDown(breakpoint.tablet)]: {
        backgroundColor: color.grayscale['100'],
      },
    },
  },
])

export const icon = style({
  width: rem(25),
  height: rem(25),
  margin: 'auto',
  color: color.brand.primary.charcoal,
})
