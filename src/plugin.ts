import type { Chart, Plugin } from "chart.js"
import type { Config as TailwindConfig } from "tailwindcss"

import get from "lodash/get"
import set from "lodash/set"

import type {
  ParsableOptions,
  TwColorsPluginOptions,
  ValidValues,
} from "./types"

import TailwindColorsParser from "./parser"
import { isValidArray } from "./utils"

const parsableOptions = [
  "color",
  "borderColor",
  "backgroundColor",
  "hoverBorderColor",
  "hoverBackgroundColor",
  "pointBorderColor",
  "pointBackgroundColor",
  "pointHoverBorderColor",
  "pointHoverBackgroundColor",
  "fill.above",
  "fill.below",
]

const twColorsPlugin = (
  tailwindConfig: TailwindConfig,
  defaults: Partial<ParsableOptions> = {},
  options: TwColorsPluginOptions = {},
): Plugin => {
  const { invalidColorHandling = "warn" } = options

  const parser = new TailwindColorsParser(tailwindConfig)
  const warnedColors = new WeakMap<Chart, Set<string>>()

  const reportInvalidColor = (
    chart: Chart,
    value: string,
    path: string,
  ): void => {
    if (invalidColorHandling === "ignore") return

    const prefix = "[chartjs-plugin-tailwindcss-colors]"
    const message = `${prefix} Cannot resolve color ${JSON.stringify(value)} at ${path}.`

    if (invalidColorHandling === "throw") {
      throw new Error(message)
    }

    let warnings = warnedColors.get(chart)
    if (warnings?.has(value)) return

    if (warnings === undefined) {
      warnings = new Set()
      warnedColors.set(chart, warnings)
    }

    warnings.add(value)

    // eslint-disable-next-line no-console -- Report each invalid value once per chart.
    console.warn(message)
  }

  const resolveColor = (
    chart: Chart,
    value: unknown,
    path: string,
  ): string[] | string | undefined => {
    const resolveString = (
      color: string,
      colorPath: string,
    ): string | undefined => {
      const result = parser.resolve(color)

      if (result.kind === "converted") return result.value
      if (result.kind === "invalid") {
        reportInvalidColor(chart, color, colorPath)
      }

      // Undefined tells scalar callers to skip assignment. Returning the original
      // color could copy an inherited fallback onto the dataset as an explicit
      // option, preventing later chart-default changes from reaching it.
      return undefined
    }

    if (typeof value === "string") return resolveString(value, path)

    if (isValidArray(value)) {
      // Every array position needs a color, so keep the original entry when
      // resolveString has no replacement.
      return value.map(
        (color, index) => resolveString(color, `${path}[${index}]`) ?? color,
      )
    }

    return undefined
  }

  return {
    id: "tailwindcss-colors",

    beforeLayout: (chart): void => {
      parsableOptions.forEach((parsableOpt) => {
        const chartDefaultColor = get(chart.options, parsableOpt) as ValidValues
        const defaultOptColor = defaults[parsableOpt] ?? chartDefaultColor

        const parsedDefaultColor = resolveColor(
          chart,
          defaultOptColor,
          `options.${parsableOpt}`,
        )

        if (parsedDefaultColor !== undefined) {
          set(chart.options, parsableOpt, parsedDefaultColor)
        }

        chart.config.data.datasets.forEach((dataset, datasetIndex) => {
          const color = get(dataset, parsableOpt, defaultOptColor)
          const parsedColor = resolveColor(
            chart,
            color,
            `data.datasets[${datasetIndex}].${parsableOpt}`,
          )

          if (parsedColor !== undefined) {
            set(dataset, parsableOpt, parsedColor)
          }
        })
      })
    },

    // Handle scriptable options
    beforeDatasetDraw: (chart, args): void => {
      parsableOptions.forEach((parsableOpt) => {
        const chartOptColor = get(chart.options, parsableOpt) as ValidValues
        const defaultOptColor = defaults[parsableOpt] ?? chartOptColor

        const metaDataset = args.meta.dataset

        if (!metaDataset) return

        const metaDatasetOptionsColor = get(
          metaDataset.options,
          parsableOpt,
          defaultOptColor,
        )

        const parsedDatasetColor = resolveColor(
          chart,
          metaDatasetOptionsColor,
          `data.datasets[${args.index}].${parsableOpt} (resolved)`,
        )

        if (parsedDatasetColor !== undefined) {
          set(metaDataset.options, parsableOpt, parsedDatasetColor)
        }

        const currentDataset = chart.data.datasets[args.index]

        currentDataset.data.forEach((_, index) => {
          const currentElement = args.meta.data[index]
          const resolvedColor = get(
            currentElement.options,
            parsableOpt,
            defaultOptColor,
          )

          const parsedColor = resolveColor(
            chart,
            resolvedColor,
            `data.datasets[${args.index}].${parsableOpt} (data index ${index})`,
          )

          if (parsedColor !== undefined) {
            set(currentElement.options, parsableOpt, parsedColor)
          }
        })
      })
    },
  }
}

export default twColorsPlugin
