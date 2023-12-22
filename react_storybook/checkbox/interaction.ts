import type {PlayFunction} from '@storybook/csf'
import {expect} from '@storybook/jest'
import {userEvent, waitFor, within} from '@storybook/testing-library'

/**
 * Interact with checkbox for coverage.
 * @param options Interaction options
 * @param options.canvasElement Story container element
 */
export const play: PlayFunction = async ({canvasElement}) => {
  const canvas = within(canvasElement)
  const checkbox = canvas.getByTestId('checkbox')

  userEvent.click(checkbox)

  await waitFor(
    () => {
      expect(checkbox).toBeChecked()
    },
    {timeout: 500},
  )
}
