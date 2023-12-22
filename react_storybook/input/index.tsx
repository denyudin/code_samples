import classes from 'clsx'
import type {InputHTMLAttributes, ReactNode} from 'react'
import {
  type InputVariants,
  errorMessage,
  inputError,
  inputStyle,
  labelBackground,
  labelError,
  labelStyle,
  labelText,
  wrapperStyle,
} from './style.css'

/**
 * Input component properties.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input label.
   */
  children: ReactNode
  /**
   * Input error message.
   */
  error?: string
}

type InputPropsType = InputProps & InputVariants

/**
 * Render input.
 * @param props Component properties
 * @param props.children Input label
 * @param [props.size] Input sizes, one of 'small', 'medium' and 'large'. Default is 'large'
 * @param [props.error] Input error message
 * @param props.id Unique ID
 * @return React element
 * @example
 * import {Input} from '@mfrm-fx/ui'
 *
 * <Input>Label</Input>
 */
export const Input = ({
  children,
  size,
  error,
  id,
  ...restProps
}: InputPropsType) => {
  const {type = 'text', placeholder = id} = restProps
  const hasError = Boolean(error)

  return (
    <div className={wrapperStyle}>
      <input
        {...restProps}
        className={classes(inputStyle({size}), hasError && inputError)}
        id={id}
        placeholder={placeholder}
        type={type}
      />
      <label
        className={classes(labelStyle, hasError && labelError)}
        htmlFor={id}
      >
        <span className={labelBackground} role="presentation" />
        <span className={labelText}>{children}</span>
      </label>
      {hasError && <div className={errorMessage}>{error}</div>}
    </div>
  )
}
