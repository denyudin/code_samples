import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { getSports as getSportsAction, getSportsAndTranslate as getSportsAndTranslateAction } from 'actions/sportActions'
import { getLicensesAction, resetAction, getLicenseInfoAction } from 'actions/userDashboard/userLicensesActions'
import UserPageWrapper from 'components/UserPersonal/UserElements/UserPageWrapper'
import UserLicenseEmptyContent from 'components/UserLicense/UserLicenseEmptyContent'
import { hasUserAdminRules } from 'selectors/userSelectors'
import { getTranslations } from 'actions/languageActions'
import { LazyLoad, Loader } from 'components/SharedComponents'
import { IUserLicense } from 'model/License'
import LicenseItem from 'components/UserLicense/LicenseItem'
import { AppState } from 'store'
import { Sport } from 'model/Sport'
import { sportsSelector } from 'selectors/sportsSelectors'
import { IMeta } from 'model/Meta'

interface IConnectedState {
    translations: { [key: string]: string };
    isUserAdmin: boolean;
    licenses: IUserLicense[];
    lastMeta: IMeta;
    getLicensesPending: boolean;
    sports: Sport[];
}

interface IConnectedDispatch {
    getLicenses(): Promise<void>;
    reset(): void;
    getTranslationsAction(): void;
    getSports(): Promise<void>;
    getSportsAndTranslate(): Promise<void>;
    getLicenseById(licenseId): Promise<void>;
}

export interface IProps extends IConnectedState, IConnectedDispatch {
    currentLanguage: string;
}

function UserLicenseContainer({
    currentLanguage,
    translations,
    isUserAdmin,
    licenses,
    getLicensesPending,
    lastMeta,
    sports,
    getSports,
    getSportsAndTranslate,
    getTranslationsAction,
    getLicenses,
    getLicenseById,
    reset
}: IProps): JSX.Element {

    useEffect(() => {
        if (!translations || !Object.keys(translations).length) {
            getSports()
                .then(() => {
                    getTranslationsAction()
                })
        } else {
            getSportsAndTranslate()
        }
    }, [])

    const getMoreLicenseInfo = (licenseId): void => {
        getLicenseById(licenseId)
    }

    const hasMoreToLoad = !lastMeta || lastMeta.hasMore

    return (
        translations ?
            <IntlProvider key='content' messages={translations || {}} locale={currentLanguage} defaultLocale='en'>
                <UserPageWrapper>
                    <LazyLoad
                        isLoading={getLicensesPending}
                        onLoadMore={getLicenses}
                        hasMore={hasMoreToLoad}
                        onUnmount={reset}
                        emptyContent={<UserLicenseEmptyContent isUserAdmin={isUserAdmin} />}
                    >
                        {
                            licenses.map((license, index) => <LicenseItem key={index} license={license} sports={sports} getMoreLicenseInfo={getMoreLicenseInfo} />)
                        }
                    </LazyLoad>
                </UserPageWrapper>
            </IntlProvider>
            : <Loader mods='center' />
    )
}

function mapState(state: AppState): IConnectedState {
    const { licenses, lastMeta, getLicensesPending } = state.userLicensesReducer
    const { translations } = state.languageReducer

    return {
        sports: sportsSelector(state),
        translations,
        isUserAdmin: hasUserAdminRules(state),
        licenses,
        lastMeta,
        getLicensesPending
    }
}

function mapDispatch(dispatch): IConnectedDispatch {
    return {
        getLicenses(): Promise<void> {
            return dispatch(getLicensesAction())
        },
        reset(): void {
            dispatch(resetAction())
        },
        getTranslationsAction(): void {
            dispatch(getTranslations())
        },
        getSports(): Promise<void> {
            return dispatch(getSportsAction())
        },
        getSportsAndTranslate(): Promise<void> {
            return dispatch(getSportsAndTranslateAction())
        },
        getLicenseById(licenseId): Promise<void> {
            return dispatch(getLicenseInfoAction(licenseId))
        },
    }
}

export default connect(mapState, mapDispatch)(UserLicenseContainer)