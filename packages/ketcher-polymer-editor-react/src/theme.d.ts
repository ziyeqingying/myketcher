import '@mui/material/styles'
import '@emotion/react'
import { Theme as MuiTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface Theme {
    colors: {
      background: {
        canvas: string
        white: string
      }
      text: {
        black: string
        gray: string
        white: string
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
    }
    fonts: {
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
    colors?: {
      background?: {
        canvas?: string
        white?: string
      }
      text?: {
        black?: string
        gray?: string
        white?: string
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
    }
    fonts?: {
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

declare module '@emotion/react' {
  /* eslint-disable  @typescript-eslint/no-empty-interface */
  export interface Theme extends MuiTheme {}
}
