import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import throttle from 'lodash/throttle';

import { Button } from '@components/blocks/button';
import { FormPasswordInput } from '@form-inputs/password-input';
import { PasswordAnalysis } from '@components/blocks/value-analysis/password-analysis';

import { passwordAnalysis } from '@helpers/functions';

export interface FormSetPasswordFields {
  password: string;
  repeat: string;
}

interface SetPasswordFormProps {
  translate: {
    title: string;
    hint: string;
    button: string;
  },
  onSubmit: (data) => Promise<any>;
}


export const SetPasswordForm: React.FC<SetPasswordFormProps> = ({translate, onSubmit}) => {
  const { t } = useTranslation();

  const validationSchema = yup
    .object()
    .shape({
      password: yup.string()
        .required()
        .test({
          test: (value) => Object.values(passwordAnalysis(value)).reduce((accum, value) => accum && value, true),
          message: t('common:errors.passwordWeak')
        }),
      repeat: yup.string()
        .required()
        .oneOf([yup.ref('password'), null], 'common:passwordAnalysis.passwordsMismatch'),
    })

  const formMethods = useForm<FormSetPasswordFields>({mode: 'all', resolver: yupResolver(validationSchema), criteriaMode: "firstError"});
  const { handleSubmit, formState, control } = formMethods;
  const password = useWatch({control, name: 'password'});
  const repeat = useWatch({control, name: 'repeat'});

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="mb-2 font-medium">{translate.title}</h1>
        <h5 className=" font-normal text-secondary-accent mb-6">{translate.hint}</h5>

        <FormPasswordInput
          className='mb-6'
          label={t('auth:setPassword.form.fields.password.label')+ ' *'}
          name="password"
          onChange={throttle(async (val) => {
            if (val && repeat){
              await formMethods.trigger('repeat');
            }
          }, 100)}
          displayShowPasswordButton={true}
        />
        <FormPasswordInput
          className='mb-6'
          label={t('auth:setPassword.form.fields.passwordConfirm.label')+ ' *'}
          name="repeat"
          displayShowPasswordButton={true}
        />

        <PasswordAnalysis password={password} />

        <Button disabled={!formState.isValid} className='mb-6' type='submit'>{translate.button}</Button>
      </form>
    </FormProvider>
  );
}
