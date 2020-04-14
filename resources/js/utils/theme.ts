import C from './constants'

export const theme = {
  // Colors
  black: '#444',
  darkGray: '#616161',
  middleGray: '#b1b1b1',
  lightGray: '#F1F1F1',
  offWhite: '#FAFAFA',
  red: '#dd4343',
  blue: '#2f7ad0',
  darkBlue: '#16559e',

  // Fonts
  primaryFont: 'Lato, sans-serif',

  // Easing
  fastEaseOut: 'cubic-bezier(0.000, 0.905, 0.270, 0.975)',
  bounce: 'cubic-bezier(.18,.89,.32,1.28)',

  // Box Shadows
  boxShadow: '0 1px 2px rgba(0,0,0, .12)',

  // Typographic modular scale
  // Calculated from base font size with a ratio of 1.25. So, ms(0) is your
  // base font size, and you can go up and down from there.
  ms: (modifier: number) => `${(C.baseFontSize * (1.25 ** modifier)).toFixed(2)}px`,

  // Breakpoints
  break: {
    medium: '1400px',
  },
}

export type ThemeInterface = typeof theme
