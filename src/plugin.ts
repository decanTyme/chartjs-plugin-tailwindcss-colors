/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Plugin } from "chart.js"
import resolveConfig from "tailwindcss/resolveConfig"
import { TailwindConfig } from "tailwindcss/tailwind-config"
import invariant from "tiny-invariant"
import { flattenColorPalette, formatColor, parseColor } from "./color"
import { ParsableOptions } from "./types"
import { hasAlpha, twColorValidator } from "./utils"

const twColorsPlugin = (
  tailwindConfig: TailwindConfig,
  defaults: Partial<ParsableOptions> = {}
): Plugin => {
  const {
    theme: { colors },
  } = resolveConfig(tailwindConfig)

  invariant(colors, "Undefined TailwindCSS theme colors")

  const flattenedColorPalette = flattenColorPalette(colors)

  const isValidTwColor = twColorValidator(flattenedColorPalette)

  const parseTailwindColor = (
    name: string | Array<string>
  ): string | Array<string> | undefined => {
    if (!name) return undefined

    if (Array.isArray(name))
      return name.map((val) => <string>parseTailwindColor(val))

    if (hasAlpha(name)) {
      const [color, alpha] = name.split("/")

      return formatColor({
        ...parseColor(<string>parseTailwindColor(color)),
        alpha: parseInt(alpha, 10) / 100,
      })
    }

    // Anything that is not a tailwindcss valid color format
    // (i.e., hex or rgb forms) should be returned as-is
    if (!isValidTwColor(name)) return name

    return formatColor({
      ...parseColor(flattenedColorPalette[name]),
    })
  }

  return {
    id: "tailwindcss-colors",
    beforeInit: (chart) => {
      const parsableOpts = [
        "color",
        "borderColor",
        "backgroundColor",
        "pointBackgroundColor",
        "pointBorderColor",
        "pointHoverBackgroundColor",
        "pointHoverBorderColor",
      ]

      // Ignoring some typings here since Chart.js's typings
      // itself has its own problems (i.e., too broad),
      // or maybe I overlooked something?
      parsableOpts.forEach((parsableOpt) => {
        const defaultOpt = defaults[parsableOpt]
        const chartOpt = chart.options[<keyof typeof chart.options>parsableOpt]

        chart.data.datasets?.forEach((dataset) => {
          const datasetOpt =
            // @ts-ignore - ts(7053)
            dataset[<keyof typeof chart.data.datasets>parsableOpt]

          // @ts-ignore - ts(7053)
          dataset[<keyof typeof chart.data.datasets>parsableOpt] =
            parseTailwindColor(
              datasetOpt ||
                (chartOpt?.toString().includes("-") ? chartOpt : defaultOpt)
            )
        })
      })
    },
  }
}

export default twColorsPlugin
