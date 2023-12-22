import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    overrides: {
        MuiCard: {
            root: {
                width: '100%',
                maxWidth: '600px',
                margin: 'auto'
            }
        },
    }
});

export default theme;
