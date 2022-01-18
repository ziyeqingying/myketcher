// <reference types="react-scripts" />

declare module '*.less' {
  const classes: { [className: string]: string }
  export default classes
}

declare namespace NodeJS {
  export interface ProcessEnv {
    VERSION: string
    BUILD_DATE: string
    BUILD_NUMBER: string
  }
}

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
        dark: string
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
        small: string
        regular: string
        medium: string
        xsmall: string
      }
      family: {
        montserrat: string
        inter: string
      }
      weight: {
        light: number
        regular: number
        bold: number
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
        dark?: string
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
        small?: string
        regular?: string
        medium?: string
        xsmall?: string
      }
      family?: {
        montserrat?: string
        inter?: string
      }
      weight?: {
        light?: number
        regular?: number
        bold?: number
      }
    }
  }
}
declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >

  const src: ReactComponent
  export default src
}
