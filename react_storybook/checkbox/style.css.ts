import {style} from '@vanilla-extract/css'
import {color, globalClass} from '../theme.css'

const CHECKED_ICON =
  '\'data:image/svg+xml,%3Csvg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M5 11L0 5.80381L1.59 4.15905L5 7.7L12.41 0L14 1.65524L5 11Z" fill="white"/%3E%3C/svg%3E\''
const HOVERED_ICON =
  '\'data:image/svg+xml,%3Csvg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M5 11L0 5.80381L1.59 4.15905L5 7.7L12.41 0L14 1.65524L5 11Z" fill="%23E1E1E1"/%3E%3C/svg%3E%0A\''

export const checkbox = style([
  globalClass,
  {
    appearance: 'none',
    border: `1.5px solid ${color.grayscale['500']}`,
    borderRadius: 2,
    boxSizing: 'content-box',
    cursor: 'pointer',
    height: 18,
    margin: 0,
    outline: 'none',
    width: 18,
    ':before': {
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      content: '',
      display: 'block',
      height: '18px',
      width: '18px',
    },
    ':checked': {
      background: color.brand.primary.charcoal,
      borderColor: color.brand.primary.charcoal,
    },
    ':disabled': {
      backgroundColor: color.grayscale['300'],
      borderColor: color.grayscale['500'],
    },
    ':focus-visible': {
      borderColor: color.grayscale['500'],
      boxShadow: `0 0 0 3px ${color.brand.primary.white}, 0 0 0 5px ${color.brand.primary.charcoal}`,
    },
    selectors: {
      '&:checked::before': {
        backgroundImage: `url(${CHECKED_ICON})`,
      },
      '&:hover:not(:disabled):not(:checked)': {
        borderColor: color.grayscale['700'],
        position: 'relative',
      },
      '&:not(:checked):not(:disabled):hover:before': {
        backgroundImage: `url(${HOVERED_ICON})`,
      },
    },
  },
])

export const label = style([
  globalClass,
  {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    gap: 10,
    userSelect: 'none',
  },
])
