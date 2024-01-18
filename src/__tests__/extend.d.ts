import type { Chart as ChartJS } from "chart.js"
import type { afterEvent, triggerMouseEvent } from "./utils/dom"
import type { ToEqualImageDataOptions } from "./utils/types"

type ChartHelpers = typeof import("chart.js/helpers")

interface Helpers extends ChartHelpers {
  triggerMouseEvent: typeof triggerMouseEvent
  afterEvent: typeof afterEvent
}

declare global {
  const Chart: ChartJS
  const helpers: Helpers

  namespace jest {
    interface Matchers<R> {
      toEqualImageData: (
        data: ImageData,
        options: ToEqualImageDataOptions
      ) => Promise<R>
    }
  }
}
