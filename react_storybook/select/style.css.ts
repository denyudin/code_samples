import {style} from '@vanilla-extract/css'
import {RecipeVariants, recipe} from '@vanilla-extract/recipes'
import {border, padding, rem} from 'polished'
import {color, globalClass} from '../theme.css'

export const wrapper = style({
  position: 'relative',
  maxWidth: 282,
  ':after': {
    width: 0,
    height: 0,
    borderLeft: `5px solid transparent`,
    borderRight: `5px solid transparent`,
    borderTop: `5px solid ${color.brand.primary.charcoal}`,
    content: '',
    display: 'block',
    pointerEvents: 'none',
    position: 'absolute',
    right: 32,
    top: '50%',
    transform: `translateY(-50%)`,
  },
})

export const error = style({
  color: color.conversational.red,
  ':after': {
    borderTopColor: color.conversational.red,
  },
})

export const disabled = style({
  color: color.grayscale[500],
  ':after': {
    borderTopColor: color.grayscale[500],
  },
})

export const button = recipe({
  base: [
    globalClass,
    {
      color: color.grayscale[700],
      ':focus': {
        borderColor: color.brand.primary.charcoal,
        color: color.brand.primary.charcoal,
        outline: '0 none',
      },
      backgroundColor: color.brand.primary.white,
      border: `1px solid ${color.grayscale['500']}`,
      borderRadius: rem(26),
      fontSize: rem(16),
      lineHeight: 1.25,
      textAlign: 'left',
      width: '100%',
      '::placeholder': {
        opacity: 0,
      },
      selectors: {
        [`${error} &`]: {
          borderColor: color.conversational.red,
          color: color.conversational.red,
        },
        [`${disabled} &`]: {
          pointerEvents: 'none',
          color: color.grayscale[500],
          borderColor: color.grayscale[500],
        },
      },
    },
  ],
  defaultVariants: {
    size: 'large',
  },
  variants: {
    size: {
      small: {
        ...padding(8, 46, 8, 32),
      },
      medium: {
        ...padding(12, 46, 12, 32),
      },
      large: {
        ...padding(16, 46, 16, 32),
      },
    },
  },
})

export const menu = style({
  position: 'absolute',
  width: `100%`,
  top: `100%`,
  marginTop: 9,
  ...border('1px', 'solid', color.grayscale[500]),
  borderRadius: 5,
  maxHeight: 208,
  overflow: 'auto',
  zIndex: 1000,
  background: color.brand.primary.white,
})

export const label = style({
  fontFamily: 'Rubik, sans-serif',
  fontSize: rem(12),
  left: rem(32),
  lineHeight: rem(20),
  position: 'absolute',
  top: 0,
  transform: 'translateY(-50%)',
  color: 'inherit',
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

export const option = style({
  color: color.brand.primary.charcoal,
  padding: `8px 32px`,
  lineHeight: rem(24),
  ':hover': {
    background: color.grayscale[100],
  },
  selectors: {
    '&:not(:last-child)': {
      ...border('bottom', '1px', 'solid', color.grayscale[300]),
    },
  },
})

export const optionActive = style({
  background: color.grayscale[100],
})

export const optionSelected = style({
  background: color.grayscale[300],
})

export type SelectVariants = RecipeVariants<typeof button>
