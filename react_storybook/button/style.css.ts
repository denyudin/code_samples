import {RecipeVariants, recipe} from '@vanilla-extract/recipes'
import {padding, rem} from 'polished'
import {color} from '../theme.css'

export const button = recipe({
  base: {
    ':active': {
      transform: 'scale(0.99)',
    },
    ':disabled': {
      background: color.grayscale['300'],
      color: color.grayscale['700'],
      pointerEvents: 'none',
    },
    ':focus-visible': {
      outline: `2px solid ${color.brand.primary.charcoal}`,
      outlineOffset: '3px',
    },
    ':hover': {
      cursor: 'pointer',
    },
    background: color.brand.primary.white,
    border: 'none',
    borderRadius: 999,
    boxSizing: 'border-box',
    color: color.brand.primary.charcoal,
    fontFamily: 'Rubik, sans-serif',
    fontWeight: 700,
    position: 'relative',
    transition: 'background-color 0.3s, box-shadow 0.3s',
  },
  defaultVariants: {
    size: 'large',
    variant: 'primary',
  },
  variants: {
    size: {
      large: {...padding(14, 32), fontSize: rem(14), lineHeight: rem(12)},
      small: {...padding(10, 16), fontSize: rem(12), lineHeight: rem(16)},
    },
    variant: {
      ghost: {
        ':hover': {
          boxShadow: `inset 0 0 0 1px ${color.brand.primary.charcoal}`,
        },
        boxShadow: `inset 0 0 0 1px ${color.grayscale[300]}`,
      },
      primary: {
        ':hover': {
          background: color.exclusive.buttonPrimaryHover,
        },
        background: color.brand.primary.blue,
        color: color.brand.primary.white,
      },
      secondary: {
        ':focus-visible': {
          outline: `2px solid ${color.brand.primary.white}`,
        },
        ':hover': {
          background: color.grayscale[100],
        },
      },
    },
  },
})

/**
 * Button variants interface.
 */
export type ButtonVariants = RecipeVariants<typeof button>
