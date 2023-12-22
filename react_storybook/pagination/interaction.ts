import type {PlayFunction} from '@storybook/csf'
import {expect} from '@storybook/jest'
import {userEvent, waitFor, within} from '@storybook/testing-library'

/**
 * Interact with pagination for coverage.
 * @param options Interaction options
 * @param options.canvasElement Story container element
 */
export const play: PlayFunction = async ({canvasElement}) => {
  const canvas = within(canvasElement)
  const showMoreButton = canvas.getByText('Show more')
  const progressBar = canvas.getByRole('meter')

  userEvent.click(showMoreButton)
  await waitFor(
    () => {
      expect(progressBar.getAttribute('aria-valuemax')).toBe('136')
      expect(progressBar.getAttribute('aria-valuemin')).toBe('10')
      expect(progressBar.getAttribute('aria-valuenow')).toBe('30')
      expect(progressBar.children[0].getAttribute('style')).toBe(
        'width: 22.0588%;',
      )
    },
    {timeout: 500},
  )
}
