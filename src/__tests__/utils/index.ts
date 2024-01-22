// Test utilities taken from `chartjs-test-utils`, which is
// Copyright (c) chartjs-test-utils Contributors
// and used under the terms of the MIT license
// @see https://github.com/chartjs/chartjs-test-utils/blob/master/LICENSE.md

import type { ChartConfiguration, Chart } from "chart.js"
import expect from "expect"
import { getCurrentWindow } from "@electron/remote"

import type { AcquireChartOptions, TestChart } from "./types"
import { _acquireChart, _releaseChart } from "./core"
import matchers from "./matchers"
import { injectCSS } from "./dom"

export function addMatchers(): void {
  expect.extend(matchers)
}

export function injectWrapperCSS(): void {
  injectCSS`
  .wrapper, .wrapper canvas {
    border: 0;
    margin: 0;
    padding: 0;
  }

  .wrapper {
    position: absolute
  }`
}

// Keep track of all acquired charts to
// automatically release them after each spec
const charts = new Map<string, TestChart>()

/**
 * Injects a new `canvas` (and `div` wrapper) and creates
 * the associated `Chart` instance using the given config.
 * Additional options allow tweaking elements
 * generation.
 *
 * @param config - Chart config.
 * @param options - Chart acquisition options.
 */
export function acquireChart(
  config: ChartConfiguration,
  options?: AcquireChartOptions
): Chart {
  const chart = _acquireChart(config, options)
  charts.set(chart.id, chart)
  return chart
}

export function releaseChart(chart: Chart): boolean {
  _releaseChart(chart)
  return charts.delete(chart.id)
}

export function releaseCharts(): void {
  charts.forEach((chart) => {
    if (!chart.$test?.persistent) {
      releaseChart(chart)
    }
  })
}

/**
 * Will have no effect in CI environments.
 */
export function showBrowserWindow(): void {
  if (!process.env.CI) {
    getCurrentWindow().show()
  }
}

export * from "./fixture"
export { afterEvent, triggerMouseEvent } from "./dom"

export type { FixtureConfig } from "./types"
