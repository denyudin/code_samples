import type {PlayFunction} from '@storybook/csf'
import {expect} from '@storybook/jest'
import {shiftDown, shiftUp} from '../breakpoint'

/**
 * Interact with breakpoints for coverage.
 */
export const play: PlayFunction = () => {
  expect(shiftUp(1024)).toEqual('screen and (min-width: 1024px)')
  expect(shiftDown(1024)).toEqual('screen and (max-width: 1023px)')
}
