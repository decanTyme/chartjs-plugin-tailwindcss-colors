import type { Chart, ChartEvent, Element, Point, PointElement } from "chart.js"
import type { PixelMatchPreviewData, PixelMatchPreviewOptions } from "./types"

export function toPercent(value: number): number {
  return Math.round(value * 10_000) / 100
}

export function injectCSS(css: TemplateStringsArray): void {
  // https://stackoverflow.com/q/3922139
  const head = document.querySelectorAll("head").item(0)
  const style = document.createElement("style")
  style.setAttribute("type", "text/css")
  style.append(document.createTextNode(css.toString()))
  head.append(style)
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return canvas
}

export function createImageData(width: number, height: number): ImageData {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) fail("Failed to get canvas context!")
  return ctx.getImageData(0, 0, width, height)
}

export function canvasFromImageData(data: ImageData): HTMLCanvasElement {
  const canvas = createCanvas(data.width, data.height)
  const ctx = canvas.getContext("2d")
  if (!ctx) fail("Failed to get canvas context!")
  ctx.putImageData(data, 0, 0)
  return canvas
}

export function buildPixelMatchPreview(
  count: number,
  data: PixelMatchPreviewData,
  options: PixelMatchPreviewOptions
): void {
  const { actual, expected, diff } = data
  const { threshold, tolerance, description } = options

  const ratio = count / (actual.width * actual.height)
  const wrapper = document.createElement("div")
  const items = document.createElement("div")

  wrapper.append(document.createTextNode(description))
  wrapper.style.cssText =
    "margin-bottom: 3rem; border: 1px solid black; padding: 0.5rem;"
  items.style.cssText = "display: flex; overflow-y: auto;"

  const values = [
    { data: actual, label: "Actual" },
    { data: expected, label: "Expected" },
    {
      data: diff,
      label:
        `diff: ${count}px (${toPercent(ratio)}%)<br />` +
        `thr: ${toPercent(threshold)}%, ` +
        `tol: ${toPercent(tolerance)}%`,
    },
  ]

  values.forEach((value) => {
    const item = document.createElement("div")

    item.style.cssText = `text-align: center; font: 0.75rem monospace; line-height: 1.4; margin: 0.5rem;`
    item.innerHTML = `<div style="margin: 0.5rem; height: 2rem">${value.label}</div>`

    const canvas = canvasFromImageData(value.data)
    canvas.style.cssText = "border: 1px dashed red"

    item.append(canvas)
    items.append(item)
  })

  wrapper.append(items)

  wrapper.toString = (): string => `Fixture test failed:
  Difference: ${count}px / ${toPercent(ratio)}%
  Threshold: ${toPercent(threshold)}%
  Tolerance: ${toPercent(tolerance)}%`

  document.body.append(wrapper)
}

function _resolveElementPoint(
  element: Element | PointElement | undefined
): Point {
  const isPointElement = (v: Element | PointElement): v is PointElement =>
    "getCenterPoint" in v && typeof v.getCenterPoint === "function"

  if (element) {
    if (isPointElement(element)) {
      return element.getCenterPoint()
    }

    return element
  }

  return { x: 0, y: 0 }
}

export function afterEvent(
  chart: Chart & { _eventHandler: (event: ChartEvent) => void },
  type: ChartEvent["type"],
  callback: (...args: unknown[]) => void
): void {
  const override = chart._eventHandler

  chart._eventHandler = function handler(event: ChartEvent): void {
    override.call(this, event)

    if (event.type === type || event.native?.type === type) {
      chart._eventHandler = override
      callback()
    }
  }
}

export async function triggerMouseEvent(
  chart: Chart,
  type: ChartEvent["type"],
  element: Element | PointElement
): Promise<MouseEvent> {
  const node = chart.canvas
  const rect = node.getBoundingClientRect()
  const point = _resolveElementPoint(element)

  const event = new MouseEvent(type, {
    clientX: rect.left + point.x,
    clientY: rect.top + point.y,
    cancelable: true,
    bubbles: true,
    view: window,
  })

  const promise = new Promise<void>((resolve) => {
    // @ts-expect-error accessing private chart method
    afterEvent(chart, type, resolve)
  })

  node.dispatchEvent(event)

  await promise

  return event
}
