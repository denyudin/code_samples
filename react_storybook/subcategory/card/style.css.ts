import {globalStyle, style} from '@vanilla-extract/css'
import {rem} from 'polished'
import {breakpoint, shiftUp} from '../../breakpoint'
import {image} from '../../generic/style.css'
import {color, globalClass} from '../../theme.css'

export const card = style([
  globalClass,
  {
    width: rem(130),
    borderRadius: rem(10),
    '@media': {
      [shiftUp(breakpoint.tablet)]: {
        width: rem(224),
      },
      [shiftUp(breakpoint.desktop)]: {
        width: rem(288),
      },
    },
  },
])

globalStyle(`${card} ${image}`, {
  width: '100%',
  height: rem(87),
  marginBottom: rem(16),
  objectFit: 'cover',
  borderRadius: rem(10),
  aspectRatio: '3/2',
  '@media': {
    [shiftUp(breakpoint.tablet)]: {
      height: rem(150),
    },
    [shiftUp(breakpoint.desktop)]: {
      height: rem(192),
    },
  },
})

globalStyle(
  `${card} h2, ${card} h3, ${card} h4, ${card} h5, ${card} h6, ${card} p, ${card} a`,
  {
    fontWeight: 400,
    fontSize: rem(14),
    lineHeight: 1.4,
    color: color.brand.primary.charcoal,
    textDecoration: 'none',
  },
)
