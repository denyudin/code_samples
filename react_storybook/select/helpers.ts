import {Children, ReactElement} from 'react'
import {SelectAction} from './types'

/**
 * Map HTML options to SelectOption array.
 * @param [children] options from children
 * @return [options] Array of Option
 */
export const getOptionsFromChildren = (children: ReactElement) => {
  const childrenOptions = Children.toArray(
    children,
  ) as ReactElement<HTMLOptionElement>[]

  return childrenOptions.map(option => ({
    value: option.props.value,
    label: option.props.children as unknown as string,
  }))
}
/**
 * Get next index based on select action.
 * @param [action] User action
 * @param [maxIndex] Options length
 * @param [currentIndex] Current active index
 * @return new index
 */
export const getUpdatedIndex = (
  action: Extract<
    SelectAction,
    | SelectAction.First
    | SelectAction.Last
    | SelectAction.Previous
    | SelectAction.Next
    | SelectAction.PageUp
    | SelectAction.PageDown
  >,
  maxIndex: number,
  currentIndex: number,
): number => {
  const pageSize = 10

  // eslint-disable-next-line default-case
  switch (action) {
    case SelectAction.First:
      return 0
    case SelectAction.Last:
      return maxIndex
    case SelectAction.Previous:
      return Math.max(0, currentIndex - 1)
    case SelectAction.Next:
      return Math.min(maxIndex, currentIndex + 1)
    case SelectAction.PageUp:
      return Math.max(0, currentIndex - pageSize)
    case SelectAction.PageDown:
      return Math.min(maxIndex, currentIndex + pageSize)
  }
}
/**
 * Map key event to SelectAction.
 * @param event Keyboard event
 * @param menuOpen Menu state
 * @return action SelectAction
 */
export const getSelectActionFromKey = (
  event: React.KeyboardEvent,
  menuOpen: boolean,
): SelectAction | null => {
  const {key, altKey} = event
  const openActionKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Space', ' ']

  // eslint-disable-next-line default-case
  switch (true) {
    case !menuOpen && openActionKeys.includes(key):
      return SelectAction.Open
    case key === 'Home':
      return SelectAction.First
    case key === 'End':
      return SelectAction.Last
  }

  if (menuOpen) {
    // eslint-disable-next-line default-case
    switch (true) {
      case key === 'ArrowUp' && altKey:
        return SelectAction.CloseSelect
      case key === 'ArrowDown' && !altKey:
        return SelectAction.Next
      case key === 'ArrowUp':
        return SelectAction.Previous
      case key === 'PageUp':
        return SelectAction.PageUp
      case key === 'PageDown':
        return SelectAction.PageDown
      case key === 'Escape':
        return SelectAction.Close
      case key === 'Enter' || key === 'Space' || key === ' ':
        return SelectAction.CloseSelect
    }
  }

  return null
}

/**
 * Check if an options container is currently scrollable.
 * @param [element] Options list container element
 * @return Boolean
 */
export const isScrollable = (element: HTMLElement): boolean =>
  element.clientHeight < element.scrollHeight

/**
 * Ensure a given child element is within the parent's visible scroll area
 * if the child is not visible, scroll the parent.
 * @param [activeElement] option element
 * @param [scrollParent] option container
 */
export const maintainScrollVisibility = (
  activeElement: HTMLElement,
  scrollParent: HTMLElement,
): void => {
  const {offsetHeight, offsetTop} = activeElement
  const {offsetHeight: parentOffsetHeight, scrollTop} = scrollParent

  const isAbove = offsetTop < scrollTop
  const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight

  if (isAbove) {
    scrollParent.scrollTo(0, offsetTop)
  } else if (isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight)
  }
}
