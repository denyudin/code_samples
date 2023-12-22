
const defaultTheme = require('tailwindcss/defaultTheme')
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

const tailwindColors = require('tailwindcss/colors');

const colors = {
  'primary': '#004e8a',
  'primary-hover': '#005e6e',
  'primary-light': '#e8f0f3',

  'error-hover': tailwindColors.red[800],
  'error': tailwindColors.red[600],
  'error-border': tailwindColors.red[300],
  'error-light': tailwindColors.red[100],

  'success': tailwindColors.emerald[800],
  'success-icon': tailwindColors.emerald[400],
  'success-light': tailwindColors.emerald[100],

  'warning': tailwindColors.amber[800],
  'warning-icon': tailwindColors.amber[400],
  'warning-light': tailwindColors.amber[100],

  'progress': tailwindColors.blue[800],
  'progress-icon': tailwindColors.blue[400],
  'progress-light': tailwindColors.blue[100],

  'secondary-darker': tailwindColors.gray[900],
  'secondary-dark': tailwindColors.gray[700],
  'secondary-accent': tailwindColors.gray[500],
  'secondary-placeholder': tailwindColors.gray[400],
  'secondary': tailwindColors.gray[300],
  'secondary-light': tailwindColors.gray[200],
  'secondary-lighter': tailwindColors.gray[100],
  'white-accent': tailwindColors.gray[50],

  'default': tailwindColors.gray[600]
}

const customWidth = {
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '52': '13rem',
  '64': '16rem',
  '70' : '17.5rem',
  '90' : '22.5rem',
  '96' : '24rem',
  '112': '28rem',
  '116': '29rem',
  '148': '37rem',
  '152': '39rem',
  '180': '45rem',
  '240': '60rem',
  '320': '80rem'
}

const customHeight = {
  '54': '13.5rem',
  '70' : '17.5rem',
  '80': '20rem',
  '122': '30.5rem',
  '136': '34rem',
  '148': '37rem',
}

module.exports = {
  content: [
    join(__dirname, '/**/!(*.spec).{ts,tsx,html,json}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    screens: {
      xss: {max: '374px'},
      xs: '376px',
      sm: '481px',
      md: '769px',
      lg: '977px',
      xl: '1441px',
    },
    extend: {
      colors: colors,
      textColor: colors,
      opacity: {
        'sm': '.50',
        'xs': '.80',
        'full': '0',
        'none': '1'
      },
      width: {
        ...customWidth
      },
      minWidth: {
        ...customWidth
      },
      maxWidth: {
        ...customWidth
      },
      fontFamily: {
        sans: ['Fedra Sans', ...defaultTheme.fontFamily.sans],
      },
      height: {
        ...customHeight
      },
      minHeight: {
        ...customHeight
      },
      maxHeight: {
        ...customHeight
      },
      backgroundImage: {
        'auth-bg': "url('/auth-background.webp')",
      },
      flexGrow: {
        '2': 2,
        '3': 3,
        '4': 4,
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}