import type { Chart, ChartConfiguration } from "chart.js"
import type { PixelmatchOptions } from "pixelmatch"

export interface CharacterCoordinates {
  sx: number
  sy: number
  w: number
  h: number
}

export interface MockCanvasRenderingContext2D extends CanvasRenderingContext2D {
  _fillText?: CanvasText["fillText"]
  _measureText?: CanvasText["measureText"]
}

export interface AcquireChartOptions {
  /** Canvas attributes. */
  canvas?: Partial<HTMLCanvasElement>

  /** Canvas wrapper attributes. */
  wrapper?: Partial<HTMLDivElement>

  /**
   * Use an `OffscreenCanvas` instead of the normal `HTMLCanvasElement`.
   */
  useOffscreenCanvas?: boolean

  useShadowDOM?: boolean

  /**
   * If `true`, the chart will not be released after the spec.
   */
  persistent?: boolean

  spriteText?: boolean
}

export interface TestChart extends Chart {
  $test?: {
    persistent?: boolean
    wrapper: HTMLDivElement
  }
}

export type Wait =
  | number
  | {
      pass?: number
      fail?: number
    }

export interface ToEqualImageDataOptions
  extends Pick<PixelmatchOptions, "threshold"> {
  description: string
  debug?: boolean

  /**
   * Adds an artificial delay (in ms) on each
   * spec run. Useful for debugging fixtures.
   * In CI environments, this will have no effect.
   */
  wait?: Wait

  /** @default 0.001 */
  tolerance?: number
}

export type PixelMatchPreviewData = Record<
  "actual" | "diff" | "expected",
  ImageData
>

export type PixelMatchPreviewOptions = Required<
  Omit<ToEqualImageDataOptions, "debug" | "wait">
>

export type SpecFromFixtureOptions = Omit<
  ToEqualImageDataOptions,
  "description"
>

export interface FixtureInputs {
  png: string
  js: string | undefined
  json: string | undefined
}

export type FixtureTypes = keyof FixtureInputs

interface FixtureConfigOptions
  extends AcquireChartOptions,
    Omit<ToEqualImageDataOptions, "description"> {
  run: (chart: Chart) => Promise<void>
}

export interface FixtureConfig {
  config: ChartConfiguration & { options?: { plugins?: false } }
  options?: FixtureConfigOptions

  /**
   * This will show up as the description in the test suites.
   *
   * @default filePath
   */
  description?: string
}
