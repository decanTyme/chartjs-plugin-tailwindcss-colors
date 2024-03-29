import type {
  CharacterCoordinates,
  MockCanvasRenderingContext2D,
} from "./types"

const characters = new Image()

// data url for image containing all the characters
characters.src =
  "data:image/png;base64,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"

// the data url image size
const imgWidth = 256
const imgHeight = 256

// individual characted bounding box
const cellWidth = 17
const cellHeight = 17

// char code for [0, 0]
const startIndex = 32

// number of columns in image
const columns = Math.floor(imgWidth / cellWidth)

// number of rows in image
const rows = Math.floor(imgHeight / cellHeight)

// font height (in pixels)
const fontHeight = 16

// the font widths by char code, starting at startIndex
const fontWidth = [
  4, 4, 6, 7, 7, 10, 9, 3, 4, 4, 5, 8, 4, 4, 4, 4, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
  4, 4, 8, 8, 8, 8, 13, 9, 9, 9, 9, 8, 8, 10, 9, 4, 7, 9, 8, 11, 9, 10, 9, 10,
  9, 9, 8, 9, 9, 13, 9, 8, 7, 4, 4, 4, 8, 7, 4, 8, 8, 7, 8, 8, 4, 8, 8, 4, 4, 7,
  4, 12, 8, 8, 8, 8, 5, 6, 4, 8, 7, 11, 8, 7, 7, 5, 3, 5, 8, 10, 7, 10, 4, 7, 7,
  13, 7, 7, 4, 12, 9, 4, 14, 10, 7, 10, 10, 4, 4, 7, 7, 5, 7, 13, 4, 13, 6, 4,
  12, 10, 7, 8, 4, 4, 7, 7, 7, 7, 3, 7, 4, 10, 5, 7, 8, 4, 10, 7, 5, 7, 4, 4, 4,
  7, 7, 4, 4, 4, 5, 7, 11, 11, 11, 8, 9, 9, 9, 9, 9, 9, 13, 9, 8, 8, 8, 8, 4, 4,
  4, 4, 9, 9, 10, 10, 10, 10, 10, 8, 10, 9, 9, 9, 9, 8, 9, 8, 8, 8, 8, 8, 8, 8,
  12, 7, 8, 8, 8, 8, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 7, 8, 8, 8, 8, 8, 7, 8, 7,
]

/** Get coordinates and size for one character. */
function getChar(asciiCode: number): CharacterCoordinates {
  const index = asciiCode - startIndex
  const x = Math.min(index % columns, columns - 1)
  const y = Math.min(Math.floor(index / columns), rows - 1)

  return {
    sx: x * cellWidth,
    sy: y * cellHeight,
    w: fontWidth[index],
    h: fontHeight,
  }
}

function measureText(text: string): TextMetrics {
  let width = 0

  for (let index = 0; index < text.length; ++index) {
    // eslint-disable-next-line unicorn/prefer-code-point
    width += fontWidth[Math.min(223, text.charCodeAt(index) - startIndex)]
  }

  return {
    width,
    actualBoundingBoxAscent: 0,
    actualBoundingBoxDescent: 0,
    actualBoundingBoxLeft: 0,
    actualBoundingBoxRight: 0,
    fontBoundingBoxAscent: 0,
    fontBoundingBoxDescent: 0,
  }
}

function spriteWrite(
  this: CanvasRenderingContext2D,
  text: string | undefined,
  x: number,
  y: number
): void {
  if (!text?.charCodeAt) return

  const align = this.textAlign

  if (align === "center" || align === "right") {
    const { width } = measureText(text)
    x -= align === "center" ? width / 2 : width
  }

  switch (this.textBaseline) {
    case "top":
    case "hanging":
      y -= fontHeight
      break

    case "middle":
    case "alphabetic":
    case "ideographic":
      y -= fontHeight / 2
      break

    default:
      break
  }

  characters.addEventListener("load", () => {
    for (let index = 0; index < text.length; ++index) {
      // eslint-disable-next-line unicorn/prefer-code-point
      const { sx, sy, w, h } = getChar(text.charCodeAt(index))
      this.drawImage(characters, sx, sy, w, h, x, y, w, h)
      x += w
    }
  })
}

export function spritingOn(ctx: MockCanvasRenderingContext2D): void {
  if (!ctx._fillText) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ctx._fillText = ctx.fillText
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ctx._measureText = ctx.measureText

    ctx.fillText = spriteWrite
    ctx.measureText = measureText
  }
}

export function spritingOff(ctx: MockCanvasRenderingContext2D): void {
  if (ctx._fillText && ctx._measureText) {
    ctx.fillText = ctx._fillText
    ctx.measureText = ctx._measureText
    delete ctx._fillText
    delete ctx._measureText
  }
}
