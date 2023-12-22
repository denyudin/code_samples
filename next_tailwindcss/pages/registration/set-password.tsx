import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCallback } from 'react';

import { UnAuthGuard } from '@components/auth-provider/unaut-guard';
import { LoginLayout } from '@components/layouts/login-layout';

import { useRegisterSteps } from '@helpers/hooks/register-steper';
import { defaultGetServerSideProps } from '@helpers/pagesHelpers';
import { FormSetPasswordFields, SetPasswordForm } from '@components/forms/set-password-form';
import { getFERoute } from "@shared/constants";
import { SET_PASSWORD_GQL } from '@gql/mutations/setPassword';
import { useMutation } from '@apollo/client';
import { useAuthContext } from '@components/auth-provider';
import { ResponceSetPassword } from '@project-types/login-data';
import { Loader } from '@components/blocks/loader';
import { useHasErrorState } from '@components/pages/has-error-page';



export const SetPasswordStep = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const steps = useRegisterSteps();
  const { setUser } = useAuthContext();
  const [setPassword] = useMutation<ResponceSetPassword>(SET_PASSWORD_GQL);
  const [loading, setLoading] = useState(false);
  const {setError} = useHasErrorState();

  const onSubmit = useCallback(async (form: FormSetPasswordFields) => {
    setLoading(true);
    try {
      const response = await setPassword({ variables: {token: router.query.token, password: form.password}});
      localStorage.setItem('token', response.data.setPassword.accessToken);
      await setUser(response.data.setPassword.user);
      await router.push(getFERoute('registration.personalData'));
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  }, []);

  const translate = {
    title: t('auth:registerSetPassword.title'),
    hint: t('auth:registerSetPassword.subTitle'),
    button: t('auth:registerSetPassword.form.actions.setPassword')
  }


  return (
    <LoginLayout steps={steps}>
      <Head>
        <title>{t('auth:registerSetPassword.title')}</title>
      </Head>
      <Loader loading={loading} >
        <div className="login-typical-padding">
          <SetPasswordForm
            translate={translate}
            onSubmit={onSubmit}
          />
        </div>
      </Loader>
    </LoginLayout>
  );
}

SetPasswordStep.Guard = UnAuthGuard;

export const getServerSideProps = async (args) => defaultGetServerSideProps(args);

export default SetPasswordStep;