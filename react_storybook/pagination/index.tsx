import {ReactEventHandler, useCallback, useMemo, useState} from 'react'
import {Button} from '../button'
import * as style from './style.css'

const NUMBER_OF_ITEMS = 12
const ITEMS_PER_PAGE = 36

/**
 * Pagination component properties.
 */
export interface PaginationProps {
  /**
   * Total number of available items.
   */
  totalItems: number
  /**
   * Default number of items to display.
   */
  initialNumber?: number
  /**
   * Step by which to increase.
   */
  itemsPerPage?: number
  /**
   * Indicates whether items are loading or not.
   */
  isLoading?: boolean
  /**
   * Callback that fires when a button is clicked.
   */
  onClick?: () => void
}

/**
 * Render pagination.
 * @param props Component properties
 * @param props.totalItems Total number of available items
 * @param [props.initialNumber] Default number of items to display. Default value is 12
 * @param [props.itemsPerPage] Step by which to increase. Default value is 36
 * @param [props.isLoading] Indicates whether items are loading or not
 * @param [props.onClick] Callback that fires when a button is clicked
 * @return React element
 * @example
 * import {Pagination} from '@mfrm-fx/ui'
 *
 * <Pagination totalItems={136} />
 */
export const Pagination = ({
  totalItems,
  initialNumber = NUMBER_OF_ITEMS,
  itemsPerPage = ITEMS_PER_PAGE,
  isLoading = false,
  onClick,
}: PaginationProps) => {
  const [displayedItems, setDisplayedItems] = useState(initialNumber)

  const isButtonDisabled = useMemo(
    () => displayedItems === totalItems || isLoading,
    [displayedItems, isLoading, totalItems],
  )

  const progressLineWidth = useMemo(
    () => `${(displayedItems / totalItems) * 100}%`,
    [displayedItems, totalItems],
  )

  const buttonClickHandler: ReactEventHandler<HTMLButtonElement> =
    useCallback(() => {
      setDisplayedItems(Math.min(displayedItems + itemsPerPage, totalItems))
      onClick?.()
    }, [displayedItems, itemsPerPage, totalItems, onClick])

  return (
    <div className={style.pagination}>
      <div className={style.title}>
        Showing {displayedItems} of {totalItems}
      </div>
      <div
        aria-label="Display of loaded products"
        aria-valuemax={totalItems}
        aria-valuemin={initialNumber}
        aria-valuenow={displayedItems}
        className={style.progressBar}
        role="meter"
      >
        <div
          aria-hidden="true"
          className={style.progressLine}
          // eslint-disable-next-line react/forbid-dom-props
          style={{width: progressLineWidth}}
        />
      </div>
      <Button
        className={style.button}
        disabled={isButtonDisabled}
        variant="ghost"
        onClick={buttonClickHandler}
      >
        {isLoading ? 'Please wait...' : 'Show more'}
      </Button>
    </div>
  )
}
