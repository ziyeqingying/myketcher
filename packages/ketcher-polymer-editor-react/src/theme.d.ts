import '@mui/material/styles'
import { Theme as MuiTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface Theme {
    color: {
      background: {
        canvas: string
        primary: string
        secondary: string
      }
      text: {
        primary: string
        secondary: string
        light: string
      }
      tab: {
        regular: string
        active: string
        hover: string
      }
      scroll: {
        regular: string
        inactive: string
      }
      button: {
        primary: {
          active: string
          hover: string
          clicked: string
          disabled: string
        }
        secondary: {
          active: string
          hover: string
          clicked: string
          disabled: string
        }
        text: {
          primary: string
          secondary: string
          disabled: string
        }
      }
      dropdown: {
        primary: string
        secondary: string
        hover: string
        disabled: string
      }
      tooltip: {
        background: string
        text: string
      }
      link: {
        active: string
        hover: string
      }
      divider: string
      error: string
      input: {
        border: {
          regular: string
          active: string
          hover: string
        }
      }
      icon: {
        hover: string
        active: string
        activeMenu: string
        clicked: string
        disabled: string
      }
    }
    font: {
      size: {
        medium: string
        xsmall: string
      }
      family: {
        montserrat: string
      }
      weight: {
        300: number
        400: number
        600: number
      }
    }
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    color?: {
      background?: {
        canvas?: string
        primary?: string
        secondary?: string
      }
      text?: {
        primary?: string
        secondary?: string
        light?: string
      }
      tab?: {
        regular?: string
        active?: string
        hover?: string
      }
      scroll?: {
        regular?: string
        inactive?: string
      }
      button?: {
        primary?: {
          active?: string
          hover?: string
          clicked?: string
          disabled?: string
        }
        secondary?: {
          active?: string
          hover?: string
          clicked?: string
          disabled?: string
        }
        text?: {
          primary?: string
          secondary?: string
          disabled?: string
        }
      }
      dropdown?: {
        primary?: string
        secondary?: string
        hover?: string
        disabled?: string
      }
      tooltip?: {
        background?: string
        text?: string
      }
      link?: {
        active?: string
        hover?: string
      }
      divider?: string
      error?: string
      input?: {
        border?: {
          regular?: string
          active?: string
          hover?: string
        }
      }
      icon?: {
        hover?: string
        active?: string
        activeMenu?: string
        clicked?: string
        disabled?: string
      }
    }
    font?: {
      size?: {
        medium?: string
        xsmall?: string
      }
      family?: {
        montserrat?: string
      }
      weight?: {
        300?: number
        400?: number
        600?: number
      }
    }
  }
}