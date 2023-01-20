/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Chart, Plugin } from "chart.js"
import get from "lodash.get"
import set from "lodash.set"
import resolveConfig from "tailwindcss/resolveConfig"
import { TailwindConfig } from "tailwindcss/tailwind-config"
import invariant from "tiny-invariant"

import { flattenColorPalette, formatColor, parseColor } from "./color"
import { MaybeArray, ParsableOptions } from "./types"
import { hasValidAlpha, isValidArray, twColorValidator } from "./utils"

const twColorsPlugin = (
  tailwindConfig: TailwindConfig,
  defaults: Partial<ParsableOptions> = {}
): Plugin => {
  const {
    theme: { colors },
  } = resolveConfig(tailwindConfig)

  invariant(colors, "TailwindCSS theme colors is undefined!")

  const colorPalette = flattenColorPalette(colors)

  const isValidTwColor = twColorValidator(colorPalette)

  const parseTailwindColor = (
    value: MaybeArray<string>
  ): MaybeArray<string> => {
    invariant(value, `Invalid value: ${value}`)

    if (isValidArray(value)) {
      return value.map((_val) => <string>parseTailwindColor(_val))
    }

    if (hasValidAlpha(value)) {
      const [color, alpha] = value.split("/")

      const parsedColor = parseColor(<string>parseTailwindColor(color))

      return formatColor({
        ...parsedColor,
        alpha: parseInt(alpha, 10) / 100,
      })
    }

    return formatColor(parseColor(colorPalette[value] ?? value))
  }

  const plugin = (chart: Chart) => {
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

    parsableOpts.forEach((parsableOpt) => {
      const defaultOpt = defaults[parsableOpt]
      const chartOpt = get(chart.options, parsableOpt)

      chart.data.datasets?.forEach((dataset) => {
        const color =
          get(dataset, parsableOpt) ||
          (isValidTwColor(chartOpt) ? chartOpt : defaultOpt)

        if (isValidTwColor(color, { strict: false })) {
          set(dataset, parsableOpt, parseTailwindColor(color))
        }
      })
    })
  }

  return {
    id: "tailwindcss-colors",
    beforeInit: plugin,
    beforeUpdate: plugin,
  }
}

export default twColorsPlugin
