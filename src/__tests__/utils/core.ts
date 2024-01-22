import type { ChartConfiguration } from "chart.js"
import { Chart } from "chart.js"

import type { AcquireChartOptions, TestChart } from "./types"
import { spritingOff, spritingOn } from "./spriting"

interface ChartSetupElements {
  wrapper: HTMLDivElement
  canvas: HTMLCanvasElement
}

function setupCanvas(
  options: Pick<AcquireChartOptions, "canvas" | "wrapper">
): ChartSetupElements {
  const wrapper = document.createElement("div")
  const canvas = document.createElement("canvas")

  const {
    canvas: canvasAttributes = { height: 512, width: 512 },
    wrapper: wrapperAttributes = { class: "wrapper" },
  } = options

  Object.entries(canvasAttributes).forEach(([name, value]) => {
    if (typeof value !== "object") {
      canvas.setAttribute(name, value.toString())
    }
  })

  Object.entries(wrapperAttributes).forEach(([name, value]) => {
    if (typeof value !== "object") {
      wrapper.setAttribute(name, value.toString())
    }
  })

  document.body.append(wrapper)

  return { wrapper, canvas }
}

export function _acquireChart(
  config: ChartConfiguration,
  options: AcquireChartOptions = {}
): Chart {
  const { wrapper, canvas } = setupCanvas(options)

  if (options.useShadowDOM) {
    wrapper.attachShadow({ mode: "open" }).append(canvas)
  } else {
    wrapper.append(canvas)
  }

  // by default, remove chart animation and auto resize
  config.options ??= {}
  config.options.animation ??= false
  config.options.responsive ??= false
  config.options.locale ??= "en-US"

  let chart: TestChart
  try {
    const ctx = canvas.getContext("2d")
    if (!ctx) fail("Failed to get canvas context!")

    if (options.spriteText) {
      spritingOn(ctx)
    }

    chart = new Chart(ctx, config)
  } catch (error) {
    wrapper.remove()
    throw error
  }

  chart.$test = {
    persistent: options.persistent,
    wrapper,
  }

  return chart
}

export function _releaseChart(chart: TestChart): void {
  spritingOff(chart.ctx)
  chart.destroy()

  const { wrapper } = chart.$test ?? {}
  if (wrapper?.parentNode) {
    wrapper.remove()
  }
}
