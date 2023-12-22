import React, {useEffect} from "react";
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import {CssBaseline, Container} from '@material-ui/core';

import theme from '../theme';
import Navigation from "../components/layout/Navigation";

const App = (props) => {
    const { Component, pageProps } = props;
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, [])
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Navigation />
                <Container>
                    <Component {...pageProps} />
                </Container>
            </ThemeProvider>
        </>
    )
}

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};

export default App
