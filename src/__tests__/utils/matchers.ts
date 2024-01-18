import type { MatcherFunction } from "expect"
import { Chart } from "chart.js"
import Pixelmatch from "pixelmatch"

import type { ToEqualImageDataOptions } from "./types"
import { _releaseChart } from "./core"
import { buildPixelMatchPreview, createImageData, toPercent } from "./dom"

async function delay(wait: number): Promise<void> {
  if (!process.env.CI) {
    await new Promise((resolve) => {
      setTimeout(resolve, wait)
    })
  }
}

const toEqualImageData: MatcherFunction<
  [expected: ImageData, options: ToEqualImageDataOptions]
> = async function (_, expected, options) {
  const {
    description,
    tolerance = 0.001,
    threshold = 0.1,
    wait,
    debug,
  } = options

  let ctx: CanvasRenderingContext2D | null = null
  if (_ instanceof Chart) {
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring
    ctx = _.ctx
  } else if (_ instanceof HTMLCanvasElement) {
    ctx = _.getContext("2d")
  } else if (_ instanceof CanvasRenderingContext2D) {
    ctx = _
  }

  if (!ctx) {
    return {
      message: () => "Input value is not a valid image source",
      pass: false,
    }
  }

  const h = expected.height
  const w = expected.width
  const aw = ctx.canvas.width
  const ah = ctx.canvas.height

  const actual = ctx.getImageData(0, 0, aw, ah)
  const diff = createImageData(w, h)

  const count =
    aw === w && ah === h
      ? Pixelmatch(actual.data, expected.data, diff.data, w, h, {
          threshold,
        })
      : Math.abs(aw * ah - w * h)

  const ratio = count / (w * h)

  if (ratio > tolerance || debug) {
    _releaseChart(_ as Chart) // release so it doesn't block the preview

    buildPixelMatchPreview(
      count,
      { actual, expected, diff },
      { description, threshold, tolerance }
    )

    if (typeof wait === "number") await delay(wait)
    else if (wait?.fail) await delay(wait.fail)

    const { BOLD_WEIGHT, RECEIVED_COLOR, EXPECTED_COLOR } = this.utils

    return {
      message: () =>
        `${BOLD_WEIGHT`Difference`}: ${RECEIVED_COLOR.bold`${count}px`}` +
        ` / ${RECEIVED_COLOR`${toPercent(ratio)}%`}\n` +
        `Tolerance: ${EXPECTED_COLOR`${toPercent(tolerance)}%`}\n` +
        `Threshold: ${EXPECTED_COLOR`${toPercent(threshold)}%`}`,
      pass: false,
    }
  }

  if (typeof wait === "number") await delay(wait)
  else if (wait?.pass) await delay(wait.pass)

  return {
    message: () => "Expected chart to be different",
    pass: true,
  }
}

export default { toEqualImageData }
