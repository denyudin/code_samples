import clsx from 'clsx'
import * as styles from './style.css'

/**
 * Allowed height of spacer (1...8).
 */
export type AllowedHeight = (typeof styles.SPACE)[number]

/**
 * Spacer component properties.
 */
export interface SpacerProps {
  desktop?: AllowedHeight
  mobile?: AllowedHeight
  tablet?: AllowedHeight
}

/**
 * Render vertical spacer component.
 * @param props Component properties
 * @param [props.desktop] Desktop height
 * @param [props.mobile] Mobile height
 * @param [props.tablet] Tablet height
 * @return React element
 * @example
 * import {Spacer} from '@mfrm-fx/ui'
 *
 * <Spacer desktop={1} tablet={2} mobile={3} />
 */
export const Spacer = ({mobile, tablet, desktop}: SpacerProps) => (
  <div
    className={clsx(
      styles.spacer({
        mobile,
        tablet,
        desktop,
      }),
    )}
  />
)
