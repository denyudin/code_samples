import classes from 'clsx'
import type {ButtonHTMLAttributes, FunctionComponent, SVGProps} from 'react'
import * as style from './style.css'

/**
 * Icon button component properties.
 */
export interface IconButtonProps {
  /**
   * Optional classname for an additional styling.
   */
  className?: string
  /**
   * Component icon.
   */
  children: FunctionComponent<SVGProps<SVGSVGElement>>
  /**
   * Accessible name of component.
   */
  label: string
}

type IconButtonsPropsType = IconButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Render icon button.
 * @param props Component properties
 * @param props.children Icon component
 * @param [props.className] Class name for custom style
 * @param props.label Accessible name of component
 * @param props.disabled If true, component is disabled
 * @return React element
 * @example
 * import {IconButton, ArrowIcon} from '@mfrm-fx/ui'
 *
 * <IconButton label={...}><MiscArrowIcon /></IconButton>
 */
export const IconButton = ({
  children: IconComponent,
  className,
  label,
  disabled,
  ...restProps
}: IconButtonsPropsType) => (
  <button
    {...restProps}
    aria-label={label}
    className={classes(className, style.button)}
    disabled={disabled}
    type="button"
  >
    <IconComponent
      aria-hidden="true"
      className={style.icon}
      focusable="false"
    />
  </button>
)
