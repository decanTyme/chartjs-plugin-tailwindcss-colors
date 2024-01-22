import type { Plugin } from "chart.js"

import { Chart } from "chart.js"
import * as chartHelpers from "chart.js/helpers"
import fs from "node:fs"
import vm from "node:vm"
import { join, relative, resolve } from "node:path"

import type {
  FixtureConfig,
  FixtureInputs,
  FixtureTypes,
  SpecFromFixtureOptions,
  Wait,
} from "./types"

import { _acquireChart, _releaseChart } from "./core"
import { createCanvas, triggerMouseEvent } from "./dom"

// https://github.com/facebook/jest/issues/11698
globalThis.fail = (reason?: string): never => {
  throw new Error(reason ?? "fail was called in a test.")
}

const helpers = {
  ...chartHelpers,
  triggerMouseEvent,
}

export function _require(code: string): FixtureConfig {
  if (typeof code !== "string") {
    fail(`Code must be a string, not ${typeof code}.`)
  }

  const context = vm.createContext({
    document,
    window,
    module,
    console,
    Chart,
    helpers,
  })

  return vm.runInContext(code, context) as FixtureConfig
}

function loadFixture(path: string): FixtureConfig {
  const matches = /\.(json|js)$/i.exec(path)
  const type = matches?.[1] ?? "json"

  const content = fs.readFileSync(path, "utf8")

  if (type === "js") {
    return _require(content)
  }

  return JSON.parse(content) as FixtureConfig
}

export async function readImageData(path: string): Promise<ImageData> {
  const image = new Image()

  image.src = `file://${join(process.cwd(), path)}`
  return new Promise<ImageData>((_resolve) => {
    image.addEventListener("load", () => {
      const h = image.height
      const w = image.width
      const canvas = createCanvas(w, h)
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) fail("Failed to get canvas context!")
      ctx.drawImage(image, 0, 0, w, h)
      _resolve(ctx.getImageData(0, 0, w, h))
    })
  })
}

// TODO: Keep in sync with the delay in matchers
function resolveWait(wait?: Wait): number | undefined {
  if (!wait) return undefined

  let delay = 0
  if (typeof wait === "number") delay = wait
  else if (wait.pass) delay = wait.pass
  else if (wait.fail) delay = wait.fail

  // Wait a bit for browser windows to
  // close when in non-CI environments
  if (!process.env.CI) delay += 500

  return delay
}

function specFromFixture(
  path: string,
  inputs: FixtureInputs,
  plugins?: Plugin[],
  options?: SpecFromFixtureOptions
): void {
  const input = inputs.js ?? inputs.json

  if (!input) fail(`Missing fixture data for ${inputs.png}`)
  if (!inputs.png) fail(`Missing PNG comparison file for ${input}`)

  const fixture = loadFixture(input)

  const description = fixture.description ?? path

  test(
    description,
    async () => {
      const { config } = fixture

      // plugins are disabled by default, except if the path
      // contains 'plugin' or there are instance plugins
      if (input.includes("plugin") || config.plugins != null) {
        config.options ??= {}
        config.options.plugins = false
      }

      if (plugins) {
        config.plugins = [...(config.plugins ?? []), ...plugins]
      }

      const chart = _acquireChart(config, fixture.options)

      const run = fixture.options?.run
      if (typeof run === "function") {
        await run(chart)
      }

      const image = await readImageData(inputs.png)

      await expect(chart).toEqualImageData(image, {
        ...options,
        ...fixture.options,
        description,
      })

      _releaseChart(chart)
    },
    resolveWait(options?.wait)
  )
}

function readFolder(path: string, root = ""): Record<string, string> {
  const cwd = process.cwd()
  const resolvedPath = resolve(cwd, root, path)

  const result: Record<string, string> = {}
  try {
    const files = fs.readdirSync(resolvedPath)

    files.forEach((filename) => {
      const fullPath = join(resolvedPath, filename)

      if (fs.statSync(fullPath).isDirectory()) {
        // Recurse into subdirectories
        Object.assign(result, readFolder(fullPath))
      } else {
        const relativePath = relative(cwd, fullPath).replaceAll("\\", "/")
        result[relativePath] = fs.readFileSync(fullPath, "utf8")
      }
    })
  } catch {
    fail("No fixtures found. Maybe try another path?")
  }

  return result
}

export function specsFromFixtures(
  path = "",
  plugins?: Plugin[],
  options?: SpecFromFixtureOptions
): () => void {
  const testsRootPath = "src/__tests__/fixtures"
  const regex = new RegExp(`(^${testsRootPath}/${path}.+)\\.(png|json|js)`)

  const inputs: Record<string, FixtureInputs> = {}

  Object.keys(readFolder(path, testsRootPath)).forEach((file) => {
    const matches = file.match(regex)

    if (!matches) return

    const [name, type] = matches.slice(1)

    // @ts-expect-error never rewrite object if already defined
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    inputs[name] ??= {}
    inputs[name][type as FixtureTypes] = file
  })

  return (): void => {
    Object.entries(inputs).forEach(([fixturePath, files]) => {
      specFromFixture(fixturePath, files, plugins, options)
    })
  }
}
