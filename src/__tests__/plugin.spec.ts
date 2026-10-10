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
  afterEach(releaseCharts)

  test("rejects inherited palette properties during creation and updates", () => {
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

    dataset.backgroundColor = color
    dataset.borderColor = "blue-500/75"

    expect(() => {
      chart.update()
    }).not.toThrow()
    expect(dataset.backgroundColor).toBe(color)
    expect(dataset.borderColor).toBe("rgb(59 130 246 / 0.75)")
  })

  test("does not replace an array when an entry fails conversion", () => {
    const colors = ["red-500", "blue-500"]
    const dataset = { data: colors.map(() => 1), backgroundColor: colors }

    const chart = acquireChart({
      type: "bar",
      data: { labels: colors, datasets: [dataset] },
      plugins: [plugin],
    })

    const invalidColors = ["red-500", "not-a-color"]
    dataset.backgroundColor = invalidColors

    expect(() => {
      chart.update()
    }).toThrow("Invalid value: not-a-color")
    expect(dataset.backgroundColor).toBe(invalidColors)
    expect(dataset.backgroundColor).toEqual(["red-500", "not-a-color"])
  })

  test("rejects unsupported opacity before converting scriptable colors", () => {
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
  })
})
