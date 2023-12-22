import {style} from '@vanilla-extract/css'
import {RecipeVariants, recipe} from '@vanilla-extract/recipes'
import {padding, rem} from 'polished'
import {color, globalClass} from '../theme.css'
import {Size} from './enums'

export const wrapperStyle = style({position: 'relative'})
export const inputStyle = recipe({
  base: [
    globalClass,
    {
      ':disabled': {
        color: color.grayscale['500'],
      },
      ':focus': {
        borderColor: color.brand.primary.charcoal,
        color: color.brand.primary.charcoal,
        outline: '0 none',
      },
      backgroundColor: color.brand.primary.white,
      border: `1px solid ${color.grayscale['500']}`,
      borderRadius: rem(26),
      boxSizing: 'border-box',
      caretColor: color.brand.primary.charcoal,
      color: color.grayscale['700'],
      fontFamily: 'Rubik, sans-serif',
      fontSize: rem(16),
      lineHeight: 1.25,
      selectors: {
        '&::placeholder': {
          opacity: 0,
        },
      },
      width: '100%',
    },
  ],
  defaultVariants: {
    size: Size.LARGE,
  },
  variants: {
    size: {
      [Size.SMALL]: {
        ...padding(rem(7), rem(32)),
      },
      [Size.MEDIUM]: {
        ...padding(rem(11), rem(32)),
      },
      [Size.LARGE]: {
        ...padding(rem(15), rem(32)),
      },
    },
  },
})

export const inputError = style({
  ':focus': {
    borderColor: color.conversational.red,
    color: color.conversational.red,
  },
  borderColor: color.conversational.red,
  color: color.conversational.red,
})

export const labelStyle = style({
  color: color.grayscale['700'],
  fontFamily: 'Rubik, sans-serif',
  fontSize: rem(16),
  left: rem(32),
  lineHeight: 1.25,
  position: 'absolute',
  selectors: {
    'input:disabled ~ &': {
      color: color.grayscale['500'],
    },
    'input:focus ~ &': {
      color: color.brand.primary.charcoal,
    },
    'input:focus ~ &, input:not(:placeholder-shown) ~ &': {
      top: 0,
    },
  },
  top: '50%',
  transform: 'translateY(-50%)',
  transition: 'top 0.2s',
})

export const labelBackground = style({
  backgroundColor: color.brand.primary.white,
  bottom: 0,
  height: 10,
  position: 'absolute',
  width: '100%',
})

export const labelText = style({
  paddingLeft: 4,
  paddingRight: 4,
  position: 'relative',
})

export const labelError = style({
  color: color.conversational.red,
})

export const errorMessage = style({
  color: color.conversational.red,
  fontSize: rem(12),
  marginLeft: rem(32),
  padding: 3,
})

export type InputVariants = RecipeVariants<typeof inputStyle>
