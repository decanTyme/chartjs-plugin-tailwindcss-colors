import { hasValidAlpha } from "../utils"

interface TestArgs {
  color: string
  output: boolean
}

describe("Alpha validator is working", () => {
  test.each`
    color             | output   | status
    ${"yellow-50/1"}  | ${true}  | ${"valid"}
    ${"green-900/50"} | ${true}  | ${"valid"}
    ${"red-100/100"}  | ${true}  | ${"valid"}
    ${"aqua/75"}      | ${true}  | ${"valid"}
    ${"lime-600/200"} | ${false} | ${"invalid"}
    ${"orange-200/"}  | ${false} | ${"invalid"}
    ${"pink-300/0"}   | ${false} | ${"invalid"}
    ${"/"}            | ${false} | ${"invalid"}
    ${"/85"}          | ${false} | ${"invalid"}
    ${"noop/85"}      | ${false} | ${"invalid"}
  `("if `$color` is $status", ({ color, output }: TestArgs) => {
    expect(hasValidAlpha(color)).toBe(output)
  })
})

describe("Alpha validator is working with hex values", () => {
  test.each`
    color            | output   | status
    ${"#c08240/20"}  | ${true}  | ${"valid"}
    ${"#a42c20/200"} | ${false} | ${"invalid"}
    ${"#a42c20/0"}   | ${false} | ${"invalid"}
    ${"b69576/45"}   | ${false} | ${"invalid"}
    ${"#b69576/"}    | ${false} | ${"invalid"}
    ${"#/"}          | ${false} | ${"invalid"}
    ${"#/20"}        | ${false} | ${"invalid"}
  `("if `$color` is $status", ({ color, output }: TestArgs) => {
    expect(hasValidAlpha(color)).toBe(output)
  })
})
