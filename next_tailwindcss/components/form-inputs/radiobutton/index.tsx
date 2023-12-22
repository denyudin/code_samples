import React from 'react';
import { Label } from '@components/form-inputs/label';
import { classNames, renderValue } from '@helpers/functions';
import { FieldProps } from '@project-types/inputs';
import { Option } from '@project-types/options';
import { FieldWrapper, formField } from '../field-wrapper';


export interface RadioButtonProps extends FieldProps {
  options: Array<Option>;
  bordered?: boolean;
}

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(({options, bordered, ...rest}, ref) => {
  let twActive = '';
  let twNormal = '';
  let twMain = 'flex items-start mt-2 last:mb-0 mb-3';
  if (bordered) {
    twMain = 'border px-4 py-3 flex items-center mb-0 first:mt-2 cursor-pointer';
    twActive = 'border-primary bg-primary-light';
    twNormal = 'bg-white hover:bg-white-accent';
  }
  return (<>
  <FieldWrapper
    className={rest.className}
    error={rest.error}
    id={rest.id}
    hint={rest.hint}
    label={rest.label}
  > {options.map((option, index) => (<div key={`${rest.id || rest.name}-${option.value}`} onClick={() => rest.onChange(option.value)} className={classNames(twMain, option.value === rest.value ? twActive : twNormal )}>
            <input
              id={`${rest.id}-${option.value}`}
              name={rest.id || rest.name || rest.label?.toString()}
              type="radio"
              checked={option.value === rest.value}
              onChange={() => rest.onChange(option.value)}
              className="focus:ring-primary h-4 w-4 text-primary border-secondary mr-2"
            />
            <Label
              id={`${rest.id}-${option.value}`}
            >
              {renderValue(option.label)}
            </Label>
        </div>))}
  </FieldWrapper></>)
});

RadioButton.displayName = "RadioButton";

export const FormRadioButton = formField<RadioButtonProps>(RadioButton)