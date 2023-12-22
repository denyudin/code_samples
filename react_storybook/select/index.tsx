import clsx from 'clsx'
import {
  KeyboardEventHandler,
  ReactElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import {
  getOptionsFromChildren,
  getSelectActionFromKey,
  getUpdatedIndex,
  isScrollable,
  maintainScrollVisibility,
} from './helpers'
import * as style from './style.css'
import type {SelectVariants} from './style.css'
import {SelectAction, SelectOption} from './types'

type SelectProps = SelectVariants & {
  children: ReactElement
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  value?: string
  onChange?: (value: string) => void
}

const ARIA_LABEL_FALLBACK = 'select option'
const OPTION_ID_BASE = 'select-option-'

/**
 * Renders Select component.
 * @param props Component properties
 * @param [props.placeholder] Placeholder string
 * @param [props.children] Options as children
 * @param [props.disabled] Select disabled
 * @param [props.error] Select has error
 * @param [props.size] Select size. Default is large
 * @param [props.label] Select label
 * @param [props.value] value for controlled Select
 * @param [props.onChange] Change handler for controlled Select
 * @return React element
 */
export const Select = ({
  placeholder,
  children,
  size,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
}: SelectProps) => {
  const selectRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonId = useId()
  const labelId = useId()
  const menuId = useId()

  const [open, setOpen] = useState(false)
  const [shouldIgnoreBlur, setShouldIgnoreBlur] = useState(false)
  const [options] = useState(getOptionsFromChildren(children))
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<SelectOption>()

  useEffect(() => {
    if (value === undefined) {
      return
    }

    const initialOptionIndex = options.findIndex(
      option => option.value === value,
    )

    if (initialOptionIndex >= 0) {
      setActiveIndex(initialOptionIndex)
      setSelectedOption(options[initialOptionIndex])
    }
  }, [options, value])

  const changeOption = useCallback((index: number) => {
    setActiveIndex(index)

    const menuElement = menuRef.current
    const activeOptionElement =
      menuElement?.querySelectorAll('[role=option]')[index]

    if (activeOptionElement && isScrollable(menuElement)) {
      maintainScrollVisibility(activeOptionElement as HTMLElement, menuElement)
    }
  }, [])

  const selectOption = useCallback(
    (index: number) => {
      const option = options[index]
      setSelectedOption(option)
      onChange?.(option.value)
      setOpen(false)
    },
    [onChange, options],
  )

  const handleClickButton = useCallback(() => {
    setOpen(open => !open)
  }, [])

  const handleClickOption = (index: number) => () => {
    changeOption(index)
    selectOption(index)
  }

  const handleBlur = useCallback(() => {
    if (shouldIgnoreBlur) {
      return setShouldIgnoreBlur(false)
    }

    if (open) {
      selectOption(activeIndex)
    }
  }, [activeIndex, shouldIgnoreBlur, open, selectOption])

  const handleMousedownOption = useCallback(() => {
    setShouldIgnoreBlur(true)
  }, [])

  const handleKeyDown = useCallback<KeyboardEventHandler>(
    event => {
      const selectElement = selectRef.current
      const maxIndex = options.length - 1
      const action = getSelectActionFromKey(event, open)

      switch (action) {
        case SelectAction.Last:
        // @ts-ignore
        // Intentional fallthrough
        // eslint-disable-next-line no-fallthrough
        case SelectAction.First:
          setOpen(true)
          selectElement?.focus()
        // Intentional fallthrough
        // eslint-disable-next-line no-fallthrough
        case SelectAction.Next:
        case SelectAction.Previous:
        case SelectAction.PageUp:
        case SelectAction.PageDown:
          event.preventDefault()
          return changeOption(getUpdatedIndex(action, maxIndex, activeIndex))
        case SelectAction.CloseSelect:
          event.preventDefault()
          return selectOption(activeIndex)
        case SelectAction.Close:
          event.preventDefault()
          return setOpen(false)
        case SelectAction.Open:
          event.preventDefault()
          setOpen(true)
          return selectElement?.focus()
        default:
      }
    },
    [activeIndex, changeOption, open, options.length, selectOption],
  )

  return (
    <div
      aria-labelledby={labelId}
      className={clsx(
        style.wrapper,
        error && style.error,
        disabled && style.disabled,
      )}
    >
      {Boolean(label) && (
        <label className={clsx(style.label)} htmlFor={buttonId} id={labelId}>
          <span className={style.labelBackground} role="presentation" />
          <span className={style.labelText}>{label}</span>
        </label>
      )}
      <button
        ref={selectRef}
        aria-activedescendant={open ? `${OPTION_ID_BASE}${activeIndex}` : ''}
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label ?? ARIA_LABEL_FALLBACK}
        aria-labelledby={labelId}
        className={style.button({size})}
        id={buttonId}
        role="combobox"
        tabIndex={0}
        type="button"
        onBlur={handleBlur}
        onClick={handleClickButton}
        onKeyDown={handleKeyDown}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </button>
      {open && (
        <div
          ref={menuRef}
          aria-label={label ?? ARIA_LABEL_FALLBACK}
          aria-labelledby={labelId}
          className={style.menu}
          id={menuId}
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option, index) => {
            const selected = Boolean(option.value === selectedOption?.value)
            const active = activeIndex === index

            return (
              <div
                key={option.value}
                aria-selected={selected}
                className={clsx(
                  style.option,
                  active && style.optionActive,
                  selected && style.optionSelected,
                )}
                id={`${OPTION_ID_BASE}${index}`}
                role="option"
                onClick={handleClickOption(index)}
                onMouseDown={handleMousedownOption}
              >
                {option.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
