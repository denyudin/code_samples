import {style} from '@vanilla-extract/css'
import {RecipeVariants, recipe} from '@vanilla-extract/recipes'
import {rem} from 'polished'
import {color} from '../../theme.css'

export const arrow = recipe({
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '0 none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':focus-visible': {
      outline: `2px solid ${color.brand.primary.charcoal}`,
      outlineOffset: 3,
    },
  },
  defaultVariants: {
    variant: 'direction',
  },
  variants: {
    variant: {
      carousel: {
        width: rem(40),
        height: rem(40),
        backgroundColor: color.brand.primary.charcoal,
        ':hover': {
          backgroundColor: color.exclusive.buttonCarouselHover,
        },
        ':active': {
          backgroundColor: color.brand.primary.charcoal,
        },
        ':disabled': {
          pointerEvents: 'none',
          cursor: 'default',
          backgroundColor: color.grayscale['300'],
        },
      },
      direction: {
        width: rem(56),
        height: rem(56),
        backgroundColor: color.brand.primary.blue,
        ':hover': {
          backgroundColor: color.exclusive.buttonPrimaryHover,
        },
        ':active': {
          backgroundColor: color.brand.primary.blue,
        },
        ':disabled': {
          backgroundColor: color.grayscale['300'],
          cursor: 'default',
          pointerEvents: 'none',
        },
      },
    },
    direction: {
      up: {transform: 'rotate(270deg)'},
      down: {transform: 'rotate(90deg)'},
      left: {transform: 'rotate(180deg)'},
    },
  },
})

export const icon = style({
  width: rem(25),
  fill: color.brand.primary.white,
})

export const darkIcon = style({
  fill: color.brand.primary.charcoal,
  selectors: {
    'button:disabled &': {fill: color.brand.primary.white},
  },
})

export const darkArrow = style({
  backgroundColor: color.brand.primary.white,
  ':hover': {
    backgroundColor: color.grayscale['100'],
  },
  ':active': {
    backgroundColor: color.brand.primary.white,
  },
  ':focus-visible': {
    outlineColor: color.brand.primary.white,
  },
})

/**
 * Arrow variants interface.
 */
export type ArrowVariants = RecipeVariants<typeof arrow>
