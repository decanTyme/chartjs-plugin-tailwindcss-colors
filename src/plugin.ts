import type { Chart, Plugin } from "chart.js"
import type { Config as TailwindConfig } from "tailwindcss"

import get from "lodash.get"
import set from "lodash.set"
import resolveConfig from "tailwindcss/resolveConfig"
import invariant from "tiny-invariant"

import { flattenColorPalette, formatColor, parseColor } from "./color"
import {
  Maybe,
  ParsableOptions,
  TailwindThemeColors,
  ValidValues,
} from "./types"
import { hasValidAlpha, twColorValidator } from "./utils"

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
  const colors = resolveConfig(tailwindConfig).theme
    ?.colors as Maybe<TailwindThemeColors>

  invariant(colors, "TailwindCSS theme colors is undefined!")

  const colorPalette = flattenColorPalette(colors)

  const isParsable = twColorValidator(colorPalette)

  const parseTailwindColor = (value: string | string[]): string | string[] => {
    if (Array.isArray(value)) {
      return value.map((v) => <string>parseTailwindColor(v))
    }

    if (hasValidAlpha(value)) {
      const [color, alpha] = value.split("/")

      const parsedColor = parseColor(colorPalette[color] ?? color)

      return formatColor({
        ...parsedColor,
        alpha: parseInt(alpha, 10) / 100,
      })
    }

    return colorPalette[value] ?? value
  }

  const initialize = (chart: Chart) => {
    parsableOpts.forEach((parsableOpt) => {
      const chartOptColor: ValidValues = get(chart.options, parsableOpt)
      const defaultOptColor = defaults[parsableOpt] || chartOptColor

      if (isParsable(defaultOptColor, { strict: false })) {
        set(chart.options, parsableOpt, parseTailwindColor(defaultOptColor))
      }

      chart.data.datasets.forEach((dataset) => {
        const color = get(dataset, parsableOpt) || defaultOptColor

        if (isParsable(color, { strict: false })) {
          set(dataset, parsableOpt, parseTailwindColor(color))
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

        if (isParsable(metaDatasetOptsColor, { strict: false })) {
          set(
            metaDataset.options,
            parsableOpt,
            parseTailwindColor(metaDatasetOptsColor)
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

          if (isParsable(resolvedColor, { strict: false })) {
            set(
              currentElement.options,
              parsableOpt,
              parseTailwindColor(resolvedColor)
            )
          }
        })
      })
    },
  }
}

export default twColorsPlugin
