import {
  addMatchers,
  injectWrapperCSS,
  showBrowserWindow,
  specsFromFixtures,
} from "./utils"

import twColorsPlugin from ".."
import twConfig from "./tailwind.config"

const plugin = twColorsPlugin(twConfig)

beforeAll(() => {
  // force ratio=1 for tests on high-res/retina devices
  window.devicePixelRatio = 1

  showBrowserWindow()

  injectWrapperCSS()
  addMatchers()
})

describe("Plugin works as expected", () => {
  describe.each([
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
