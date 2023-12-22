// Interactions should be awaited. https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/await-interactions.md
/* eslint-disable @typescript-eslint/await-thenable */

import type {PlayFunction} from '@storybook/csf'
import {expect} from '@storybook/jest'
import {fireEvent, userEvent, within} from '@storybook/testing-library'

/**
 * Interact with Select for coverage.
 * @param options Interaction options
 * @param options.canvasElement Story container element
 */
export const play: PlayFunction = async ({canvasElement}) => {
  const canvas = within(canvasElement)
  const select = canvas.getByRole('combobox')

  // Enter select by click
  await userEvent.click(select)
  await expect(canvas.getByRole('listbox')).toBeVisible()

  // Close by Escape
  await userEvent.keyboard('{Escape}')

  // Enter select by Enter
  await userEvent.keyboard('{Enter}')

  const thirdOption = await canvas.getAllByRole('option')[3]

  // Select option #4 in menu
  await fireEvent.mouseDown(thirdOption)
  await userEvent.click(thirdOption)
  await expect(select).toHaveTextContent('Option 4')

  // Enter select by click
  await userEvent.click(select)

  // Test navigation by special keys
  await userEvent.keyboard('{PageDown}')
  await userEvent.keyboard('{PageUp}')
  await userEvent.keyboard('{End}')
  await userEvent.keyboard('{Home}')

  // Navigate to 3rd option by Down key
  await userEvent.keyboard('{Down}')
  await userEvent.keyboard('{Down}')

  // Close and select 3rd option by blur event
  await userEvent.click(canvasElement)
  await expect(select).toHaveTextContent('Option 3')

  // Enter select by click
  await userEvent.click(select)

  // Navigate to previous option by Up key
  await userEvent.keyboard('{Up}')

  // Select option by Enter key
  await userEvent.keyboard('{Enter}')

  await expect(select).toHaveTextContent('Option 2')

  // Open Select by Space
  await userEvent.keyboard('{Space}')

  // Navigate to next option by Up key
  await userEvent.keyboard('{Down}')

  // Select active option and close by Alt + Up
  await userEvent.keyboard('{Alt}{Up/}{/Alt}')

  await expect(select).toHaveTextContent('Option 3')
}
