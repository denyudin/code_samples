import classes from 'clsx'
import type {HTMLAttributes} from 'react'
import {ArrowIcon, DirectionalArrowIcon} from '../../icon'
import type {ArrowVariants} from './style.css'
import * as style from './style.css'

/**
 * Arrow component properties.
 */
export interface ArrowProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * Accessible name of component.
   */
  label: string
  /**
   * Enable dark theme.
   */
  dark?: boolean
}

type ArrowPropsType = ArrowProps & ArrowVariants

/**
 * Render Arrow.
 * @param props Component properties
 * @param props.label Accessible name of component
 * @param [props.direction] Arrow direction. Default is right
 * @param [props.variant] Arrow variant. Default is direction
 * @param [props.dark] If true, dark theme is enabled
 * @param [props.className] Class name for custom style
 * @return React element
 * @example
 * import {Arrow} from '@mfrm-fx/ui'
 *
 * <Arrow />
 */
export const Arrow = ({
  label,
  direction,
  variant,
  dark,
  className,
  ...restProps
}: ArrowPropsType) => (
  <button
    {...restProps}
    aria-label={label}
    className={classes(
      style.arrow({direction, variant}),
      dark === true && style.darkArrow,
      className,
    )}
    type="button"
  >
    {variant === 'carousel' ? (
      <ArrowIcon
        aria-hidden="true"
        className={classes(style.icon, dark === true && style.darkIcon)}
        focusable="false"
      />
    ) : (
      <DirectionalArrowIcon
        aria-hidden="true"
        className={classes(style.icon, dark === true && style.darkIcon)}
        focusable="false"
      />
    )}
  </button>
)
