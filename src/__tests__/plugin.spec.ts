import { specsFromFixtures } from "./utils"

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
