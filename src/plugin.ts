/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Chart, Plugin } from "chart.js"
import set from "lodash.set"
import get from "lodash.get"
import resolveConfig from "tailwindcss/resolveConfig"
import { TailwindConfig } from "tailwindcss/tailwind-config"
import invariant from "tiny-invariant"
import { flattenColorPalette, formatColor, parseColor } from "./color"
import { Maybe, MaybeArray, ParsableOptions } from "./types"
import { hasAlpha, twColorValidator } from "./utils"

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
  ): Maybe<MaybeArray<string>> => {
    if (!value) return null

    if (Array.isArray(value))
      return value.map((_val) => <string>parseTailwindColor(_val))

    if (hasAlpha(value)) {
      const [color, alpha] = value.split("/")

      const parsedColor = parseColor(<string>parseTailwindColor(color))

      if (!parsedColor) return null

      return formatColor({
        ...parsedColor,
        alpha: parseInt(alpha, 10) / 100,
      })
    }

    const parsedColor = parseColor(colorPalette[value] ?? value)

    if (!parsedColor) return null

    return formatColor(parsedColor)
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
      "fill",
    ]

    parsableOpts.forEach((parsableOpt) => {
      const defaultOpt = defaults[parsableOpt]
      const chartOpt = get(chart.options, parsableOpt)

      chart.data.datasets?.forEach((dataset) => {
        const color =
          get(dataset, parsableOpt) ||
          (isValidTwColor(chartOpt) ? chartOpt : defaultOpt)

        if (color) set(dataset, parsableOpt, parseTailwindColor(color))
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
