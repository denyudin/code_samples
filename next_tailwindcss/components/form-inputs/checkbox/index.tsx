import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { Label } from '@components/form-inputs/label';

import { formField } from '../field-wrapper';
import { classNames } from '@helpers/functions';
import { getErrorMessage } from '@helpers/validation-messages';

import { FieldProps } from '@project-types/inputs';

export interface CheckBoxProps extends FieldProps {
  hideError?: boolean;
  id?: string;
};


export const CheckBox = React.forwardRef<HTMLInputElement, CheckBoxProps>(({children, hideError, hint, error, id, label, className, ...rest}, ref) => {
  const elementId = useMemo(() => `checkbox-${id || rest.name}-${Date.now()}` ,[id])
  const borderColor = !error ?
    'border-secondary focus:border-primary' :
    'border-error-border focus:border-error-border';

  const { t } = useTranslation();

  return (<div className={className}>
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={elementId}
          type="checkbox"
          checked={rest.value || false}
          className={classNames('focus:ring-primary h-4 w-4 text-primary', borderColor)}
          {...rest}
        />
      </div>
      <div className="ml-3 text-sm">
        <Label id={elementId} className={'font-normal'}>{label}</Label>
      </div>
    </div>
    {!hideError && (<>
      { !!(error || hint) && <p className={classNames(error && 'text-error', "mt-2")}>{getErrorMessage(t, error) || hint}</p>}
    </>)}
  </div>)
})

CheckBox.displayName = "CheckBox";

export const FormCheckBox = formField<CheckBoxProps>(CheckBox, {blurOnchange: true})