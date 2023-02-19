/* eslint-disable @typescript-eslint/ban-ts-comment */
import twColorsPlugin from "./plugin"

// Since Parcel v2 doesn't have proper support for global expose yet,
// manually attach the plugin to the `window` object as a workaround
// @see https://github.com/parcel-bundler/parcel/discussions/5583
// @see https://github.com/parcel-bundler/parcel/issues/7312
// @see https://github.com/parcel-bundler/parcel/pull/7240
// @see https://v1.parceljs.org/cli.html#expose-modules-as-umd
if (typeof window !== "undefined") {
  // @ts-ignore
  window.twColorsPlugin = twColorsPlugin
}

export default twColorsPlugin
