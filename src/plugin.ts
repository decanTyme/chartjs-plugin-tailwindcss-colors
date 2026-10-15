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

      // Undefined means "leave this option alone". Returning the input color could
      // copy a chart default onto a dataset as an explicit color, so later changes
      // to that chart default would no longer reach the dataset's color option.
      return undefined
    }

    if (typeof value === "string") return resolveString(value, path)

    if (isValidArray(value)) {
      // Keep native colors and invalid colors allowed by warn/ignore as-is.
      // A throw stops map before the caller can assign any converted colors
      // from this array to its color option (for example, dataset.backgroundColor).
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

        const resolvedDefaultColor = resolveColor(
          chart,
          defaultOptColor,
          `options.${parsableOpt}`,
        )

        if (resolvedDefaultColor !== undefined) {
          set(chart.options, parsableOpt, resolvedDefaultColor)
        }

        chart.config.data.datasets.forEach((dataset, datasetIndex) => {
          const datasetColor = get(dataset, parsableOpt, defaultOptColor)
          const resolvedDatasetColor = resolveColor(
            chart,
            datasetColor,
            `data.datasets[${datasetIndex}].${parsableOpt}`,
          )

          if (resolvedDatasetColor !== undefined) {
            set(dataset, parsableOpt, resolvedDatasetColor)
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

        const metaDatasetColor = get(
          metaDataset.options,
          parsableOpt,
          defaultOptColor,
        )

        const resolvedDatasetColor = resolveColor(
          chart,
          metaDatasetColor,
          `data.datasets[${args.index}].${parsableOpt} (resolved)`,
        )

        if (resolvedDatasetColor !== undefined) {
          set(metaDataset.options, parsableOpt, resolvedDatasetColor)
        }

        const currentDataset = chart.data.datasets[args.index]

        currentDataset.data.forEach((_, index) => {
          const currentElement = args.meta.data[index]
          const elementColor = get(
            currentElement.options,
            parsableOpt,
            defaultOptColor,
          )

          const resolvedElementColor = resolveColor(
            chart,
            elementColor,
            `data.datasets[${args.index}].${parsableOpt} (data index ${index})`,
          )

          if (resolvedElementColor !== undefined) {
            set(currentElement.options, parsableOpt, resolvedElementColor)
          }
        })
      })
    },
  }
}

export default twColorsPlugin
