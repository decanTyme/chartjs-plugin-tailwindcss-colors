import type { Chart, Plugin } from "chart.js"
import type { Config as TailwindConfig } from "tailwindcss"

import get from "lodash.get"
import set from "lodash.set"

import type { ParsableOptions, ValidValues } from "./types"

import TailwindColorsParser from "./parser"

const parsableOpts = [
  "color",
  "borderColor",
  "backgroundColor",
  "hoverBorderColor",
  "hoverBackgroundColor",
  "pointBorderColor",
  "pointBackgroundColor",
  "pointHoverBackgroundColor",
  "pointHoverBorderColor",
  "fill.above",
  "fill.below",
]

const twColorsPlugin = (
  tailwindConfig: TailwindConfig,
  defaults: Partial<ParsableOptions> = {}
): Plugin => {
  const parser = new TailwindColorsParser(tailwindConfig)

  const initialize = (chart: Chart) => {
    parsableOpts.forEach((parsableOpt) => {
      const chartOptColor: ValidValues = get(chart.options, parsableOpt)
      const defaultOptColor = defaults[parsableOpt] || chartOptColor

      if (parser.isParsable(defaultOptColor)) {
        set(chart.options, parsableOpt, parser.parse(defaultOptColor))
      }

      chart.data.datasets.forEach((dataset) => {
        const color = get(dataset, parsableOpt, defaultOptColor)

        if (parser.isParsable(color)) {
          set(dataset, parsableOpt, parser.parse(color))
        }
      })
    })
  }

  return {
    id: "tailwindcss-colors",

    // Shouldn't be needed, but tests fail without it
    // FIXME Update plugin tests so this can be removed
    beforeInit: initialize,

    // FIXME
    // Shouldn't be needed, but charts "lose" colors on some
    // updates for some reason. Serves as a workaround for now.
    beforeUpdate: initialize,

    beforeDatasetDraw: (chart: Chart, args) => {
      parsableOpts.forEach((parsableOpt) => {
        const chartOptColor: ValidValues = get(chart.options, parsableOpt)
        const defaultOptColor = defaults[parsableOpt] || chartOptColor

        const metaDataset = args.meta.dataset

        if (!metaDataset) return

        const metaDatasetOptsColor = get(
          metaDataset.options,
          parsableOpt,
          defaultOptColor
        )

        if (parser.isParsable(metaDatasetOptsColor)) {
          set(
            metaDataset.options,
            parsableOpt,
            parser.parse(metaDatasetOptsColor)
          )
        }

        const currentDataset = chart.data.datasets[args.index]

        currentDataset.data.forEach((_, i) => {
          const currentElement = args.meta.data[i]
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
