/* eslint-disable @typescript-eslint/ban-ts-comment */
import twColorsPlugin from "./plugin"

// https://gist.github.com/ebidel/3201b36f59f26525eb606663f7b487d0?permalink_comment_id=4102094#gistcomment-4102094
function hasModuleSupport() {
  if ("supports" in HTMLScriptElement) {
    return HTMLScriptElement.supports("module")
  }
  return "noModule" in document.createElement("script")
}

// Since Parcel v2 doesn't have proper support for global expose yet,
// manually attach the plugin to the `window` object as a workaround
// @see https://github.com/parcel-bundler/parcel/discussions/5583
// @see https://github.com/parcel-bundler/parcel/issues/7312
// @see https://github.com/parcel-bundler/parcel/pull/7240
// @see https://v1.parceljs.org/cli.html#expose-modules-as-umd
if (typeof window !== "undefined" && !hasModuleSupport()) {
  // @ts-ignore
  window.twColorsPlugin = twColorsPlugin
}

export default twColorsPlugin
