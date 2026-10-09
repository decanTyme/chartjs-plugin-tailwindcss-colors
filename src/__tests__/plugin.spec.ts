import { Chart } from "chart.js"

import { acquireChart, releaseCharts, specsFromFixtures } from "./utils"

import twColorsPlugin from ".."
import twConfig from "./tailwind.config"

const plugin = twColorsPlugin(twConfig)

describe("Plugin works as expected", () => {
  describe.each([
    "indexable",
    "scriptable",
    "hoverBorderColor",
    "hoverBackgroundColor",
    "pointBorderColor",
    "pointBackgroundColor",
    "pointHoverBorderColor",
    "pointHoverBackgroundColor",
    "fill",
  ])("`%s`", (name) => {
    specsFromFixtures(name, [plugin], { wait: { fail: 30_000 } })()
  })
})

describe("Plugin preserves native CSS colors", () => {
  afterEach(releaseCharts)

  test.each([
    "color(srgb 1 0 0)",
    "color-mix(in srgb, red 50%, blue)",
    "light-dark(rgb(1 2 3), rgb(4 5 6))",
  ])("preserves %s in arrays during creation and updates", (color) => {
    const dataset = { data: [1, 2], backgroundColor: [color, "red-500"] }

    const chart = acquireChart({
      type: "bar",
      data: { labels: ["A", "B"], datasets: [dataset] },
      plugins: [plugin],
    })

    expect(dataset.backgroundColor).toEqual([color, "#ef4444"])

    dataset.backgroundColor = [color, "blue-500/75"]

    expect(() => {
      chart.update()
    }).not.toThrow()
    expect(dataset.backgroundColor).toEqual([color, "rgb(59 130 246 / 0.75)"])
  })
})

describe("Plugin handles untrusted color values", () => {
  let warn: jest.SpyInstance

  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => {})
  })

  afterEach(() => {
    releaseCharts()
    jest.restoreAllMocks()
  })

  test("warns once per chart and value during creation and updates", () => {
    const color = "constructor/50"
    const dataset = {
      data: [1, 2],
      backgroundColor: color,
      borderColor: "red-500/50",
    }

    const chart = acquireChart({
      type: "bar",
      data: { labels: ["A", "B"], datasets: [dataset] },
      options: { color },
      plugins: [plugin],
    })

    expect(dataset.backgroundColor).toBe(color)
    expect(dataset.borderColor).toBe("rgb(239 68 68 / 0.5)")
    expect(chart.options.color).toBe(color)
    expect(warn).toHaveBeenCalledWith(
      '[chartjs-plugin-tailwindcss-colors] Cannot resolve color "constructor/50" at options.color.',
    )

    dataset.backgroundColor = color
    dataset.borderColor = "blue-500/75"

    expect(() => {
      chart.update()
    }).not.toThrow()
    expect(dataset.backgroundColor).toBe(color)
    expect(dataset.borderColor).toBe("rgb(59 130 246 / 0.75)")
    expect(warn).toHaveBeenCalledTimes(1)

    acquireChart({
      type: "bar",
      data: {
        labels: ["A"],
        datasets: [{ data: [1], backgroundColor: color }],
      },
      plugins: [plugin],
    })
    expect(warn).toHaveBeenCalledTimes(2)
  })

  test("converts valid array entries while preserving invalid and native colors", () => {
    const colors = ["red-500", "not-a-color", "rgb(0 0 255)", "transparent"]
    const dataset = { data: colors.map(() => 1), backgroundColor: colors }

    const chart = acquireChart({
      type: "bar",
      data: { labels: colors, datasets: [dataset] },
      plugins: [plugin],
    })

    const expected = ["#ef4444", "not-a-color", "rgb(0 0 255)", "transparent"]

    expect(dataset.backgroundColor).toEqual(expected)
    expect(warn).toHaveBeenCalledWith(
      '[chartjs-plugin-tailwindcss-colors] Cannot resolve color "not-a-color" at data.datasets[0].backgroundColor[1].',
    )

    dataset.backgroundColor = colors

    expect(() => {
      chart.update()
    }).not.toThrow()
    expect(dataset.backgroundColor).toEqual(expected)
    expect(warn).toHaveBeenCalledTimes(1)
  })

  test("preserves unsupported palette opacity in scriptable colors", () => {
    const scriptablePlugin = twColorsPlugin({
      content: [],
      theme: { colors: { "custom-500": "var(--chart-color)" } },
    })

    const chart = acquireChart({
      type: "line",
      data: {
        labels: ["A", "B"],
        datasets: [
          {
            data: [1, 2],
            backgroundColor: (): string => "custom-500/50",
            borderColor: (): string => "constructor/50",
            pointBackgroundColor: (): string => "#fffff/50",
          },
        ],
      },
      plugins: [scriptablePlugin],
    })

    expect(() => {
      chart.update()
    }).not.toThrow()
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('"custom-500/50"'),
    )
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('"constructor/50"'),
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"#fffff/50"'))
    expect(warn).toHaveBeenCalledTimes(3)
  })

  test("ignore explicitly preserves invalid scalars and array entries without warnings", () => {
    const ignorePlugin = twColorsPlugin(
      twConfig,
      {},
      {
        invalidColorHandling: "ignore",
      },
    )
    const dataset = {
      data: [1, 2],
      backgroundColor: ["red-500", "not-a-color"],
      borderColor: "red-999/50",
    }
    const chart = acquireChart({
      type: "bar",
      data: { labels: ["A", "B"], datasets: [dataset] },
      plugins: [ignorePlugin],
    })

    expect(dataset.backgroundColor).toEqual(["#ef4444", "not-a-color"])
    expect(dataset.borderColor).toBe("red-999/50")
    expect(() => {
      chart.update()
    }).not.toThrow()
    expect(warn).not.toHaveBeenCalled()
  })

  test("throw aborts array conversion and reports the option path and index", () => {
    const throwingPlugin = twColorsPlugin(
      twConfig,
      {},
      {
        invalidColorHandling: "throw",
      },
    )
    const dataset = {
      data: [1, 2],
      backgroundColor: ["red-500", "blue-500"],
    }
    const chart = acquireChart({
      type: "bar",
      data: { labels: ["A", "B"], datasets: [dataset] },
      plugins: [throwingPlugin],
    })
    const invalidColors = ["red-500", "red-999/50"]
    dataset.backgroundColor = invalidColors

    expect(() => {
      chart.update()
    }).toThrow(
      '[chartjs-plugin-tailwindcss-colors] Cannot resolve color "red-999/50" at data.datasets[0].backgroundColor[1].',
    )
    expect(dataset.backgroundColor).toBe(invalidColors)
    expect(dataset.backgroundColor).toEqual(["red-500", "red-999/50"])
    expect(warn).not.toHaveBeenCalled()
  })

  test("throw reports invalid scalar values during chart creation", () => {
    const existingCharts = new Set(Object.keys(Chart.instances))

    try {
      expect(() =>
        acquireChart({
          type: "bar",
          data: {
            labels: ["A"],
            datasets: [{ data: [1], backgroundColor: "#fffff/50" }],
          },
          plugins: [
            twColorsPlugin(twConfig, {}, { invalidColorHandling: "throw" }),
          ],
        }),
      ).toThrow(
        '[chartjs-plugin-tailwindcss-colors] Cannot resolve color "#fffff/50" at data.datasets[0].backgroundColor.',
      )
    } finally {
      Object.entries(Chart.instances).forEach(([id, chart]) => {
        if (!existingCharts.has(id)) chart.destroy()
      })
    }

    expect(warn).not.toHaveBeenCalled()
  })

  test("keeps native colors and configured aliases without warnings in throw mode", () => {
    const nativePlugin = twColorsPlugin(
      {
        content: [],
        theme: { colors: { "rgb-brand": "#123456" } },
      },
      {},
      { invalidColorHandling: "throw" },
    )
    const nativeColors = [
      "rgb(1 2 3)",
      "rgba(1, 2, 3, 0.5)",
      "hsl(120 100% 50%)",
      "transparent",
      "currentColor",
      "oklch(60% 0.2 30)",
      "var(--chart-color)",
    ]
    const dataset = {
      data: nativeColors.map(() => 1),
      backgroundColor: nativeColors,
      borderColor: "crimson",
    }
    const chart = acquireChart({
      type: "bar",
      data: { labels: nativeColors, datasets: [dataset] },
      options: { color: "rgb-brand" },
      plugins: [nativePlugin],
    })

    expect(dataset.backgroundColor).toEqual(nativeColors)
    expect(dataset.borderColor).toBe("crimson")
    expect(chart.options.color).toBe("#123456")
    expect(() => {
      chart.update()
    }).not.toThrow()
    expect(warn).not.toHaveBeenCalled()
  })
})
