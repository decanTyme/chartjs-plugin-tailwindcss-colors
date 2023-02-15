export type Maybe<T> = T | undefined | null
export type MaybeArray<T> = T | Array<T>

export interface ParsableOptions extends Record<string, MaybeArray<string>> {
  color: string
  borderColor: string
  backgroundColor: MaybeArray<string>
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
   * @default true
   */
  strict?: boolean

  /**
   * If `true`, hex values are also parsed.
   *
   * @default false
   */
  hex?: boolean
}

// Bring back types from stub `@types/tailwindcss`

export interface TailwindColorGroup {
  readonly [key: string]: string
}

export type TailwindColorValue = string | TailwindColorGroup

export interface TailwindThemeColors {
  readonly [key: string]: TailwindColorValue
}
