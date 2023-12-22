import { Menu, Portal, Transition } from '@headlessui/react'
import { DROPDOWN_ANIMATION_DURATION } from '@helpers/constants';
import React, { Fragment, useState } from 'react'
import { usePopper } from 'react-popper';

const CustomItem = ({children, ...rest}) => {
  return (<div {...rest}>
    {children}
  </div>)
}

interface DropdownProps {
  target: React.ReactElement;
  position?: 'left' | 'right';
  closeAfterClick?: boolean;
  header?: React.ReactElement;
  className?: string;
  afterEnter?: () => void;
  afterLeave?: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({children, target, position = 'right', closeAfterClick = true, header, ...rest}) => {
  const placement = position == 'right' ? 'bottom-end' : 'bottom-start';

  const ItemWrapper = closeAfterClick ? Menu.Item : CustomItem;


  const [referenceElement, setReferenceElement] = useState()
  const [popperElement, setPopperElement] = useState()
  const { styles, attributes, forceUpdate } = usePopper(referenceElement, popperElement, {placement});



  return (<Menu as={Fragment}>
    <Menu.Button className={`${rest.className} cursor-pointer`} ref={setReferenceElement as any} as='div'>
      {target}
    </Menu.Button>
    <Portal>
      <div ref={setPopperElement as any} className="z-50" {...attributes.popper} style={styles.popper}>
        <Transition
          as={Fragment}
          enter={`transition ease-out duration-${DROPDOWN_ANIMATION_DURATION}`}
          enterFrom="transform opacity-full scale-95"
          enterTo="transform opacity-none scale-100"
          leave={`transition ease-in duration-${DROPDOWN_ANIMATION_DURATION}`}
          leaveFrom="transform opacity-none scale-100"
          leaveTo="transform opacity-full scale-95"
          beforeEnter={() => setTimeout(() => forceUpdate())}
          afterEnter={rest.afterEnter}
          afterLeave={rest.afterLeave}
        >
          <Menu.Items  className={`w-fit z-50 mt-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}>
          {header}
          {children &&
              React.Children
                .map(children, (child: React.ReactElement) => (<ItemWrapper key={child.key}>
                  {child}
                </ItemWrapper>))
          }
          </Menu.Items>
        </Transition>
      </div>
      </Portal>
  </Menu>)
}