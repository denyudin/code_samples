/**
 * Select actions list.
 */
export enum SelectAction {
  Close,
  CloseSelect,
  Open,
  Select,
  First,
  Last,
  Previous,
  Next,
  PageDown,
  PageUp,
}

/**
 * Custom Select option interface.
 */
export interface SelectOption {
  value: string
  label: string
}
