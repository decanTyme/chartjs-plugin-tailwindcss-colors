import type { Scriptable } from "chart.js"
import type { AnyObject } from "chart.js/types/basic"

export type Writeable<T> = { -readonly [P in keyof T]: T[P] }
export type Maybe<T> = T | undefined | null
export type ValidValues = string | Array<string> | Scriptable<string, AnyObject>

export interface ParsableOptions
  extends Record<string, string | Array<string>> {
  color: string
  borderColor: string
  backgroundColor: string | Array<string>
  hoverBorderColor: string
  hoverBackgroundColor: string
  pointBackgroundColor: string
  pointBorderColor: string
  pointHoverBackgroundColor: string
  pointHoverBorderColor: string
}

export interface Color {
  mode: "rgb" | "hsl"
  values: Array<string>
  alpha?: string | number
}

export interface TwColorValidatorOpts {
  /**
   * @default false
   */
  strict?: boolean

  /**
   * If `true` and `strict` is `false`, hex values are also parsed.
   *
   * @default false
   */
  hex?: boolean

  /**
   * If `true` and `strict` is `false`, named colors are also parsed.
   *
   * @default false
   */
  named?: boolean
}

// Bring back types from stub `@types/tailwindcss`

export interface TailwindColorGroup {
  readonly [key: string]: string
}

export type TailwindColorValue = string | TailwindColorGroup

export interface TailwindThemeColors {
  readonly [key: string]: TailwindColorValue
}
