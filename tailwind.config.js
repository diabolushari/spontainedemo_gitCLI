import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
import colors from 'tailwindcss/colors.js'

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.tsx',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
        'h1-stop': ['var(--font-h1-1stop)', ...defaultTheme.fontFamily.sans],
        'h2-1stop': ['var(--font-h2-1stop)', ...defaultTheme.fontFamily.sans],
        'h3-1stop': ['var(--font-h3-1stop)', ...defaultTheme.fontFamily.sans],
        'subheader-1stop': ['var(--font-subheader-1stop)', ...defaultTheme.fontFamily.sans],
        'body-1stop': ['var(--font-body-1stop)', ...defaultTheme.fontFamily.sans],
        'small-1stop': ['var(--font-small-1stop)', ...defaultTheme.fontFamily.sans],
        'small-1stop-header': ['var(--font-small-1stop)', ...defaultTheme.fontFamily.sans],
        'xlmetric-1stop': ['var(--font-xlmetric-1stop)', ...defaultTheme.fontFamily.sans],
      },

      colors: {
        primary: 'var(--colour-1stop-highlight)',
        // one stop
        '1stop-accent1': 'var(--colour-1stop-accent1)',
        '1stop-dark': 'var(--colour-1stop-dark)',
        '1stop-accent2': 'var(--colour-1stop-accent2)',
        '1stop-highlight': 'var(--colour-1stop-highlight)',
        '1stop-highlight2': 'var(--colour-1stop-highlight2)',
        '1stop-gray': 'var(--colour-1stop-gray)',
        '1stop-white': 'var(--colour-1stop-white)',
        '1stop-link': 'var(--colour-1stop-link)',
        '1stop-background': 'var(--colour-1stop-background)',
        'header-dark': 'var(--color-header-dark)',
        'accent-light': 'var(--color-accent-light)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-dark': 'var(--color-accent-dark)',
        'panel-dark': 'var(--color-panel-dark)',
        'highlight-light': 'var(--color-highlight-light)',
        'highlight-alert': 'var(--color-highlight-alert)',
        'border-dark': 'var(--color-border-dark)',

        'button-base': 'var(--color-button-base)',
        'button-muted': 'var(--color-button-muted)',
        'button-base-hover': 'var(--color-button-base-hover)',
        'button-muted-hover': 'var(--color-button-muted-hover)',
        'button-accent-hover': 'var(--color-button-accent-hover)',

        'button-text-base': 'var(--color-button-textbase)',

        'tab-base': 'var(--color-tab-base)',
        'tab-accent': 'var(--color-tab-accent)',
        success: 'var(--color-success)',
        fail: 'var(--color-fail)',

        light: 'var(--color-light)',
        dark: 'var(--color-dark)',
        black: 'var(--color-black)',
        'page-title': 'var(--color-title-text)',
        'text-base': 'var(--color-text-base)',
        'textbox-field': 'var( --color-text-textbox)',
        'textbox-color': 'var(--color-box-textbox)',

        card1: 'var(--color-card-yellow)',
        card2: 'var(--color-card--pink)',
        'progress-bar': 'var(--color-card--progressbar)',
        dropdown: 'var( --color-dropdown)',
        background: 'var(--color-background)',
        neutral: {
          50: '#fcfdfd',
          100: '#f9fafb',
          200: '#f3f5f8',
          300: '#ecf1f4',
          400: '#e6ecf1',
          500: '#e0e7ed',
          600: '#b3b9be',
          700: '#868b8e',
          800: '#5a5c5f',
          900: '#2d2e2f',
        },
        highlight: {
          50: '#fef3ef',
          100: '#fde7e0',
          200: '#fbd0c0',
          300: '#f8b8a1',
          400: '#f6a181',
          500: '#f48962',
          600: '#c36e4e',
          700: '#92523b',
          800: '#623727',
          900: '#311b14',
        },
        alert: {
          50: '#f6fcf8',
          100: '#eef9f0',
          200: '#dcf3e1',
          300: '#cbecd2',
          400: '#b9e6c3',
          500: '#a8e0b4',
          600: '#86b390',
          700: '#65866c',
          800: '#435a48',
          900: '#222d24',
        },
      },
      borderWidth: {
        3: '3px',
        5: '5px',
        10: '10px',
      },
    },
  },
  plugins: [forms, require("tailwindcss-animate")],
}
