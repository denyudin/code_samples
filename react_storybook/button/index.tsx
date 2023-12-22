import clsx from 'clsx'
import type {ButtonHTMLAttributes} from 'react'
import {ButtonVariants, button as buttonStyles} from './style.css'

/**
 * Button props.
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants

/**
 * Render button.
 * @param props Component properties
 * @param [props.className] Class name for custom style
 * @param [props.variant] Button variant. Default is primary
 * @param [props.size] Button size. Default is large
 * @return React element
 * @example
 * import {Button} from '@mfrm-fx/ui'
 *
 * <Button variant="ghost">Button Text</Button>
 */
export const Button = ({
  className,
  size,
  variant,
  ...otherProps
}: ButtonProps) => (
  <button
    className={clsx(className, buttonStyles({size, variant}))}
    type="button"
    {...otherProps}
  />
)
