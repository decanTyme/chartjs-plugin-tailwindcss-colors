export type StringIndexable<T = string> = { readonly [key: string]: T }

export interface ParsableOptions extends StringIndexable {
  color: string
  borderColor: string
  backgroundColor: string
}

export type Color = {
  mode: "rgb" | "hsl"
  color: Array<string>
  alpha?: string | number
}
