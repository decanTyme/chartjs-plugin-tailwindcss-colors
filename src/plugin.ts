import type { Plugin } from "chart.js"
import type { Config as TailwindConfig } from "tailwindcss"

import get from "lodash.get"
import set from "lodash.set"

import type { ParsableOptions, ValidValues } from "./types"

import TailwindColorsParser from "./parser"

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
  defaults: Partial<ParsableOptions> = {}
): Plugin => {
  const parser = new TailwindColorsParser(tailwindConfig)

  return {
    id: "tailwindcss-colors",

    beforeLayout: (chart): void => {
      parsableOptions.forEach((parsableOpt) => {
        const chartDefaultColor = get(chart.options, parsableOpt) as ValidValues
        const defaultOptColor = defaults[parsableOpt] ?? chartDefaultColor

        if (parser.isParsable(defaultOptColor)) {
          set(chart.options, parsableOpt, parser.parse(defaultOptColor))
        }

        chart.config.data.datasets.forEach((dataset) => {
          const color = get(dataset, parsableOpt, defaultOptColor)

          if (parser.isParsable(color)) {
            set(dataset, parsableOpt, parser.parse(color))
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
          defaultOptColor
        )

        if (parser.isParsable(metaDatasetOptionsColor)) {
          set(
            metaDataset.options,
            parsableOpt,
            parser.parse(metaDatasetOptionsColor)
          )
        }

        const currentDataset = chart.data.datasets[args.index]

        currentDataset.data.forEach((_, index) => {
          const currentElement = args.meta.data[index]
          const resolvedColor = get(
            currentElement.options,
            parsableOpt,
            defaultOptColor
          )

          if (parser.isParsable(resolvedColor)) {
            set(
              currentElement.options,
              parsableOpt,
              parser.parse(resolvedColor)
            )
          }
        })
      })
    },
  }
}

export default twColorsPlugin
