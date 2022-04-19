/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Chart } from "chart.js"
import invariant from "tiny-invariant"
import twColorsPlugin from "../src"

// @ts-ignore
import tailwindConfig from "./tailwind.config"

// TODO: Improve plugin tests
describe("Plugin works as expected", () => {
  let ctx
  let chart: Chart

  beforeAll(() => {
    Chart.register(twColorsPlugin(tailwindConfig, { borderColor: "red-500" }))
  })

  beforeEach(() => {
    ctx = document.createElement("canvas").getContext("2d")
    invariant(ctx, "Failed to initialize canvas")

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "red-600",
              "blue-500",
              "yellow-200",
              "lime-300",
              "purple-900/60",
              "orange/25",
            ],
          },
        ],
      },
    })
  })

  afterEach(() => {
    chart.destroy()
  })

  test("If it correctly parses valid colors", () => {
    expect(chart.data.datasets[0].borderColor).toEqual("rgb(239 68 68)")
  })

  test("If it correctly parses arrays of colors", () => {
    expect(chart.data.datasets[0].backgroundColor).toBeInstanceOf(Array)
    expect(chart.data.datasets[0].backgroundColor).toEqual([
      "rgb(220 38 38)",
      "rgb(59 130 246)",
      "rgb(254 240 138)",
      "rgb(190 242 100)",
      "rgb(88 28 135 / 0.6)",
      "rgb(255 165 0 / 0.25)",
    ])
  })
})
