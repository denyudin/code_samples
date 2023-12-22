import {style} from '@vanilla-extract/css'
import {rem} from 'polished'
import {color, globalClass} from '../theme.css'

export const pagination = style([
  globalClass,
  {
    maxWidth: rem(180),
    paddingLeft: rem(5),
    paddingRight: rem(5),
  },
])

export const title = style({
  marginBottom: rem(15),
  fontSize: rem(12),
  lineHeight: 1.3,
  textAlign: 'center',
  color: color.brand.primary.charcoal,
})

export const progressBar = style({
  position: 'relative',
  width: '100%',
  height: 2,
  marginBottom: rem(32),
  backgroundColor: color.grayscale['300'],
  borderRadius: 2,
})

export const progressLine = style({
  position: 'absolute',
  top: 0,
  left: 0,
  height: 2,
  backgroundColor: color.brand.primary.charcoal,
  borderRadius: 2,
  transition: 'width 0.3s',
})

export const button = style({width: '100%'})
