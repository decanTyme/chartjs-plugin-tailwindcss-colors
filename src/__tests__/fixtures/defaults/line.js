/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "line",
    data: {
      labels: [0, 1, 2, 3, 4, 5],
      datasets: [
        {
          data: [2, 4, 8, 5, 3, 6],
        },
        {
          data: [7, 6, 5, 2, 5, 9],
        },
      ],
    },
  },
}
