import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { classNames } from '@helpers/functions';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Fragment } from 'react';

export interface Breadcrumb {
  label: string;
  link: string;
}

export interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  className?: string;
}


export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({breadcrumbs, className}) => {
  const { t } = useTranslation();
  const lastParent = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;
  const twItemClass = 'text-gray-500 hover:text-secondary-dark text-sm font-medium';
  return (<><div className={classNames(className, 'items-center hidden sm:flex')} >
    {breadcrumbs.map(item => (
      <Fragment key={item.label}>
        <ChevronRightIcon className="text-gray-500 h-5 w-5 mx-3" />
        <Link href={item.link}>
          <a className={twItemClass}>{item.label}</a>
        </Link>
      </Fragment>
    ))}
  </div>
  <div className={classNames(className, 'items-center flex sm:hidden')} >
    {lastParent &&
      <Fragment>
        <Link href={lastParent.link}>
          <a className={classNames(twItemClass, 'flex items-center')}>
            <ChevronLeftIcon className="text-gray-500 h-5 w-5 mx-3" />
            {t('common:actions.back')}
          </a>
        </Link>
      </Fragment>
    }
  </div>
  </>)
}
