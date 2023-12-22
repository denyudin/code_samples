import {recipe} from '@vanilla-extract/recipes'
import {breakpoint, mediaQuery, shiftDown, shiftUp} from '../breakpoint'

export const SPACE = [1, 2, 3, 4, 5, 6, 7, 8] as const

interface Size {
  [key: string]: {
    ['height']: number
  }
}

const generateCSSbyQuery = (query: string): Size =>
  SPACE.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: {
        '@media': {
          [query]: {
            height: cur * 8,
          },
        },
      },
    }),
    {},
  )

const tablet = generateCSSbyQuery(mediaQuery.tablet)
const desktop = generateCSSbyQuery(shiftUp(breakpoint.desktop))
const mobile = generateCSSbyQuery(shiftDown(breakpoint.tablet))

export const spacer = recipe({
  variants: {
    tablet,
    desktop,
    mobile,
  },
})
