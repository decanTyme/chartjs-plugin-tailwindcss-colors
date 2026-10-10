import type { Scriptable } from "chart.js"
import type { AnyObject } from "chart.js/types/basic"
import type Colors from "color-name"

export type Writeable<T> = { -readonly [P in keyof T]: T[P] }
export type Maybe<T> = T | null | undefined
export type ValidValues = Scriptable<string, AnyObject> | string[] | string

export type NamedColor = keyof typeof Colors

export type InvalidColorHandling = "ignore" | "throw" | "warn"

export interface TwColorsPluginOptions {
  /**
   * How to handle color values that the plugin cannot resolve.
   *
   * @default "warn"
   */
  invalidColorHandling?: InvalidColorHandling
}

export type ColorResult =
  | { kind: "converted"; value: string }
  | { kind: "invalid" }
  | { kind: "native" }

export interface ParsableOptions extends Record<string, string[] | string> {
  color: string
  borderColor: string
  backgroundColor: string[] | string
  hoverBorderColor: string
  hoverBackgroundColor: string
  pointBackgroundColor: string
  pointBorderColor: string
  pointHoverBackgroundColor: string
  pointHoverBorderColor: string
}

export interface Color {
  mode: "hsl" | "rgb"
  values: string[]
  alpha?: number | string
}

// Bring back types from stub `@types/tailwindcss`

export type TailwindColorGroup = Readonly<Record<string, string | undefined>>
