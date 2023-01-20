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

export type Color = {
  mode: "rgb" | "hsl"
  color: Array<string>
  alpha?: string | number
}

export interface TwColorValidatorOpts {
  strict?: boolean
}
