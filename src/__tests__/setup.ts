import { addMatchers, injectWrapperCSS, showBrowserWindow } from "./utils"

beforeAll(() => {
  // force ratio=1 for tests on high-res/retina devices
  window.devicePixelRatio = 1

  showBrowserWindow()

  injectWrapperCSS()
  addMatchers()
})
