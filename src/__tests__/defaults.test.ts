import { Chart } from "chart.js"

import { specsFromFixtures } from "./utils"

import twColorsPlugin from ".."
import twConfig from "./tailwind.config"

const plugin = twColorsPlugin(twConfig)

beforeAll(() => {
  Chart.defaults.set({
    color: "violet-700",
    borderColor: "teal-700",
    backgroundColor: "teal-700/50",
  })
})

// Should've been in the plugin specs, but the set defaults
// persist even after a manual reset, causing tests that don't
// set defaults to fail. After exploring every other possible
// solution, it seems separating it here is the only way.
describe(
  // eslint-disable-next-line jest/valid-describe-callback
  "Correctly parses valid `Chart.default` colors",
  specsFromFixtures("defaults", [plugin], { wait: { fail: 30_000 } })
)
