import type {ReactNode} from 'react'
import {card} from './style.css'

/**
 * Subcategory card component properties.
 */
export interface SubcategoryCardProps {
  /**
   * Component content.
   */
  children: ReactNode
}

/**
 * Render subcategory card component.
 * @param props Component properties
 * @param props.children Component content
 * @return React element
 * @example
 * import {SubcategoryCard, Image} from '@mfrm-fx/ui'
 *
 * <SubcategoryCard>
 *   <Image {...} />
 *   <a href='#'>{...}</a>
 * </SubcategoryCard>
 */
export const SubcategoryCard = ({children}: SubcategoryCardProps) => (
  <div className={card}>{children}</div>
)
