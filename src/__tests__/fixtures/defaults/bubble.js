/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "bubble",
    data: {
      labels: [1, 2, 3, 4, 5],
      datasets: [
        {
          data: [
            { x: 1, y: 10, r: 15 },
            { x: 2, y: 8, r: 20 },
            { x: 3, y: 12, r: 16 },
            { x: 4, y: 6, r: 18 },
            { x: 5, y: 15, r: 13 },
          ],
        },
        {
          data: [
            { x: 1, y: 5, r: 20 },
            { x: 2, y: 10, r: 30 },
            { x: 3, y: 6, r: 25 },
            { x: 4, y: 8, r: 28 },
            { x: 5, y: 3, r: 15 },
          ],
        },
      ],
    },
  },
}
