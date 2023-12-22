import clsx from 'clsx'
import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
  useState,
} from 'react'
import * as style from './style.css'

/**
 * Checkbox component properties.
 */
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  checked?: boolean
  labelClassName?: string
}

/**
 * Render controlled checkbox component.
 * @param props Component properties
 * @param [props.children] Checkbox label
 * @param [props.onChange] The callback fired when the user clicks on the checkbox (for analytics purposes)
 * @param [props.checked] Default state of checkbox
 * @param [props.labelClassName] Classname for checkbox label
 * @example
 * import {Checkbox} from '@mfrm-fx/ui'
 *
 * <Checkbox>Label</Checkbox>
 * @return React element
 */
export const Checkbox = ({
  children,
  onChange,
  checked,
  labelClassName,
  ...inputProps
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(Boolean(checked))
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event)
      setIsChecked(prev => !prev)
    },
    [onChange],
  )

  return (
    <label className={clsx(style.label, labelClassName)}>
      <input
        {...inputProps}
        checked={isChecked}
        className={style.checkbox}
        type="checkbox"
        onChange={handleChange}
      />
      {children}
    </label>
  )
}
